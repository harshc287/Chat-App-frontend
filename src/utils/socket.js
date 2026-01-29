import io from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from './constants';
import { getToken } from './helpers';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const token = getToken();
    if(!token) return null; 
    
    socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper functions for socket events
export const joinChatRoom = (chatId) => {
  if (socket) {
    socket.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
  }
};

export const leaveChatRoom = (chatId) => {
  if (socket) {
    socket.emit(SOCKET_EVENTS.LEAVE_CHAT, chatId);
  }
};

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
  }
};

export const sendTypingIndicator = (chatId, isTyping) => {
  if (socket) {
    socket.emit(SOCKET_EVENTS.USER_TYPING, { chatId, isTyping });
  }
};

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }
};

export const offReceiveMessage = (callback) => {
  if (socket) {
    socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }
};

export const onMessageSent = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.MESSAGE_SENT, callback);
  }
};

export const onUserTyping = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.USER_TYPING_INDICATOR, callback);
  }
};

export const onUserOnline = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.USER_ONLINE, callback);
  }
};

export const onUserOffline = (callback) => {
  if (socket) {
    socket.on(SOCKET_EVENTS.USER_OFFLINE, callback);
  }
};