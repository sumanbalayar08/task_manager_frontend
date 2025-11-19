import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent multiple redirects
    if (originalRequest._redirectHandled) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._redirectHandled = true;

      const isAuthEndpoint =
        originalRequest.url?.includes('/login') ||
        originalRequest.url?.includes('/register');

      // Only redirect if it's not an auth endpoint and we're not already on signin page
      if (!isAuthEndpoint && !window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
        return Promise.reject(error);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      originalRequest._redirectHandled = true;
      
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
        return Promise.reject(error);
      }
    }

    if (!error.response) {
      console.error('Network error:', error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;