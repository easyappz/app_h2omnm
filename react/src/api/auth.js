import { instance } from './axios';

/**
 * Register new user
 * @param {string} username - Username for registration
 * @param {string} password - Password for registration
 * @returns {Promise} Response with token
 */
export const registerUser = async (username, password) => {
  const response = await instance.post('/api/auth/register/', {
    username,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

/**
 * Login user
 * @param {string} username - Username for login
 * @param {string} password - Password for login
 * @returns {Promise} Response with token
 */
export const loginUser = async (username, password) => {
  const response = await instance.post('/api/auth/login/', {
    username,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

/**
 * Get current user information
 * @param {string} token - Authentication token
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async (token) => {
  const response = await instance.get('/api/auth/me/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
