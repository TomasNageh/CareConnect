import api from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Upload profile image for patient
 * @param {File} file
 * @returns {Promise<Object>}
 */
export const uploadPatientProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/patient/upload-profile-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

/**
 * Upload profile image for doctor
 * @param {File} file
 * @returns {Promise<Object>}
 */
export const uploadDoctorProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/doctor/upload-profile-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

