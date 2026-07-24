import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for httpOnly secure cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token fallback if available in localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response Interceptor: Handle errors globally
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Directly return the envelope data (includes success, data, meta)
  },
  (error) => {
    // Extract structural error message from our backend response envelope
    let errorPayload = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected connection error occurred.',
    };

    if (error.response && error.response.data) {
      const data = error.response.data;
      if (data.success === false && data.error) {
        errorPayload = data.error;
      } else if (data.detail) {
        errorPayload = {
          code: 'VALIDATION_ERROR',
          message: typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
        };
      }
    }

    // Auto-redirect on authentication expirations
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // We check if we are already on login page to avoid redirection loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = `/login?expired=true`;
      }
    }

    return Promise.reject(errorPayload);
  }
);

export default axiosClient;
