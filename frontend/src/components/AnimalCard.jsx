import React from 'react';
import { MapPin, Phone, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  // Use Name if available, otherwise Breed, otherwise Type
  const displayName = animal.name || animal.breed || animal.animal_type;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300 border border-gray-200 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={animal.images[0]?.image_url || "https://via.placeholder.com/300?text=No+Image"} 
          alt={displayName} 
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-800">
          {animal.animal_type}
        </div>
        {animal.is_sold && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <span className="bg-red-600 text-white px-3 py-1 font-bold -rotate-12 rounded">SOLD</span>
           </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 truncate" title={displayName}>
            {displayName}
          </h3>
          {animal.seller.is_verified && (
            <BadgeCheck className="text-blue-500 flex-shrink-0" size={18} title="Verified Seller" />
          )}
        </div>

        <p className="text-green-700 font-extrabold text-lg mb-2">
            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(animal.price)}
        </p>
        
        <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" /> {animal.city}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
            <span className="text-center">Weight: <b>{animal.weight}kg</b></span>
            <span className="text-center">Color: <b>{animal.color}</b></span>
        </div>

        <div className="mt-auto flex gap-2">
          <Link 
            to={`/animal/${animal.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Details
          </Link>
          <a 
            href={`tel:${animal.seller.phone}`}
            className="flex items-center justify-center w-10 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;