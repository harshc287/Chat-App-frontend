export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';


export const USER_TOKEN = 'chat-user-token';
export const USER_INFO = 'chat-user-info';

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file'
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_CHAT: 'join-chat',
  LEAVE_CHAT: 'leave-chat',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  MESSAGE_SENT: 'message-sent',
  USER_TYPING: 'typing',
  USER_TYPING_INDICATOR: 'user-typing',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  CONNECT_ERROR: 'connect_error'
};