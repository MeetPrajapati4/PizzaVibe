import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = '/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || {}; 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pizza_token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('pizza_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('pizza_token');
    }
  }, [token]);

  // Initial load: Fetch profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('pizza_user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally verify with backend
          const res = await axios.get(`${API_URL}/profile`);
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('pizza_user', JSON.stringify(res.data.user));
          }
        } catch (e) {
          console.error('Auth verification failed', e);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { user: userData, token: newToken } = res.data;
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('pizza_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      return { success: true };
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const updateProfile = async (name, email) => {
    try {
      const res = await axios.put(`${API_URL}/profile`, { name, email });
      const { user: userData } = res.data;
      setUser(userData);
      localStorage.setItem('pizza_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pizza_user');
    localStorage.removeItem('pizza_token');
  };

  const value = { 
    user, 
    token,
    loading,
    login, 
    register,
    updateProfile,
    logout, 
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

