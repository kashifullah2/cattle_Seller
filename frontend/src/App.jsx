import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import PostAd from './pages/PostAd';
import AnimalDetails from './pages/AnimalDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PricePredictor from './pages/PricePredictor';
import MyDashboard from './pages/MyDashboard';
import Contact from './pages/Contact'; // <--- New
import Profile from './pages/Profile'; // <--- New

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/animal/:id" element={<AnimalDetails />} />
          <Route path="/predict" element={<PricePredictor />} />
          <Route path="/dashboard" element={<MyDashboard />} />
          <Route path="/contact" element={<Contact />} /> {/* <--- Route */}
          <Route path="/profile" element={<Profile />} /> {/* <--- Route */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;