import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState(''); // Changed phone to email
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Send email instead of phone
      const res = await api.post('/login', { email, password });
      login(res.data.access_token, res.data.user_name, res.data.user_id, res.data.profile_image);
      navigate('/');
    } catch (err) {
      setError('Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* Left Side (Image) */}
      <div className="lg:w-1/2 relative h-64 lg:h-auto bg-green-900 overflow-hidden order-1 lg:order-1">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545464333-9cbd1f28df17?q=80&w=1920')] bg-cover bg-center opacity-40"></div>
         <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-12 text-white">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-4">Welcome Back!</h1>
            <p className="text-green-100 text-lg max-w-md">Login to access your dashboard and manage your animal listings.</p>
         </div>
      </div>

      {/* Right Side (Form) */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 order-2 lg:order-2">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-1">Please enter your details.</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  className="modern-input pl-10"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                 <Lock className="absolute top-3.5 left-3.5 text-gray-400" size={18} />
                 <input
                  type="password"
                  required
                  className="modern-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-2">
                 <Link to="#" className="text-sm font-bold text-green-600 hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gradient w-full">
              {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <Link to="/signup" className="font-bold text-green-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;