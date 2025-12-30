import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Phone, BadgeCheck, MapPin, Trash2, Heart, Flag, Eye, Share2, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [animal, setAnimal] = useState(null);
  const [relatedAnimals, setRelatedAnimals] = useState([]);
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
        
        const relatedRes = await api.get('/animals/', { params: { type: res.data.animal_type } });
        setRelatedAnimals(relatedRes.data.filter(a => a.id !== res.data.id).slice(0, 4));

        if(user) {
             const favRes = await api.get('/users/me/favorites');
             setIsFav(favRes.data.some(a => a.id === parseInt(id)));
        }
    } catch(err) { console.error(err); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${animal.animal_type}`,
        text: `I found this amazing ${animal.animal_type} on AnimalMarket!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleFavorite = async () => {
    if(!user) return navigate('/login');
    await api.post(`/animals/${id}/favorite`);
    setIsFav(!isFav);
  };

  const handleReport = async () => {
    if(!user) return navigate('/login');
    const reason = prompt("Reason for reporting:");
    if(reason) {
        const formData = new FormData();
        formData.append('reason', reason);
        await api.post(`/animals/${id}/report`, formData);
        alert("Report submitted.");
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
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/" className="hover:text-green-600">{animal.animal_type}</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-gray-800 font-medium">Ad #{animal.id}</span>
        </div>

        {/* Sold Banner */}
        {animal.is_sold && (
            <div className="bg-red-600 text-white text-center py-3 font-bold mb-6 rounded-lg flex items-center justify-center gap-2 shadow-md">
                <AlertCircle /> THIS ANIMAL HAS BEEN SOLD
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Images & Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
               <div className="h-96 w-full bg-gray-200">
                  {/* FIXED: Removed 'grayscale' class so image is always color */}
                  <img 
                    src={selectedImage || "https://via.placeholder.com/600"} 
                    className="w-full h-full object-cover" 
                    alt="Animal"
                  />
               </div>
               
               {/* Gallery */}
               <div className="p-4 flex gap-2 overflow-x-auto">
                {animal.images.map((img) => (
                    <button key={img.id} onClick={() => setSelectedImage(img.image_url)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === img.image_url ? 'border-green-600' : 'border-gray-100'}`}>
                       <img src={img.image_url} className="w-full h-full object-cover" />
                    </button>
                ))}
               </div>
            </div>

            {/* Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                
                {/* Header Row: Title vs Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{animal.animal_type}</h1>
                        <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin size={16}/> {animal.city}</p>
                    </div>

                    {/* Action Buttons Group (Aligned Right) */}
                    <div className="flex gap-2">
                        <button onClick={handleShare} className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-green-600 hover:bg-green-50" title="Share">
                            <Share2 size={20} />
                        </button>
                        <button onClick={handleFavorite} className={`p-2 rounded-full border transition ${isFav ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-400 border-gray-200 hover:text-red-500'}`} title="Favorite">
                            <Heart fill={isFav ? "currentColor" : "none"} size={20} />
                        </button>
                        {isOwner ? (
                            <button onClick={handleDelete} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                                <Trash2 size={20} />
                            </button>
                        ) : (
                            <button onClick={handleReport} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50" title="Report Ad">
                                <Flag size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Price Section */}
                <div className="text-3xl font-extrabold text-green-700 mb-6">
                    {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(animal.price)}
                </div>
                
                <hr className="my-6 border-gray-100" />
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 uppercase tracking-wide">Weight</span><p className="font-bold text-gray-800">{animal.weight} KG</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 uppercase tracking-wide">Color</span><p className="font-bold text-gray-800">{animal.color}</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 uppercase tracking-wide">Posted On</span><p className="font-bold text-gray-800">{new Date(animal.created_at).toLocaleDateString()}</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 uppercase tracking-wide">Views</span><p className="font-bold text-gray-800 flex items-center gap-1"><Eye size={14}/> {animal.views}</p></div>
                </div>

                {/* Description */}
                <div className="mt-8">
                    <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{animal.description || "No description provided."}</p>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact & Safety */}
          <div className="space-y-6">
             {/* Seller Card */}
             <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-600">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-full"><BadgeCheck className="text-green-700" size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Sold By</p>
                        <p className="font-bold text-lg text-gray-900">{animal.seller.name}</p>
                    </div>
                </div>
                
                {/* Contact Buttons */}
                {!animal.is_sold ? (
                    <div className="space-y-3">
                        <a href={`tel:${animal.seller.phone}`} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition">
                            <Phone size={18} /> Call Seller
                        </a>
                        <a href={`https://wa.me/${animal.seller.phone}`} className="w-full bg-green-500 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-green-600 transition">
                            Message on WhatsApp
                        </a>
                    </div>
                ) : (
                    <div className="bg-gray-100 text-gray-500 text-center py-3 rounded-lg font-bold">
                        Seller Contact Hidden
                    </div>
                )}
             </div>

             {/* Safety Tips */}
             <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <h3 className="flex items-center gap-2 font-bold text-blue-900 mb-3">
                    <ShieldCheck size={20} /> Safety Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li>Meet in a safe, public place.</li>
                    <li>Inspect the animal before paying.</li>
                    <li>Don't transfer money in advance.</li>
                    <li>Avoid non-face-to-face deals.</li>
                </ul>
             </div>
          </div>
        </div>

        {/* Related Animals */}
        {relatedAnimals.length > 0 && (
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Animals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedAnimals.map(rel => (
                        <Link to={`/animal/${rel.id}`} key={rel.id} className="block bg-white rounded-lg shadow hover:shadow-md transition">
                            <img src={rel.images[0]?.image_url} className="w-full h-40 object-cover rounded-t-lg" alt={rel.animal_type}/>
                            <div className="p-3">
                                <h4 className="font-bold text-gray-800">{rel.animal_type}</h4>
                                <p className="text-green-700 font-bold text-sm">
                                    {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(rel.price)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AnimalDetails;