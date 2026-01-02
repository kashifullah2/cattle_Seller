import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
// FIXED IMPORT LINE BELOW (Added ShieldCheck and commas)
import { 
  MapPin, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  Share2, 
  Heart, 
  Trash2, 
  Calendar, 
  Weight, 
  Palette, 
  ShieldCheck 
} from 'lucide-react';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [animal, setAnimal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFav, setIsFav] = useState(false);
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchDetails();
    if(user) checkFavorite();
  }, [id, user]);

  const fetchDetails = async () => {
    try {
        const res = await api.get(`/animals/${id}`);
        setAnimal(res.data);
        if(res.data.images.length > 0) setSelectedImage(res.data.images[0].image_url);
        
        // Fetch Reviews
        const reviewRes = await api.get(`/users/${res.data.seller.id}/reviews`);
        setReviews(reviewRes.data);
    } catch(err) { console.error(err); }
  };

  const checkFavorite = async () => {
      try {
        const res = await api.get('/users/me/favorites');
        setIsFav(res.data.some(a => a.id === parseInt(id)));
      } catch (err) { console.error(err); }
  };

  const handleStartChat = async () => {
      if(!user) return navigate('/login');
      if(user.id === animal.seller.id) return alert("You cannot chat with yourself!");

      try {
          await api.post('/messages/', {
              receiver_id: animal.seller.id,
              content: `Hi, I am interested in your ${animal.animal_type} (ID: ${animal.id}). Is it available?`
          });
          navigate('/chat');
      } catch (err) {
          alert("Failed to start chat.");
      }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if(!user) return navigate('/login');
    setSubmittingReview(true);
    try {
        await api.post('/reviews/', { reviewee_id: animal.seller.id, rating, comment });
        const reviewRes = await api.get(`/users/${animal.seller.id}/reviews`);
        setReviews(reviewRes.data);
        setComment("");
        alert("Review submitted!");
    } catch (err) { alert("Cannot review yourself."); } 
    finally { setSubmittingReview(false); }
  };

  const handleFavorite = async () => {
    if(!user) return navigate('/login');
    try {
        await api.post(`/animals/${id}/favorite`);
        setIsFav(!isFav);
    } catch(err) { console.error(err); }
  };

  const handleDelete = async () => {
      if(window.confirm("Are you sure you want to delete this ad?")) {
          try {
            await api.delete(`/animals/${id}`);
            navigate('/');
          } catch(err) { alert("Error deleting"); }
      }
  };

  if (!animal) return <div className="flex justify-center items-center h-screen text-gray-400">Loading details...</div>;
  
  const isOwner = user && user.id === animal.seller.id;
  const formattedPrice = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits:0 }).format(animal.price);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500">
                <Link to="/" className="hover:text-green-600">Home</Link>
                <ChevronRight size={14} className="mx-1" />
                <span className="font-semibold text-gray-700">{animal.animal_type}</span>
            </div>
            {isOwner && (
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-bold">
                    <Trash2 size={16}/> Delete Ad
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Images & Description --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="h-[450px] w-full bg-gray-100 relative group">
                  <img src={selectedImage || "https://via.placeholder.com/600"} className="w-full h-full object-cover" alt="Animal"/>
                  {animal.is_sold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold text-4xl border-4 border-white px-8 py-3 -rotate-12 uppercase tracking-widest">Sold Out</span></div>}
                  
                  <button onClick={handleFavorite} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition">
                      <Heart className={isFav ? "fill-red-500 text-red-500" : "text-gray-400"} size={24} />
                  </button>
               </div>
               
               {/* Thumbnails */}
               {animal.images.length > 1 && (
                   <div className="p-4 flex gap-3 overflow-x-auto">
                    {animal.images.map((img) => (
                        <button key={img.id} onClick={() => setSelectedImage(img.image_url)} className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${selectedImage === img.image_url ? 'border-green-600 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-300'}`}>
                        <img src={img.image_url} className="w-full h-full object-cover" alt="Thumb" />
                        </button>
                    ))}
                   </div>
               )}
            </div>

            {/* Title & Stats */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{animal.breed || animal.animal_type}</h1>
                        <p className="text-gray-500 flex items-center gap-1.5 mt-2 font-medium"><MapPin size={18} className="text-green-600"/> {animal.city}</p>
                    </div>
                    <h2 className="text-3xl font-extrabold text-green-700 bg-green-50 px-4 py-2 rounded-xl">{formattedPrice}</h2>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Weight className="text-gray-400 mb-2" size={20}/>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Weight</p>
                        <p className="font-bold text-gray-900 text-lg">{animal.weight} KG</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Calendar className="text-gray-400 mb-2" size={20}/>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Age</p>
                        <p className="font-bold text-gray-900 text-lg">{animal.age || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                        <Palette className="text-gray-400 mb-2" size={20}/>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Color</p>
                        <p className="font-bold text-gray-900 text-lg">{animal.color}</p>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                    {animal.description || "No specific description provided by the seller."}
                </div>
            </div>
            
            {/* Reviews Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Star className="fill-yellow-400 text-yellow-400" size={24} /> Seller Reviews 
                        <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
                    </h3>
                </div>

                <div className="space-y-6 mb-8">
                    {reviews.length > 0 ? reviews.map(r => (
                        <div key={r.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm text-gray-900">{r.reviewer_name}</span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-gray-300"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">"{r.comment}"</p>
                            <p className="text-xs text-gray-400 mt-2 text-right">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No reviews yet for this seller.</div>
                    )}
                </div>

                {!isOwner && user && (
                    <form onSubmit={handleSubmitReview} className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="font-bold text-sm mb-3">Rate your experience</h4>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1 cursor-pointer">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={28} onClick={() => setRating(star)} className={`transition ${star <= rating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold ml-2 text-gray-500">{rating}.0</span>
                        </div>
                        <textarea className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition" rows="3" placeholder="Write a review..." value={comment} onChange={e => setComment(e.target.value)} required></textarea>
                        <button disabled={submittingReview} className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition w-full sm:w-auto">
                            {submittingReview ? "Posting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: Seller Card --- */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
                
                {/* Seller Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gray-100 p-1 border border-gray-200">
                        <img src={animal.seller.profile_image || "https://via.placeholder.com/100?text=User"} className="w-full h-full rounded-full object-cover" alt="Seller"/>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Listed By</p>
                        <h3 className="font-bold text-lg text-gray-900 leading-none mb-1.5">{animal.seller.name}</h3>
                        <div className="flex items-center gap-1 text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md w-fit">
                            <Star size={12} fill="currentColor"/> {animal.seller.average_rating?.toFixed(1) || "New"}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* PRIMARY ACTION: CHAT */}
                    {!isOwner && user ? (
                        <button 
                            onClick={handleStartChat}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-600/30 transform active:scale-95"
                        >
                            <MessageSquare size={20} /> Chat with Seller
                        </button>
                    ) : !user ? (
                        <Link to="/login" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-600/30">
                            <MessageSquare size={20} /> Login to Chat
                        </Link>
                    ) : (
                         <div className="w-full bg-gray-50 border border-gray-200 text-gray-400 py-3 rounded-xl font-bold text-center text-sm">
                            You own this ad
                         </div>
                    )}
                    
                    <button onClick={() => {
                        if (navigator.share) {
                            navigator.share({ title: `Check out this ${animal.animal_type}`, url: window.location.href });
                        } else {
                            alert("Link copied to clipboard!");
                            navigator.clipboard.writeText(window.location.href);
                        }
                    }} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-50 transition">
                        <Share2 size={18} /> Share Ad
                    </button>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-xl text-blue-800 text-xs leading-relaxed">
                    <div className="mt-0.5"><ShieldCheck size={16} /></div>
                    <p><strong>Safety Tip:</strong> Never transfer money before seeing the animal. Use our chat feature to document conversations.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;