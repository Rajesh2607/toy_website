// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug API configuration in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Environment:', import.meta.env.MODE);
}

// Error handler for API responses
const handleApiError = async (response) => {
  if (!response.ok) {
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    const error = await response.json().catch(() => ({ 
      message: `Network error: ${response.status} ${response.statusText}` 
    }));
    
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    return await handleApiError(response);
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// API service object
export const apiService = {
  // Generic methods
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) => apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint, data) => apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  patch: (endpoint, data) => apiRequest(endpoint, { 
    method: 'PATCH', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export default apiService;
