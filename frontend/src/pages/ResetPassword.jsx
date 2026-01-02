import React, { useState } from 'react';
import api from '../api';
import { Lock, Key, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
        await api.post('/reset-password', { token, new_password: password });
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
    } catch (err) {
        alert("Invalid Token or Server Error");
        setStatus('idle');
    }
  };

  if (status === 'success') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Changed!</h2>
                <p className="text-gray-500 mb-6">Your password has been updated successfully.</p>
                <Link to="/login" className="btn-gradient w-full py-3 block">Login Now</Link>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
       <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Set New Password</h2>
            <p className="text-gray-500 text-sm mt-2">Paste your token and choose a strong password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reset Token</label>
                <div className="relative">
                    <Key className="absolute top-3.5 left-4 text-gray-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Paste token here..." 
                        required 
                        className="modern-input pl-12" 
                        value={token} 
                        onChange={e => setToken(e.target.value)} 
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                    <Lock className="absolute top-3.5 left-4 text-gray-400" size={18}/>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="modern-input pl-12" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </div>
            </div>

            <button disabled={status === 'loading'} className="btn-gradient w-full py-3.5">
                {status === 'loading' ? 'Updating...' : 'Change Password'}
            </button>
          </form>
       </div>
    </div>
  );
};

export default ResetPassword;