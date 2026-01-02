import React, { useState } from 'react';
import api from '../api';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
        const res = await api.post('/forgot-password', { email });
        setMsg(res.data.message);
        setToken(res.data.reset_token); // Capture the simulated token
        setStatus('success');
    } catch (err) {
        setMsg(err.response?.data?.detail || "Something went wrong.");
        setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
       <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your email to receive a reset token.</p>
          </div>
          
          {status === 'success' ? (
             <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-100 animate-fade-in">
                <div className="flex items-center gap-2 font-bold mb-2">
                    <CheckCircle size={20}/> Email Sent (Simulated)
                </div>
                <p className="text-sm mb-4">Since we don't have a real email server, copy this token:</p>
                
                <div className="bg-white p-3 border border-green-200 rounded-lg font-mono text-xs break-all select-all text-gray-600 mb-4">
                    {token}
                </div>

                <Link to="/reset-password" className="btn-gradient w-full py-3 block text-center">
                    Proceed to Reset Password
                </Link>
             </div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={16}/> {msg}
                    </div>
                )}
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute top-3.5 left-4 text-gray-400" size={18}/>
                        <input 
                            type="email" 
                            required 
                            className="modern-input pl-12" 
                            placeholder="you@example.com"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                </div>
                <button disabled={status === 'loading'} className="btn-gradient w-full py-3.5">
                    {status === 'loading' ? 'Sending...' : 'Get Reset Link'} <ArrowRight size={18}/>
                </button>
             </form>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-gray-600">Back to Login</Link>
          </div>
       </div>
    </div>
  );
};

export default ForgotPassword;