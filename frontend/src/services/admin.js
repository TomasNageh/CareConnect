import api from './api.js';

/**
 * Get all users
 * @param {string} [role]
 * @param {number} [page]
 * @param {number} [pageSize]
 * @returns {Promise<Object>}
 */
export const getAllUsers = async (role, page = 1, pageSize = 10) => {
  const response = await api.get('/api/admin/users', {
    params: { role, page, pageSize },
  });
  return response.data;
};

/**
 * Get user by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getUser = async (id) => {
  const response = await api.get(`/api/admin/users/${id}`);
  return response.data;
};

/**
 * Update user
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, data) => {
  const response = await api.put(`/api/admin/users/${id}`, data);
  return response.data;
};

/**
 * Delete user (deactivate)
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/api/admin/users/${id}`);
  return response.data;
};

/**
 * Activate user
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const activateUser = async (id) => {
  const response = await api.put(`/api/admin/users/${id}/activate`);
  return response.data;
};

/**
 * Get pending doctors
 * @returns {Promise<Array>}
 */
export const getPendingDoctors = async () => {
  const response = await api.get('/api/admin/doctors/pending');
  return response.data;
};

/**
 * Verify doctor
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const verifyDoctor = async (id) => {
  const response = await api.put(`/api/admin/doctors/${id}/verify`);
  return response.data;
};

/**
 * Get pending clinics
 * @returns {Promise<Array>}
 */
export const getPendingClinics = async () => {
  const response = await api.get('/api/admin/clinics/pending');
  return response.data;
};

/**
 * Verify clinic
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const verifyClinic = async (id) => {
  const response = await api.put(`/api/admin/clinics/${id}/verify`);
  return response.data;
};

/**
 * Get system analytics
 * @returns {Promise<Object>}
 */
export const getSystemAnalytics = async () => {
  const response = await api.get('/api/admin/analytics');
  return response.data;
};

/**
 * Get appointment reports
 * @param {string} [startDate]
 * @param {string} [endDate]
 * @returns {Promise<Object>}
 */
export const getAppointmentReports = async (startDate, endDate) => {
  const response = await api.get('/api/admin/reports/appointments', {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Get user reports
 * @param {string} [startDate]
 * @param {string} [endDate]
 * @returns {Promise<Object>}
 */
export const getUserReports = async (startDate, endDate) => {
  const response = await api.get('/api/admin/reports/users', {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Get complaints
 * @param {string} [status]
 * @param {number} [page]
 * @param {number} [pageSize]
 * @returns {Promise<Object>}
 */
export const getComplaints = async (status, page = 1, pageSize = 10) => {
  const response = await api.get('/api/admin/complaints', {
    params: { status, page, pageSize },
  });
  return response.data;
};

/**
 * Get complaint by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getComplaint = async (id) => {
  const response = await api.get(`/api/admin/complaints/${id}`);
  return response.data;
};

/**
 * Create complaint
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createComplaint = async (data) => {
  const response = await api.post('/api/admin/complaints', data);
  return response.data;
};

/**
 * Update complaint
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateComplaint = async (id, data) => {
  const response = await api.put(`/api/admin/complaints/${id}`, data);
  return response.data;
};

/**
 * Resolve complaint
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const resolveComplaint = async (id) => {
  const response = await api.put(`/api/admin/complaints/${id}/resolve`);
  return response.data;
};

/**
 * Delete complaint
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteComplaint = async (id) => {
  const response = await api.delete(`/api/admin/complaints/${id}`);
  return response.data;
};

