import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout'; // <--- Import Layout

import Home from './pages/Home';
import PostAd from './pages/PostAd';
import AnimalDetails from './pages/AnimalDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PricePredictor from './pages/PricePredictor';
import MyDashboard from './pages/MyDashboard';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Wrap all routes inside Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post-ad" element={<PostAd />} />
            <Route path="/animal/:id" element={<AnimalDetails />} />
            <Route path="/predict" element={<PricePredictor />} />
            <Route path="/dashboard" element={<MyDashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;