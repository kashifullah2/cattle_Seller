import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, LogOut, User, Calculator, LayoutDashboard, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSellClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
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

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
               <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isActive('/')}`}>Browse</Link>
               <Link to="/predict" className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${isActive('/predict')}`}>
                 <Calculator size={16} /> Estimator
               </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            <Link 
              to="/post-ad" 
              onClick={handleSellClick}
              className="hidden sm:flex bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-gray-900/20 active:scale-95 items-center gap-2"
            >
              <Plus size={18} /> Sell
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Link to="/dashboard" className={`p-2 rounded-full transition ${isActive('/dashboard')}`} title="Dashboard">
                   <LayoutDashboard size={20} />
                </Link>

                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="text-right hidden lg:block">
                     <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                     <p className="text-xs text-gray-500 mt-1">View Profile</p>
                  </div>
                  <img 
                    src={user.image || "https://ui-avatars.com/api/?name=" + user.name + "&background=16a34a&color=fff"} 
                    alt="User" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-green-500 transition" 
                  />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 font-semibold hover:text-green-600 px-3 py-2">Login</Link>
                <Link to="/signup" className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg shadow-green-600/20">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;