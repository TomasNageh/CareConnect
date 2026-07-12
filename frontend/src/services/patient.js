import api from './api.js';

/**
 * Get patient profile
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  const response = await api.get('/api/patient/profile');
  return response.data;
};

/**
 * Update patient profile
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/patient/profile', data);
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
  const response = await api.post('/api/patient/upload-profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Search doctors
 * @param {Object} params - { specialty, location, minRating, availableDate, page, pageSize }
 * @returns {Promise<Object>}
 */
export const searchDoctors = async (params = {}) => {
  const response = await api.get('/api/patient/doctors/search', { params });
  return response.data;
};

/**
 * Get available slots for a doctor/clinic
 * @param {number} doctorId
 * @param {number} clinicId - Required
 * @param {string} [date] - Date in YYYY-MM-DD format (optional, filters out booked slots)
 * @returns {Promise<Array>}
 */
export const getAvailableSlots = async (doctorId, clinicId, date = null) => {
  const params = { clinicId };
  if (date) params.date = date;
  const response = await api.get(`/api/patient/doctors/${doctorId}/slots`, { params });
  return response.data;
};

/**
 * Get appointments
 * @returns {Promise<Array>}
 */
export const getAppointments = async () => {
  const response = await api.get('/api/patient/appointments');
  return response.data;
};

/**
 * Get appointment by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getAppointment = async (id) => {
  const response = await api.get(`/api/patient/appointments/${id}`);
  return response.data;
};

/**
 * Book appointment
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const bookAppointment = async (data) => {
  const response = await api.post('/api/patient/appointments', data);
  return response.data;
};

/**
 * Update appointment
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateAppointment = async (id, data) => {
  const response = await api.put(`/api/patient/appointments/${id}`, data);
  return response.data;
};

/**
 * Cancel appointment
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const cancelAppointment = async (id) => {
  const response = await api.delete(`/api/patient/appointments/${id}`);
  return response.data;
};

/**
 * Get medical history
 * @returns {Promise<Array>}
 */
export const getMedicalHistory = async () => {
  const response = await api.get('/api/patient/medical-history');
  return response.data;
};

/**
 * Get medical record by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getMedicalRecord = async (id) => {
  const response = await api.get(`/api/patient/medical-history/${id}`);
  return response.data;
};

/**
 * Add medical record
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addMedicalRecord = async (data) => {
  const response = await api.post('/api/patient/medical-history', data);
  return response.data;
};

/**
 * Update medical record
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateMedicalRecord = async (id, data) => {
  const response = await api.put(`/api/patient/medical-history/${id}`, data);
  return response.data;
};

/**
 * Delete medical record
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteMedicalRecord = async (id) => {
  const response = await api.delete(`/api/patient/medical-history/${id}`);
  return response.data;
};

/**
 * Add review
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addReview = async (data) => {
  const response = await api.post('/api/patient/reviews', data);
  return response.data;
};

/**
 * Get my reviews
 * @returns {Promise<Array>}
 */
export const getMyReviews = async () => {
  const response = await api.get('/api/patient/reviews');
  return response.data;
};

/**
 * Update review
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateReview = async (id, data) => {
  const response = await api.put(`/api/patient/reviews/${id}`, data);
  return response.data;
};

/**
 * Delete review
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteReview = async (id) => {
  const response = await api.delete(`/api/patient/reviews/${id}`);
  return response.data;
};

/**
 * Get reviews for a specific doctor (public)
 * @param {number} doctorId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<Object>}
 */
export const getDoctorReviews = async (doctorId, page = 1, pageSize = 10) => {
  const response = await api.get(`/api/patient/doctors/${doctorId}/reviews`, {
    params: { page, pageSize }
  });
  return response.data;
};

/**
 * Get my review for a specific doctor
 * @param {number} doctorId
 * @returns {Promise<Object>}
 */
export const getMyReviewForDoctor = async (doctorId) => {
  const response = await api.get(`/api/patient/reviews/doctor/${doctorId}`);
  return response.data;
};

/**
 * Get clinic details by ID (public)
 * @param {number} clinicId
 * @returns {Promise<Object>}
 */
export const getClinic = async (clinicId) => {
  const response = await api.get(`/api/patient/clinics/${clinicId}`);
  return response.data;
};

/**
 * Get notifications
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<Object>}
 */
export const getNotifications = async (page = 1, pageSize = 10) => {
  const response = await api.get('/api/patient/notifications', {
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
  const response = await api.put(`/api/patient/notifications/${id}/read`);
  return response.data;
};

/**
 * Delete notification
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`/api/patient/notifications/${id}`);
  return response.data;
};

