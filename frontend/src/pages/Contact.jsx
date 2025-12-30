import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { Send, Mail } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow max-w-3xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 p-8 text-center">
            <Mail className="mx-auto text-white mb-3" size={48} />
            <h1 className="text-3xl font-bold text-white">Contact Developer</h1>
            <p className="text-green-100 mt-2">Have a question or found a bug? Let us know!</p>
          </div>

          <div className="p-8">
            {status === 'success' && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-center font-medium">
                Message sent successfully! We will get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required className="w-full mt-1 p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
              </div>
              
              <button type="submit" disabled={status === 'sending'} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                {status === 'sending' ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;