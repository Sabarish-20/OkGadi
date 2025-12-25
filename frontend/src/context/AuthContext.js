import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:8000/api';

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

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('okgadi_user');
    const token = localStorage.getItem('okgadi_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      // Use the JSON login endpoint
      const response = await axios.post(`${API_URL}/auth/login-json`, {
        email,
        password
      });

      const { access_token, name, role: userRole, user_id } = response.data;

      const userData = {
        id: user_id,
        email,
        name,
        role: userRole,
        token: access_token
      };

      setUser(userData);
      localStorage.setItem('okgadi_user', JSON.stringify(userData));
      localStorage.setItem('okgadi_token', access_token);

      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('okgadi_user');
    localStorage.removeItem('okgadi_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};