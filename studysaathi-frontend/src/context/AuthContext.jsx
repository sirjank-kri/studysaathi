import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is logged in on app load
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await api.get('/auth/profile/');
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  };

  // Signup - send OTP
  const signup = async (userData) => {
    const response = await api.post('/auth/signup/', userData);
    return response.data;
  };

  // Verify OTP and create account
  const verifyOTP = async (email, otp) => {
    const response = await api.post('/auth/verify-otp/', { email, otp });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      setUser(response.data.user);
    }
    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      setUser(response.data.user);
    }
    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Update profile
  const updateProfile = async (data) => {
    const response = await api.put('/auth/profile/', data);
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signup, 
      verifyOTP, 
      login, 
      logout, 
      setUser,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};