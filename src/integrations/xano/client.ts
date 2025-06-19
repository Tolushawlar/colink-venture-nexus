// Xano API client configuration
import axios from 'axios';

// Replace with your actual Xano API endpoint
const XANO_API_URL = "https://your-xano-instance.xano.io/api:your-api-key";

// Create axios instance with base configuration
export const xanoClient = axios.create({
  baseURL: XANO_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for authentication
xanoClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const xanoApi = {
  // Authentication
  auth: {
    signIn: async (email: string, password: string) => {
      const response = await xanoClient.post('/auth/login', { email, password });
      if (response.data.authToken) {
        localStorage.setItem('authToken', response.data.authToken);
      }
      return response.data;
    },
    signUp: async (email: string, password: string, userData: Record<string, any> = {}) => {
      const response = await xanoClient.post('/auth/signup', { 
        email, 
        password,
        ...userData
      });
      return response.data;
    },
    signOut: async () => {
      localStorage.removeItem('authToken');
      return true;
    },
    getUser: async () => {
      const response = await xanoClient.get('/auth/me');
      return response.data;
    },
    updateUser: async (userData: Record<string, any>) => {
      const response = await xanoClient.put('/auth/update', userData);
      return response.data;
    }
  },
  
  // Generic CRUD operations
  get: async (endpoint: string, params = {}) => {
    const response = await xanoClient.get(endpoint, { params });
    return response.data;
  },
  post: async (endpoint: string, data = {}) => {
    const response = await xanoClient.post(endpoint, data);
    return response.data;
  },
  put: async (endpoint: string, data = {}) => {
    const response = await xanoClient.put(endpoint, data);
    return response.data;
  },
  delete: async (endpoint: string, params = {}) => {
    const response = await xanoClient.delete(endpoint, { params });
    return response.data;
  }
};