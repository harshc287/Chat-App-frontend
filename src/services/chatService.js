import api from './api';
import { getToken } from '../utils/helpers';

const getAuthConfig = () => {
  const token = getToken(); // fetch token from localStorage
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const chatService = {
  accessChat: async (userId) => {
    const response = await api.post('/chats', { userId }, getAuthConfig());
    return response.data;
  },

  fetchChats: async () => {
    const response = await api.get('/chats', getAuthConfig());
    return response.data;
  },

  createGroupChat: async (groupData) => {
    const response = await api.post('/chats/group', groupData, getAuthConfig());
    return response.data;
  },

  renameGroup: async (chatId, chatName) => {
    const response = await api.put('/chats/group/rename', { chatId, chatName }, getAuthConfig());
    return response.data;
  },

  addToGroup: async (chatId, userId) => {
    const response = await api.put('/chats/group/add', { chatId, userId }, getAuthConfig());
    return response.data;
  },

  removeFromGroup: async (chatId, userId) => {
    const response = await api.put('/chats/group/remove', { chatId, userId }, getAuthConfig());
    return response.data;
  },

  getChatById: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`, getAuthConfig());
    return response.data;
  }
};
