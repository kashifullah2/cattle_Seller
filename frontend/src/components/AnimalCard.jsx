import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  // Use Breed as main title if available, else Type
  const title = animal.breed || animal.animal_type;
  const price = new Intl.NumberFormat('en-PK', { 
    style: 'currency', currency: 'PKR', maximumFractionDigits: 0 
  }).format(animal.price);

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowContact(false); }}
    >
      {/* --- Image Section --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link to={`/animal/${animal.id}`}>
          <img 
            src={animal.images[0]?.image_url || "https://via.placeholder.com/400?text=No+Image"} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradient Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />
        </Link>

        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
             {animal.animal_type}
           </span>
        </div>

        {/* Status Badge */}
        {animal.is_sold && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="bg-white text-black px-6 py-2 font-bold rotate-[-5deg] shadow-2xl uppercase tracking-widest border-2 border-black">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="p-5">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
           <div>
             <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
               {title}
             </h3>
             <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
               <MapPin size={14} className="text-gray-400" /> 
               <span className="truncate max-w-[140px]">{animal.city}</span>
             </div>
           </div>
           <div className="text-right">
             <p className="font-extrabold text-green-700 text-lg">{price}</p>
             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Fixed Price</p>
           </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 my-4"></div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-5">
           <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
              <span className="text-gray-400">Weight:</span>
              <span className="font-semibold text-gray-900">{animal.weight}kg</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-gray-400"/>
              <span>{animal.views} views</span>
           </div>
        </div>

        {/* --- Action Area (Swaps on Click) --- */}
        <div className="relative h-12">
            
            {/* Default View: Buttons */}
            <div className={`absolute inset-0 flex gap-3 transition-all duration-300 ${showContact ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <Link 
                  to={`/animal/${animal.id}`}
                  className="flex-1 rounded-xl bg-gray-50 text-gray-900 font-semibold text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  Details
                </Link>
                <button 
                  onClick={() => setShowContact(true)}
                  className="flex-1 rounded-xl bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
                >
                  <Phone size={16} /> Contact
                </button>
            </div>

            {/* Revealed View: Contact Info */}
            <div className={`absolute inset-0 bg-green-50 rounded-xl flex items-center justify-between px-4 transition-all duration-300 ${showContact ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
                <a href={`tel:${animal.seller.phone}`} className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold text-green-800 tracking-wider">Phone Number</span>
                   <span className="font-bold text-green-700 text-sm flex items-center gap-1">
                     {animal.seller.phone}
                   </span>
                </a>
                
                <div className="flex gap-2">
                  <a href={`tel:${animal.seller.phone}`} className="p-2 bg-white rounded-full text-green-600 shadow-sm hover:scale-110 transition-transform">
                    <Phone size={16} fill="currentColor" />
                  </a>
                  {animal.seller.email && (
                    <a href={`mailto:${animal.seller.email}`} className="p-2 bg-white rounded-full text-green-600 shadow-sm hover:scale-110 transition-transform">
                       <MessageCircle size={16} />
                    </a>
                  )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default AnimalCard;