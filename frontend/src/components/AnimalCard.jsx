import React from 'react';
import { MapPin, Phone, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={animal.images[0]?.image_url || "https://via.placeholder.com/300?text=No+Image"} 
          alt={animal.animal_type} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
          {animal.animal_type}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(animal.price)}
          </h3>
          {animal.seller.is_verified && (
            <BadgeCheck className="text-blue-500" size={20} title="Verified Seller" />
          )}
        </div>
        
        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
            <MapPin size={14} /> {animal.city}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
            <span className="bg-gray-50 p-1 rounded border text-center">Color: {animal.color}</span>
            <span className="bg-gray-50 p-1 rounded border text-center">Weight: {animal.weight}kg</span>
        </div>

        <div className="mt-auto flex gap-2">
          <Link 
            to={`/animal/${animal.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            View Details
          </Link>
          <a 
            href={`tel:${animal.seller.phone}`}
            className="flex items-center justify-center w-10 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;