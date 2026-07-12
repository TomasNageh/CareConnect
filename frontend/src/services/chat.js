import api from './api.js';

/**
 * Get chat history with a user
 * @param {number} otherUserId
 * @returns {Promise<Array>}
 */
export const getChatHistory = async (otherUserId) => {
  const response = await api.get(`/api/chat/history/${otherUserId}`);
  return response.data;
};

/**
 * Get all conversations
 * @returns {Promise<Array>}
 */
export const getConversations = async () => {
  const response = await api.get('/api/chat/conversations');
  return response.data;
};

/**
 * Send message
 * @param {Object} data - { receiverId, message }
 * @returns {Promise<Object>}
 */
export const sendMessage = async (data) => {
  const response = await api.post('/api/chat/send', data);
  return response.data;
};

