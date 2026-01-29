import api from './api';

export const messageService = {
  // Send message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get all messages for a chat
  fetchMessages: async (chatId) => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (chatId) => {
    const response = await api.put(`/messages/${chatId}/read`);
    return response.data;
  },

  // Send file/attachment
  sendAttachment: async (formData) => {
    const response = await api.post('/messages/attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};