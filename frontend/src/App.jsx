import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Components ---
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ MISSING IMPORT
import PricePredictor from './pages/PricePredictor';
// --- Pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostAd from './pages/PostAd';
import AnimalDetails from './pages/AnimalDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyDashboard from './pages/MyDashboard'
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/post-ad" element={<PostAd />} />
              <Route path="/animal/:id" element={<AnimalDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/PricePredictor" element={<PricePredictor />} />
              <Route path="/MyDashboard" element={<MyDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
