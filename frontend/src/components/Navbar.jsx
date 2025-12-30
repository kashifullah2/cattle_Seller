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
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-700 flex items-center gap-2">
               AnimalMarket
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium hidden md:block">Browse</Link>
            
            <Link to="/predict" className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-1">
               <Calculator size={18} /> <span className="hidden md:inline">Price Estimator</span>
            </Link>

            <Link 
              to="/post-ad" 
              onClick={handleSellClick}
              className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition font-medium text-sm"
            >
              <PlusCircle size={18} />
              Sell
            </Link>

            {user ? (
              <div className="flex items-center gap-3 border-l pl-4 ml-2 border-gray-300">
                <Link to="/dashboard" className="text-gray-600 hover:text-green-700" title="Dashboard">
                   <LayoutDashboard size={20} />
                </Link>

                {/* PROFILE LINK WITH IMAGE */}
                <Link to="/profile" className="flex items-center gap-2">
                  {user.image ? (
                    <img src={user.image} alt="User" className="w-8 h-8 rounded-full object-cover border border-gray-300" />
                  ) : (
                    <div className="bg-gray-200 p-1 rounded-full text-gray-600">
                      <User size={20} />
                    </div>
                  )}
                  <span className="font-bold text-sm text-gray-800 hidden md:block">{user.name}</span>
                </Link>
                
                <button onClick={logout} className="text-red-400 hover:text-red-600 ml-2" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-gray-700 font-bold hover:text-green-600 text-sm">Login</Link>
                <Link to="/signup" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;