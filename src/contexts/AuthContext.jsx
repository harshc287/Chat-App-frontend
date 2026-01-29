import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken, getUserInfo, setToken, setUserInfo, removeToken, removeUserInfo } from '../utils/helpers';
import { initSocket, disconnectSocket } from '../utils/socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getToken();
    const userInfo = getUserInfo();
    
    if (token && userInfo) {
      setUser(userInfo);
      // Initialize socket connection when user is logged in
      initSocket();
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login({ email, password });
      
      // Store token and user info
      setToken(data.token);
      setUserInfo(data);
      setUser(data);
      
      // Initialize socket connection
      initSocket();
      
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      
      // Store token and user info
      setToken(data.token);
      setUserInfo(data);
      setUser(data);
      
      // Initialize socket connection
      initSocket();
      
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Disconnect socket
    disconnectSocket();
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUserInfo(data);
      setUser(data);
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return { success: false, error: err.response?.data?.message || 'Update failed' };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};