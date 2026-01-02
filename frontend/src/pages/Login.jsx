import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/login', { email, password });
      login(res.data.access_token, res.data); // Save Token & User Data
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE: Image & Branding */}
      <div className="hidden lg:flex w-1/2 bg-green-900 relative items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-black/20 z-10"></div>
         <img 
            src="https://images.unsplash.com/photo-1516467508483-a72120608ae7?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Farm Login"
         />
         <div className="relative z-20 p-12 text-white max-w-lg">
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">Welcome Back to <span className="text-green-400">AnimalMarket</span></h2>
            <p className="text-lg text-green-100/90 leading-relaxed">
               Connect with thousands of buyers and sellers. Manage your listings, chat instantly, and grow your business today.
            </p>
         </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 md:px-16 lg:px-24">
         <div className="w-full max-w-md">
            
            <div className="mb-8">
               <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
               <p className="text-gray-500 mt-2">Enter your email and password to continue.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2 mb-6 border border-red-100">
                 <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition font-medium" 
                    placeholder="you@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-green-600 transition" size={18} />
                  <input 
                    type="password" 
                    required 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition font-medium" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <div className="flex justify-end mt-2">
                   <Link to="/forgot-password" className="text-xs font-bold text-green-600 hover:text-green-700">
                      Forgot password?
                   </Link>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-green-700 transition shadow-xl shadow-green-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"} <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              New to our platform? <Link to="/signup" className="text-green-600 font-bold hover:underline">Create an account</Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;