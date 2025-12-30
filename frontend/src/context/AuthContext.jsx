import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    if (token && userName && userId) {
      setUser({ name: userName, token: token, id: parseInt(userId) });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token, userName, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ name: userName, token: token, id: userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};