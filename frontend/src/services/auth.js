import api from './api.js';

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Register patient
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const registerPatient = async (data) => {
  const response = await api.post('/api/auth/register/patient', data);
  return response.data;
};

/**
 * Register doctor
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const registerDoctor = async (data) => {
  const response = await api.post('/api/auth/register/doctor', data);
  return response.data;
};

/**
 * Register admin
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const registerAdmin = async (data) => {
  const response = await api.post('/api/auth/register/admin', data);
  return response.data;
};

