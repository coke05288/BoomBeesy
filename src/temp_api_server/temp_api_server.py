# bff/app.py
import os, json, csv, asyncio
from typing import Dict, Any, List, Tuple

import httpx
import numpy as np
import faiss

from fastapi import FastAPI, Header, Depends, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from loguru import logger

from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sentence_transformers import SentenceTransformer, CrossEncoder

# =========================
# 환경 변수
# =========================
API_KEY           = os.getenv("API_KEY", "")  # 비우면 Bearer 인증 비활성화
BASIC_AUTH_USER   = os.getenv("BASIC_AUTH_USER", "")
BASIC_AUTH_PASS   = os.getenv("BASIC_AUTH_PASS", "")

VLLM_BASE_URL     = os.getenv("VLLM_BASE_URL", "http://vllm:8000/v1")
MODEL_ID          = os.getenv("MODEL_ID", "meta-llama/Meta-Llama-3-8B-Instruct")
CONTEXT_WINDOW    = int(os.getenv("CONTEXT_WINDOW", 8192))
TOP_K             = int(os.getenv("TOP_K", 4))
MAX_CONTEXT_CHARS = int(os.getenv("MAX_CONTEXT_CHARS", 2400))
USE_RERANKER      = os.getenv("USE_RERANKER", "true").lower() == "true"
RERANKER_MODEL    = os.getenv("RERANKER_MODEL", "BAAI/bge-reranker-v2-m3")
EMBED_MODEL       = os.getenv("EMBED_MODEL", "BAAI/bge-m3")
INDICES_DIR       = os.getenv("INDICES_DIR", "indices")

# 파일 경로
FAISS_PATH   = os.path.join(INDICES_DIR, "faiss.index")
META_JSON    = os.path.join(INDICES_DIR, "meta.json")
META_CSV     = os.path.join(INDICES_DIR, "df_idx.csv")  # 네가 만든 CSV
BM25_PKL     = os.path.join(INDICES_DIR, "bm25.pkl")    # 네가 만든 BM25

# =========================
# FastAPI & CORS
# =========================
security = HTTPBasic()
app = FastAPI(title="BFF for vLLM + RAG (Hybrid BM25 + Dense)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 운영 시 특정 도메인만 허용 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 전역 상태 (인덱스/모델)
# =========================
index: faiss.Index | None = None
id2meta: List[Dict[str, Any]] = []
emb_model: SentenceTransformer | None = None
reranker: CrossEncoder | None = None
bm25_obj = None
bm25_corpus = None  # 저장 포맷에 맞게 사용 (토크나이즈된 리스트 등)

# =========================
# 프롬프트 템플릿 (RAG 전용)
# =========================
SYSTEM_RAG = """
너는 도메인 특화 어시스턴트다. 반드시 제공된 컨텍스트만 인용해 답한다.
불확실하거나 근거가 부족하면 "근거 불충분"을 명시한다.
답변 마지막에 참고한 소스의 제목/문서ID를 목록으로 제시한다.
""".strip()

USER_RAG = """
질문: {query}

[컨텍스트]
{context}

요구사항:
1) 핵심 요약 → 2) 근거 인용 → 3) 최종 답변 순으로 항목화.
4) 컨텍스트 밖 추론 금지. 근거 불충분 시 명시.
""".strip()

# =========================
# 인증 유틸
# =========================
def require_auth(
    authorization: str | None = Header(None),
    creds: HTTPBasicCredentials = Depends(security),
):
    # 1) Bearer API_KEY가 설정된 경우: Bearer 우선 적용
    if API_KEY:
        if authorization != f"Bearer {API_KEY}":
            raise HTTPException(status_code=401, detail="Unauthorized (Bearer)")
        return True
    # 2) Basic Auth가 설정된 경우
    if BASIC_AUTH_USER and BASIC_AUTH_PASS:
        if creds.username != BASIC_AUTH_USER or creds.password != BASIC_AUTH_PASS:
            raise HTTPException(status_code=401, detail="Unauthorized (Basic)")
        return True
    # 3) 인증 비활성화
    return True

# =========================
# 유틸
# =========================
def _load_meta() -> List[Dict[str, Any]]:
    if os.path.exists(META_JSON):
        with open(META_JSON, "r", encoding="utf-8") as f:
            meta = json.load(f)
        logger.info(f"Loaded meta.json ({len(meta)} entries)")
        return meta

    if os.path.exists(META_CSV):
        rows: List[Dict[str, Any]] = []
        with open(META_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 네 CSV 컬럼명을 아래 표준 키로 맵핑
                rows.append({
                    "doc_id":   row.get("doc_id") or row.get("document_id") or "",
                    "title":    row.get("title") or row.get("doc_title") or "",
                    "path":     row.get("path") or "",
                    "chunk_id": int(row.get("chunk_id") or row.get("chunk_index") or 0),
                    "text":     row.get("text") or row.get("chunk_text") or "",
                })
        logger.info(f"Loaded df_idx.csv ({len(rows)} entries)")
        return rows

    logger.warning("No meta.json or df_idx.csv found.")
    return []

def _safe_get(idx: int) -> Dict[str, Any] | None:
    if 0 <= idx < len(id2meta):
        return dict(id2meta[idx])
    return None

def _encode_queries(texts: List[str]) -> np.ndarray:
    assert emb_model is not None, "Embedder not loaded"
    vecs = emb_model.encode(texts, normalize_embeddings=True, convert_to_numpy=True)
    return vecs.astype("float32")

def _retrieve_dense(query: str, top_k: int) -> List[Dict[str, Any]]:
    if index is None or not id2meta:
        return []
    q = _encode_queries([query])
    scores, ids = index.search(q, top_k)
    ids = ids[0].tolist()
    scores = scores[0].tolist()
    out = []
    for i, s in zip(ids, scores):
        if i == -1:
            continue
        meta = _safe_get(i)
        if meta:
            meta = dict(meta)
            meta["score"] = float(s)
            out.append(meta)
    return out

def _retrieve_sparse(query: str, top_k: int) -> List[Dict[str, Any]]:
    """BM25 상위 후보를 meta와 매칭. bm25 저장 포맷에 맞게 조정 필요."""
    if bm25_obj is None or not id2meta:
        return []
    try:
        # 예: bm25_obj가 BM25Okapi, bm25_corpus는 토크나이즈된 리스트라고 가정
        # 실제 저장 포맷에 맞게 query 토큰화 함수를 바꿔줘야 함
        tokens = query.split()
        scores = bm25_obj.get_scores(tokens)
        # 상위 top_k*2 넉넉히 가져와서 후에 리랭크/퓨전
        ranked_ids = np.argsort(scores)[::-1][:max(top_k * 2, top_k)]
        out = []
        for i in ranked_ids:
            meta = _safe_get(int(i))
            if meta:
                meta = dict(meta)
                meta["bm25_score"] = float(scores[i])
                out.append(meta)
        return out
    except Exception as e:
        logger.warning(f"BM25 retrieval failed: {e}")
        return []

def _rrf_fuse(dense_list: List[Dict[str, Any]], sparse_list: List[Dict[str, Any]], top_k: int, k: int = 60) -> List[Dict[str, Any]]:
    """Reciprocal Rank Fusion"""
    rankmap: Dict[Tuple[Any, Any], Dict[str, Any]] = {}

    def _accumulate(lst: List[Dict[str, Any]]):
        for rank, item in enumerate(lst, start=1):
            key = (item.get("doc_id"), item.get("chunk_id"))
            if key not in rankmap:
                rankmap[key] = {"item": item, "rrf": 0.0}
            rankmap[key]["rrf"] += 1.0 / (k + rank)

    _accumulate(sorted(dense_list, key=lambda x: x.get("score", 0), reverse=True))
    _accumulate(sorted(sparse_list, key=lambda x: x.get("bm25_score", 0), reverse=True))

    fused = sorted(rankmap.values(), key=lambda x: x["rrf"], reverse=True)
    return [x["item"] for x in fused][:top_k]

def _rerank(query: str, cands: List[Dict[str, Any]], top_k: int) -> List[Dict[str, Any]]:
    if not USE_RERANKER or reranker is None or not cands:
        return cands[:top_k]
    pairs = [(query, c["text"]) for c in cands]
    scores = reranker.predict(pairs).tolist()
    for c, s in zip(cands, scores):
        c["rerank_score"] = float(s)
    cands.sort(key=lambda x: x.get("rerank_score", 0.0), reverse=True)
    return cands[:top_k]

def _build_context(chunks: List[Dict[str, Any]], max_chars: int) -> str:
    out, cur = [], 0
    for i, c in enumerate(chunks, 1):
        piece = f"{i}) {c.get('title','no-title')} (id={c.get('doc_id','?')}):\n{c.get('text','').strip()}\n"
        if cur + len(piece) > max_chars:
            break
        out.append(piece)
        cur += len(piece)
    return "\n".join(out)

async def _stream_post(url: str, payload: Dict[str, Any]):
    # vLLM(OpenAI 호환)로 SSE 스트리밍 프록시
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, json=payload, headers={"Content-Type": "application/json"}) as r:
            async for chunk in r.aiter_bytes():
                yield chunk

# =========================
# 모델 로딩
# =========================
async def load_components():
    global index, id2meta, emb_model, reranker, bm25_obj, bm25_corpus

    # Meta
    id2meta = _load_meta()

    # FAISS
    if os.path.exists(FAISS_PATH):
        index = faiss.read_index(FAISS_PATH)
        logger.info("Loaded FAISS index")
    else:
        logger.warning("FAISS index not found. Dense retrieval disabled.")

    # Embedder
    emb_model = SentenceTransformer(EMBED_MODEL)
    logger.info(f"Loaded embedder: {EMBED_MODEL}")

    # Cross-Encoder reranker
    if USE_RERANKER:
        try:
            reranker = CrossEncoder(RERANKER_MODEL)
            logger.info(f"Loaded reranker: {RERANKER_MODEL}")
        except Exception as e:
            reranker = None
            logger.warning(f"Reranker load failed: {e}")

    # BM25
    if os.path.exists(BM25_PKL):
        try:
            import pickle
            with open(BM25_PKL, "rb") as f:
                saved = pickle.load(f)
            # 예상 포맷 예시:
            # saved = {"bm25": <BM25Okapi>, "corpus": <tokenized list or raw>}
            bm25_obj = saved.get("bm25")
            bm25_corpus = saved.get("corpus")
            logger.info("Loaded BM25 pickle")
        except Exception as e:
            logger.warning(f"BM25 load failed: {e}")

@app.on_event("startup")
async def _startup():
    await load_components()

# =========================
# 스키마
# =========================
class ChatBody(BaseModel):
    messages: List[Dict[str, Any]]
    model: str | None = None
    temperature: float | None = 0.2
    stream: bool | None = True

class AnswerBody(BaseModel):
    query: str
    top_k: int | None = TOP_K
    stream: bool | None = True

# =========================
# 엔드포인트
# =========================
@app.get("/healthz")
async def healthz():
    return {"ok": True}

@app.post("/chat")
async def chat(
    body: ChatBody,
    _: bool = Depends(require_auth),
):
    payload = {
        "model": body.model or MODEL_ID,
        "messages": body.messages,
        "temperature": body.temperature or 0.2,
        "stream": bool(body.stream),
    }
    url = f"{VLLM_BASE_URL}/chat/completions"

    if body.stream:
        return StreamingResponse(_stream_post(url, payload), media_type="text/event-stream")
    else:
        async with httpx.AsyncClient(timeout=None) as client:
            r = await client.post(url, json=payload)
            # vLLM 에러 전달
            try:
                data = r.json()
            except Exception:
                raise HTTPException(status_code=r.status_code, detail=r.text)
            if r.status_code >= 400:
                raise HTTPException(status_code=r.status_code, detail=data)
            return JSONResponse(status_code=r.status_code, content=data)

@app.post("/answer")
async def answer(
    body: AnswerBody,
    _: bool = Depends(require_auth),
):
    top_k = body.top_k or TOP_K

    # 1) 하이브리드 검색 (Dense + BM25 → RRF)
    dense  = _retrieve_dense(body.query, top_k=max(top_k * 2, top_k))
    sparse = _retrieve_sparse(body.query, top_k=max(top_k * 2, top_k))
    fused  = _rrf_fuse(dense, sparse, top_k=top_k)

    # 2) 리랭크(옵션)
    hits = _rerank(body.query, fused, top_k=top_k)

    # 3) 컨텍스트 구성
    context_text = _build_context(hits, MAX_CONTEXT_CHARS)

    # 4) vLLM 호출 메시지
    messages = [
        {"role": "system", "content": SYSTEM_RAG},
        {"role": "user", "content": USER_RAG.format(query=body.query, context=context_text)},
    ]

    payload = {
        "model": MODEL_ID,
        "messages": messages,
        "temperature": 0.2,
        "stream": bool(body.stream),
    }
    url = f"{VLLM_BASE_URL}/chat/completions"

    # 5) 스트리밍/논스트리밍
    if body.stream:
        return StreamingResponse(_stream_post(url, payload), media_type="text/event-stream")
    else:
        async with httpx.AsyncClient(timeout=None) as client:
            r = await client.post(url, json=payload)
            try:
                data = r.json()
            except Exception:
                raise HTTPException(status_code=r.status_code, detail=r.text)
            if r.status_code >= 400:
                raise HTTPException(status_code=r.status_code, detail=data)

        return JSONResponse(
            content={
                "answer": data,
                "sources": [
                    {
                        "doc_id": h.get("doc_id"),
                        "title": h.get("title"),
                        "score": h.get("score"),
                        "bm25_score": h.get("bm25_score"),
                        "rerank_score": h.get("rerank_score"),
                        "chunk_id": h.get("chunk_id"),
                    }
                    for h in hits
                ],
            }
        )
