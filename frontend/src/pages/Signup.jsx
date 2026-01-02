import React, { useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: 'Male', address: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register
      const res = await api.post('/signup', formData);
      // 2. Auto Login after Signup (using the response token)
      login(res.data.access_token, res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE: Image (Different from Login) */}
      <div className="hidden lg:flex w-1/2 bg-green-900 relative items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-green-900/40 z-10 mix-blend-multiply"></div>
         <img 
            src="https://images.unsplash.com/photo-1595878848136-398711417a81?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Farm Signup"
         />
         <div className="relative z-20 p-12 text-white max-w-lg">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">Join the <span className="text-green-400">Community</span></h2>
            <p className="text-lg text-green-100/90 leading-relaxed">
               Create your free account today. Buy, sell, and trade livestock with trusted members across the country.
            </p>
         </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
         <div className="w-full max-w-md">
            
            <div className="mb-8">
               <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
               <p className="text-gray-500 mt-2">It's free and takes less than a minute.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2 mb-6 border border-red-100">
                 <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Gender Row */}
              <div className="flex gap-4">
                  <div className="w-2/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative group">
                        <User className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                        <input type="text" name="name" required className="modern-input pl-12" placeholder="John Doe" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
                    <select name="gender" className="modern-input px-3" onChange={handleChange}>
                        <option>Male</option><option>Female</option>
                    </select>
                  </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                    <input type="email" name="email" required className="modern-input pl-12" placeholder="you@example.com" onChange={handleChange} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative group">
                    <Phone className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                    <input type="text" name="phone" required className="modern-input pl-12" placeholder="0300 1234567" onChange={handleChange} />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City / Address</label>
                <div className="relative group">
                    <MapPin className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-gree-600 transition" size={18} />
                    <input type="text" name="address" required className="modern-input pl-12" placeholder="Lahore, Pakistan" onChange={handleChange} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                    <Lock className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                    <input type="password" name="password" required className="modern-input pl-12" placeholder="••••••••" onChange={handleChange} />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-green-700 transition shadow-xl shadow-green-600/20 active:scale-95 disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Sign In</Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Signup;