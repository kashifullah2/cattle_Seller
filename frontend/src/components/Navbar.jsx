import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, User, Calculator, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSellClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-700 flex items-center gap-2">
               AnimalMarket
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Browse</Link>
            
            {/* Price Predictor Link */}
            <Link to="/predict" className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-1">
               <Calculator size={18} /> Price Estimator
            </Link>

            {/* Sell Button */}
            <Link 
              to="/post-ad" 
              onClick={handleSellClick}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition font-medium"
            >
              <PlusCircle size={18} />
              Sell Animal
            </Link>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-4 border-l pl-4 ml-2 border-gray-300">
                
                {/* DASHBOARD LINK (New Feature) */}
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-green-700 font-medium flex items-center gap-1"
                  title="My Dashboard"
                >
                   <LayoutDashboard size={18} /> Dashboard
                </Link>

                <span className="flex items-center gap-1 text-gray-800 font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                  <User size={16} /> {user.name}
                </span>
                
                <button 
                  onClick={logout} 
                  className="text-gray-500 hover:text-red-600 transition" 
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              // Guest Options
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-gray-700 font-bold hover:text-green-600">Login</Link>
                <Link to="/signup" className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;