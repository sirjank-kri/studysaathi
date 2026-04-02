import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  signup: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  },

  resendOTP: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};