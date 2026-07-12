/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate required fields
 * @param {Object} data
 * @param {string[]} requiredFields
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate date is not in the past
 * @param {Date} date
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  return date >= new Date();
};

/**
 * Validate file upload
 * @param {File} file
 * @param {Object} options
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
  } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }

  return { valid: true };
};

