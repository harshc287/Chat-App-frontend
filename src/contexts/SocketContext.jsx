import React, { createContext, useContext, useEffect } from 'react';
import { useChat } from './ChatContext';
import { useAuth } from './AuthContext';
import { 
  getSocket, 
  onReceiveMessage, 
  onUserTyping, 
  onUserOnline,
  onUserOffline,
  joinChatRoom,
  leaveChatRoom 
} from '../utils/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { addMessage, selectedChat, setIsTyping } = useChat();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    // Handle received messages
    const handleReceiveMessage = (message) => {
      addMessage(message);
    };

    // Handle typing indicator
    const handleUserTyping = (data) => {
      if (selectedChat && selectedChat._id === data.chatId) {
        setIsTyping(data.isTyping);
      }
    };

    // Handle user online
    const handleUserOnline = (data) => {
      console.log('User online:', data.userId);
      // Update user online status in your state
    };

    // Handle user offline
    const handleUserOffline = (data) => {
      console.log('User offline:', data.userId);
      // Update user offline status in your state
    };

    // Register event listeners
    onReceiveMessage(handleReceiveMessage);
    onUserTyping(handleUserTyping);
    onUserOnline(handleUserOnline);
    onUserOffline(handleUserOffline);

    // Cleanup
    return () => {
      socket?.off('receive-message', handleReceiveMessage);
      socket?.off('user-typing', handleUserTyping);
      socket?.off('user-online', handleUserOnline);
      socket?.off('user-offline', handleUserOffline);
    };
  }, [user, selectedChat, addMessage, setIsTyping]);

  useEffect(() => {
    if (selectedChat) {
      // Join chat room when chat is selected
      joinChatRoom(selectedChat._id);
      
      // Leave previous chat room when changing chats
      return () => {
        leaveChatRoom(selectedChat._id);
      };
    }
  }, [selectedChat]);

  const value = {
    // Add socket utility functions here if needed
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};