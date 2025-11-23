import { instance } from './axios';

/**
 * Get user profile
 * @param {string} token - Authentication token
 * @returns {Promise} User profile data
 */
export const getProfile = async (token) => {
  const response = await instance.get('/api/profile/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};

/**
 * Update user profile
 * @param {string} token - Authentication token
 * @param {object} data - Profile data to update
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (token, data) => {
  const response = await instance.put('/api/profile/', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
