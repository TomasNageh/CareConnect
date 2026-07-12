import api from './api.js';

/**
 * Get doctor profile
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  const response = await api.get('/api/doctor/profile');
  return response.data;
};

/**
 * Update doctor profile
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/doctor/profile', data);
  return response.data;
};

/**
 * Upload profile image
 * @param {File} file
 * @returns {Promise<Object>}
 */
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/doctor/upload-profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Create clinic
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createClinic = async (data) => {
  const response = await api.post('/api/doctor/clinics', data);
  return response.data;
};

/**
 * Get my clinics
 * @returns {Promise<Array>}
 */
export const getMyClinics = async () => {
  const response = await api.get('/api/doctor/clinics');
  return response.data;
};

/**
 * Get clinic by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getClinic = async (id) => {
  const response = await api.get(`/api/doctor/clinics/${id}`);
  return response.data;
};

/**
 * Update clinic
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateClinic = async (id, data) => {
  const response = await api.put(`/api/doctor/clinics/${id}`, data);
  return response.data;
};

/**
 * Delete clinic
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteClinic = async (id) => {
  const response = await api.delete(`/api/doctor/clinics/${id}`);
  return response.data;
};

/**
 * Get slots for a clinic
 * @param {number} clinicId
 * @returns {Promise<Array>}
 */
export const getSlots = async (clinicId) => {
  const response = await api.get(`/api/doctor/clinics/${clinicId}/slots`);
  return response.data;
};

/**
 * Add a slot
 * @param {number} clinicId
 * @param {Object} data - { startTime, endTime }
 * @returns {Promise<Object>}
 */
export const addSlot = async (clinicId, data) => {
  const response = await api.post(`/api/doctor/clinics/${clinicId}/slots`, data);
  return response.data;
};

/**
 * Update a slot
 * @param {number} clinicId
 * @param {number} slotId
 * @param {Object} data - { startTime?, endTime?, disabled? }
 * @returns {Promise<Object>}
 */
export const updateSlot = async (clinicId, slotId, data) => {
  const response = await api.put(`/api/doctor/clinics/${clinicId}/slots/${slotId}`, data);
  return response.data;
};

/**
 * Delete a slot
 * @param {number} clinicId
 * @param {number} slotId
 * @returns {Promise<Object>}
 */
export const deleteSlot = async (clinicId, slotId) => {
  const response = await api.delete(`/api/doctor/clinics/${clinicId}/slots/${slotId}`);
  return response.data;
};


/**
 * Get patient history
 * @param {number} patientId
 * @returns {Promise<Array>}
 */
export const getPatientHistory = async (patientId) => {
  const response = await api.get(`/api/doctor/patients/${patientId}/history`);
  return response.data;
};

/**
 * Get dashboard data
 * @returns {Promise<Object>}
 */
export const getDashboard = async () => {
  const response = await api.get('/api/doctor/dashboard');
  return response.data;
};

/**
 * Get notifications
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<Object>}
 */
export const getNotifications = async (page = 1, pageSize = 10) => {
  const response = await api.get('/api/doctor/notifications', {
    params: { page, pageSize },
  });
  return response.data;
};

/**
 * Mark notification as read
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const markNotificationRead = async (id) => {
  const response = await api.put(`/api/doctor/notifications/${id}/read`);
  return response.data;
};

/**
 * Delete notification
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`/api/doctor/notifications/${id}`);
  return response.data;
};

