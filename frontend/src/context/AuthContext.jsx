import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for token and user on startup
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Safe Parse: Prevents crash if data is "[object Object]"
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Storage corrupted, logging out");
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    
    // 2. Format user object correctly
    const safeUser = {
        id: userData.user_id,
        name: userData.user_name,
        email: userData.sub || userData.email, // Handle different formats
        image: userData.profile_image
    };
    
    // IMPORTANT: JSON.stringify prevents "[object Object]"
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    // IMPORTANT: JSON.stringify here too!
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};