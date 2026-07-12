/**
 * Converts a relative image URL from the backend to an absolute URL
 * @param {string|null|undefined} imageUrl - The image URL from the backend (e.g., "/images/profiles/...")
 * @returns {string|null} - The absolute URL or null if no imageUrl provided
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  // If it's already an absolute URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Get the backend base URL from environment or default
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  
  // Remove leading slash if present and combine with base URL
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${API_BASE_URL}${cleanPath}`;
}

