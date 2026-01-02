import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Animal<span className="text-green-500">Market</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              The #1 trusted platform for buying and selling livestock securely. 
              Connecting farmers and buyers across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-500 transition">Home</Link></li>
              <li><Link to="/search" className="hover:text-green-500 transition">Browse Animals</Link></li>
              <li><Link to="/post-ad" className="hover:text-green-500 transition">Sell Now</Link></li>
              <li><Link to="/login" className="hover:text-green-500 transition">Login / Signup</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-500 mt-0.5" />
                <span>123 Farm Road, Lahore,<br />Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500" />
                <span>kashifullah919@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Follow Us</h3>
            <div className="flex gap-4 mb-6">
              <a href="https://www.linkedin.com/in/kashifullah1/" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition"><Linkedin size={20} /></a>
              <a href="https://github.com/kashifullah2" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition"><Github size={20} /></a>
              <a href="https://www.instagram.com/mkashifullah/" className="bg-gray-800 p-2 rounded-full hover:bg-green-600 hover:text-white transition"><Instagram size={20} /></a>
            </div>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} AnimalMarket. All rights reserved. <br />Developed by Kashif Ullah
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;