import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Change this to your deployed backend URL
const API_URL = 'https://gisc-app-production.up.railway.app/api';
// For production: 'https://your-backend-url.com/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('gisc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.removeItem('gisc_token');
      await AsyncStorage.removeItem('gisc_user');
      // Navigation to login would be handled by the auth context
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
