import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Bell, LayoutDashboard, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const ws = useRef(null);

  // Fetch unread messages count
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Connect WebSocket for real-time notifications
      ws.current = new WebSocket(`ws://localhost:8000/ws/${user.id}`);
      ws.current.onmessage = (event) => {
        if(event.data.includes("NEW_MESSAGE")) {
            fetchUnreadCount();
        }
      };
    }
    return () => ws.current?.close();
  }, [user]);

  useEffect(() => {
     if(user) fetchUnreadCount();
  }, [location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
      // 1. Clear Context & Storage
      logout(); 
      // 2. Force Navigate to Login Page immediately
      navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-green-600 hover:bg-gray-50";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
               <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition transform">
                 <span className="text-xl font-bold">A</span>
               </div>
               <span className="text-xl font-bold text-gray-900 tracking-tight">Animal<span className="text-green-600">Market</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            
            <Link to="/post-ad" className="hidden sm:flex bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg items-center gap-2">
              <Plus size={18} /> Sell
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                
                {/* User Name Display */}
                <span className="hidden md:block text-sm font-bold text-gray-700">
                    Hi, {user.name || "User"}
                </span>

                {/* Notifications */}
                <Link to="/chat" className="relative p-2 rounded-full text-gray-500 hover:bg-green-50 hover:text-green-600 transition">
                   <Bell size={24} />
                   {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                       {unreadCount}
                     </span>
                   )}
                </Link>

                {/* Dashboard */}
                <Link to="/profile" className={`p-2 rounded-full transition ${isActive('/profile')}`} title="Profile">
                   <User size={20} />
                </Link>

                {/* Sign Out Button */}
                <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 transition"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>

                {/* Profile Image Link */}
                <Link to="/profile" className="flex items-center gap-3 group ml-2">
                  <img src={user.image || "https://via.placeholder.com/40"} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-green-500 transition" />
                </Link>
              </div>
            ) : ( 
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 font-semibold hover:text-green-600 px-3 py-2">Login</Link>
                <Link to="/signup" className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;