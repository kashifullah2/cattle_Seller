import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import PostAd from './pages/PostAd';
import AnimalDetails from './pages/AnimalDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PricePredictor from './pages/PricePredictor'; // <--- Import New Page
import MyDashboard from './pages/MyDashboard'; // <--- Import

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
          <Route path="/predict" element={<PricePredictor />} /> {/* <--- Add Route */}
          <Route path="/dashboard" element={<MyDashboard />} /> {/* <--- Add Route */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;