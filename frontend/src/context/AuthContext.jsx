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
    const userImg = localStorage.getItem('userImg'); // <--- New
    
    if (token && userName && userId) {
      setUser({ 
        name: userName, 
        token: token, 
        id: parseInt(userId),
        image: userImg === "null" ? null : userImg 
      });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token, userName, userId, userImg) => { // <--- Updated args
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userImg', userImg); // <--- Save Image
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ name: userName, token: token, id: userId, image: userImg });
  };

  const updateUserImage = (newUrl) => {
    localStorage.setItem('userImg', newUrl);
    setUser((prev) => ({ ...prev, image: newUrl }));
  }

  const logout = () => {
    localStorage.clear(); // Clear all
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUserImage }}>
      {children}
    </AuthContext.Provider>
  );
};