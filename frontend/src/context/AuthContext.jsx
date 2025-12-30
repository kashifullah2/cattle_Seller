import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load data from storage
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const userImg = localStorage.getItem('userImg');
    
    // 2. Validate Image URL (prevent "null" string issues)
    const validImg = (userImg && userImg !== "null" && userImg !== "undefined") ? userImg : null;

    if (token && userName && userId) {
      setUser({ name: userName, token, id: parseInt(userId), image: validImg });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (token, userName, userId, userImg) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    
    // Ensure we save a string or empty string, not null
    const imageToSave = userImg || "";
    localStorage.setItem('userImg', imageToSave);

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ name: userName, token, id: userId, image: imageToSave || null });
  };

  const updateUserImage = (newUrl) => {
    localStorage.setItem('userImg', newUrl);
    setUser((prev) => ({ ...prev, image: newUrl }));
  };

  const updateUser = (newName, newPhone) => {
    localStorage.setItem('userName', newName);
    setUser((prev) => ({ ...prev, name: newName, phone: newPhone }));
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUserImage, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};