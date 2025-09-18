export interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}