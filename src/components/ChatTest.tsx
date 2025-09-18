import { useState } from 'react'
import { sendChatMessage } from '../services/api'

export const ChatTest = () => {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const aiResponse = await sendChatMessage(message)
      setResponse(aiResponse)
    } catch (error) {
      setResponse(`에러: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">AI 채팅 테스트</h2>

      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="w-full p-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
      </div>

      <button
        onClick={handleSendMessage}
        disabled={loading || !message.trim()}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {loading ? '전송 중...' : '전송'}
      </button>

      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <strong>AI 응답:</strong>
          <p className="mt-1">{response}</p>
        </div>
      )}
    </div>
  )
}