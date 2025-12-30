import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { User, Mail, Phone, MapPin, Lock, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: 'Male', address: '', password: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/signup', formData);
      login(res.data.access_token, res.data.user_name, res.data.user_id, res.data.profile_image);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* Left Side (Image) - Fixed Height on Mobile, Full on Desktop */}
      <div className="lg:w-5/12 relative h-48 lg:h-auto bg-green-900 overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599388168270-3490714446c7?q=80&w=1920')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
         <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 text-white">
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-2">Join Us!</h1>
            <p className="text-green-100 hidden lg:block">Start buying and selling livestock today.</p>
         </div>
      </div>

      {/* Right Side (Form) - Scrollable */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-lg w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Fill in your details to get started.</p>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Username</label>
                <div className="relative">
                  <User className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                  <input type="text" name="name" required className="modern-input pl-10" placeholder="Ali Khan" onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                  <input type="text" name="phone" required className="modern-input pl-10" placeholder="0300..." onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                <input type="email" name="email" required className="modern-input pl-10" placeholder="ali@example.com" onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                 <label className="text-sm font-bold text-gray-700 block mb-1">Gender</label>
                 <select name="gender" className="modern-input" onChange={handleChange}>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                 </select>
              </div>
              <div>
                 <label className="text-sm font-bold text-gray-700 block mb-1">City / Address</label>
                 <div className="relative">
                   <MapPin className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                   <input type="text" name="address" required className="modern-input pl-10" placeholder="Lahore" onChange={handleChange} />
                 </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                <input type="password" name="password" required className="modern-input pl-10" placeholder="••••••••" onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gradient w-full mt-4">
              {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="font-bold text-green-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;