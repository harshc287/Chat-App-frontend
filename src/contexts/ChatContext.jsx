import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';
import { chatService } from '../services/chatService';
import { messageService } from '../services/messageService';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Fetch all chats (memoized)
  const fetchChats = useCallback(async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const data = await chatService.fetchChats();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // ✅ Fetch messages
  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;

      try {
        const data = await messageService.fetchMessages(chatId);
        setMessages(data);

let markReadTimeout;

if (user) {
  clearTimeout(markReadTimeout);
  markReadTimeout = setTimeout(() => {
    messageService.markAsRead(chatId).catch(() => {});
  }, 500);
}
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    [user]
  );

  // ✅ Access chat
  const accessChat = useCallback(
    async (userId) => {
      try {
        const data = await chatService.accessChat(userId);

        setChats((prev) =>
          prev.find((c) => c._id === data._id) ? prev : [data, ...prev]
        );

        setSelectedChat(data);
        fetchMessages(data._id);

        return data;
      } catch (error) {
        console.error('Error accessing chat:', error);
        throw error;
      }
    },
    [fetchMessages]
  );

  // ✅ Send message
  const sendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    const tempId = Date.now().toString();

    const tempMessage = {
      _id: tempId,
      content: content.trim(),
      sender: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture
      },
      chat: selectedChat._id,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const data = await messageService.sendMessage({
        content: content.trim(),
        chatId: selectedChat._id
      });

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? data : m))
      );

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, latestMessage: data }
            : chat
        )
      );

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      throw error;
    }
  };

  // ✅ Add incoming message
  const addMessage = useCallback(
    (message) => {
      if (selectedChat?._id === message.chat) {
        setMessages((prev) => [...prev, message]);
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === message.chat
              ? { ...chat, latestMessage: message }
              : chat
          )
        );
      } else {
        setNotification((prev) => [...prev, message]);
      }
    },
    [selectedChat]
  );

  // ✅ Create group chat
  const createGroupChat = async (groupData) => {
    try {
      const data = await chatService.createGroupChat(groupData);
      setChats((prev) => [data, ...prev]);
      setSelectedChat(data);
      return data;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  };

  // ✅ Clear notification (memoized)
  const clearNotification = useCallback((chatId) => {
    setNotification((prev) =>
      prev.filter((notif) => notif.chat !== chatId)
    );
  }, []);

  // ✅ Fetch chats when user logs in
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const value = {
    chats,
    selectedChat,
    messages,
    loading,
    notification,
    typing,
    isTyping,
    setSelectedChat,
    fetchChats,
    accessChat,
    fetchMessages,
    sendMessage,
    addMessage,
    createGroupChat,
    setTyping,
    setIsTyping,
    clearNotification
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
