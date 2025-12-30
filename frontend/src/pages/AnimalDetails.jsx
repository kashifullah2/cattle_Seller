import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Phone, BadgeCheck, MapPin, Trash2, Heart, Flag, Eye, AlertCircle } from 'lucide-react';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [animal, setAnimal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
        const res = await api.get(`/animals/${id}`);
        setAnimal(res.data);
        if(res.data.images.length > 0) setSelectedImage(res.data.images[0].image_url);
        
        // Check if fav (Simplified check, usually backend sends this status)
        if(user) {
             const favRes = await api.get('/users/me/favorites');
             const isFavorited = favRes.data.some(a => a.id === parseInt(id));
             setIsFav(isFavorited);
        }
    } catch(err) { console.error(err); }
  };

  const handleFavorite = async () => {
    if(!user) return navigate('/login');
    await api.post(`/animals/${id}/favorite`);
    setIsFav(!isFav);
  };

  const handleReport = async () => {
    if(!user) return navigate('/login');
    const reason = prompt("Reason for reporting (e.g., Scam, Spam, Wrong Info):");
    if(reason) {
        const formData = new FormData();
        formData.append('reason', reason);
        await api.post(`/animals/${id}/report`, formData);
        alert("Report submitted. Thank you.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this ad?")) {
      await api.delete(`/animals/${id}`);
      navigate('/');
    }
  };

  if (!animal) return <div className="text-center mt-20">Loading...</div>;
  const isOwner = user && user.id === animal.seller.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* SOLD BANNER */}
        {animal.is_sold && (
            <div className="bg-red-600 text-white text-center py-2 font-bold mb-4 rounded-lg flex items-center justify-center gap-2">
                <AlertCircle /> THIS ANIMAL HAS BEEN SOLD
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="h-96 w-full bg-gray-200 rounded-xl overflow-hidden shadow-lg relative">
              <img src={selectedImage || "https://via.placeholder.com/600"} className={`w-full h-full object-cover ${animal.is_sold ? 'grayscale' : ''}`} />
              {animal.is_sold && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl font-bold uppercase -rotate-12">SOLD</div>}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {animal.images.map((img) => (
                <button key={img.id} onClick={() => setSelectedImage(img.image_url)} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={img.image_url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-fit relative">
            
            {/* Header Actions */}
            <div className="absolute top-6 right-6 flex gap-2">
                <button onClick={handleFavorite} className={`p-2 rounded-full border transition ${isFav ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-400 border-gray-200 hover:text-red-500'}`}>
                    <Heart fill={isFav ? "currentColor" : "none"} size={20} />
                </button>
                {isOwner ? (
                    <button onClick={handleDelete} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={20} /></button>
                ) : (
                    <button onClick={handleReport} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50" title="Report Ad"><Flag size={20} /></button>
                )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{animal.animal_type}</h1>
            <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm">
                <span className="flex items-center gap-1"><MapPin size={16}/> {animal.city}</span>
                <span className="flex items-center gap-1"><Eye size={16}/> {animal.views} Views</span>
            </div>

            <div className="text-3xl font-bold text-green-700 mt-4">
                {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(animal.price)}
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
               <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 block">Weight</span><span className="font-semibold">{animal.weight} KG</span></div>
               <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 block">Color</span><span className="font-semibold">{animal.color}</span></div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{animal.description || "No description provided."}</p>
            </div>

            {!animal.is_sold && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-900">{animal.seller.name}</span>
                            {animal.seller.is_verified && <BadgeCheck className="text-blue-600" size={18} />}
                        </div>
                        <a href={`https://wa.me/${animal.seller.phone}`} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">WhatsApp</a>
                    </div>
                    <a href={`tel:${animal.seller.phone}`} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-gray-800">
                        <Phone size={20} /> {animal.seller.phone}
                    </a>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;