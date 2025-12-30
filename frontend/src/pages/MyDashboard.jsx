import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Eye, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myAds, setMyAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'favorites'

  useEffect(() => {
    fetchMyAds();
    fetchFavorites();
  }, []);

  const fetchMyAds = async () => {
    try {
      const res = await api.get('/users/me/animals');
      setMyAds(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/users/me/favorites');
      setFavorites(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this ad permanently?")) {
      await api.delete(`/animals/${id}`);
      fetchMyAds(); // Refresh list
    }
  };

  const handleMarkSold = async (id) => {
    if(window.confirm("Mark this animal as sold? Buyers won't be able to contact you.")) {
      await api.put(`/animals/${id}/sold`);
      fetchMyAds(); // Refresh list
    }
  };

  const AdList = ({ list, isMyAds }) => (
    <div className="space-y-4">
      {list.length === 0 ? <p className="text-gray-500 text-center py-10">No animals found.</p> : null}
      
      {list.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <img src={item.images[0]?.image_url} alt="Animal" className="w-24 h-24 object-cover rounded-md" />
          
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-bold text-lg text-gray-800">{item.animal_type} - {item.breed || 'Unknown Breed'}</h3>
            <p className="text-green-700 font-bold">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(item.price)}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 mt-1">
               <span className="flex items-center gap-1"><Eye size={14}/> {item.views} Views</span>
               <span className="flex items-center gap-1"><Clock size={14}/> {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            {item.is_sold && <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2 font-bold">SOLD OUT</span>}
          </div>

          {/* Actions */}
          {isMyAds ? (
             <div className="flex gap-2">
               {!item.is_sold && (
                 <button onClick={() => handleMarkSold(item.id)} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-1 text-sm font-medium">
                   <CheckCircle size={16}/> Sold
                 </button>
               )}
               <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center gap-1 text-sm font-medium">
                 <Trash2 size={16}/> Delete
               </button>
             </div>
          ) : (
            <Link to={`/animal/${item.id}`} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              View
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300 mb-6">
          <button 
            className={`pb-2 px-4 font-medium ${activeTab === 'ads' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('ads')}
          >
            My Ads ({myAds.length})
          </button>
          <button 
            className={`pb-2 px-4 font-medium ${activeTab === 'favorites' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {activeTab === 'ads' ? <AdList list={myAds} isMyAds={true} /> : <AdList list={favorites} isMyAds={false} />}

      </div>
    </div>
  );
};

export default MyDashboard;