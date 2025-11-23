import { instance } from './axios';

/**
 * Get list of chat messages
 * @param {string} token - Authentication token
 * @param {number} limit - Maximum number of messages to retrieve (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} Array of messages
 */
export const getMessages = async (token, limit = 50, offset = 0) => {
  const response = await instance.get('/api/messages/', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      limit,
      offset
    }
  });
  
  return response.data;
};

/**
 * Send message to chat
 * @param {string} token - Authentication token
 * @param {string} text - Message text
 * @returns {Promise} Created message data
 */
export const sendMessage = async (token, text) => {
  const response = await instance.post('/api/messages/', 
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};
