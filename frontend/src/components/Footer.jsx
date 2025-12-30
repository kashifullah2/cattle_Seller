import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">AnimalMarket</h2>
            <p className="text-sm leading-relaxed mb-4">
              Pakistan's #1 trusted marketplace for buying and selling livestock. 
              Connect directly with sellers, check prices with AI, and trade securely.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-green-500 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-green-500 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-green-500 transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-500 transition">Browse Animals</Link></li>
              <li><Link to="/predict" className="hover:text-green-500 transition">Price Estimator</Link></li>
              <li><Link to="/post-ad" className="hover:text-green-500 transition">Sell Your Animal</Link></li>
              <li><Link to="/contact" className="hover:text-green-500 transition">Contact Developer</Link></li>
            </ul>
          </div>

          {/* Developer Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Developer Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-green-500" />
                <span>Bakhshali,Mardan Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-green-500" />
                <span>+92 316 6950257</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-green-500" />
                <span>kashifullah919@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} AnimalMarket. Designed & Developed by Kashif Ullah.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;