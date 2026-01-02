import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Page Imports ---
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostAd from './pages/PostAd';
import AnimalDetails from './pages/AnimalDetails';
import Profile from './pages/Profile';
import PricePredictor from './pages/PricePredictor';
import Chat from './pages/Chat';

// --- THESE WERE MISSING BEFORE (Fixes the Error) ---
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/animal/:id" element={<AnimalDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/predict" element={<PricePredictor />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;