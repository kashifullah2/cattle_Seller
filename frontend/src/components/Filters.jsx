import React, { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: 'All',
    city: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const reset = { type: 'All', city: '', minPrice: '', maxPrice: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Filter size={18} /> Filters
        </h3>
        {/* Only show clear button if filters are active */}
        {(filters.city || filters.minPrice || filters.type !== 'All') && (
            <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1">
              Clear <X size={12}/>
            </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Select */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <div className="relative">
             <select 
               name="type" 
               value={filters.type}
               onChange={handleChange} 
               className="w-full appearance-none bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl p-3 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all cursor-pointer font-medium"
             >
                <option value="All">All Categories</option>
                <optgroup label="Livestock">
                    <option value="Goat">Goat</option><option value="Cow">Cow</option><option value="Buffalo">Buffalo</option>
                    <option value="Sheep">Sheep</option><option value="Camel">Camel</option><option value="Horse">Horse</option>
                </optgroup>
                <optgroup label="Pets">
                    <option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Rabbit">Rabbit</option>
                </optgroup>
             </select>
             <div className="absolute right-4 top-3.5 pointer-events-none">
               <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>
        </div>

        {/* City Input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
          <input
            type="text"
            name="city"
            value={filters.city}
            placeholder="e.g. Lahore"
            onChange={handleChange}
            className="w-full bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl p-3 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium placeholder-gray-400"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range (PKR)</label>
          <div className="flex gap-3">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              placeholder="Min"
              onChange={handleChange}
              className="w-1/2 bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl p-3 outline-none focus:bg-white focus:border-green-500 transition-all text-center font-medium"
            />
            <span className="text-gray-300 flex items-center">-</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              placeholder="Max"
              onChange={handleChange}
              className="w-1/2 bg-gray-50 border border-transparent text-gray-900 text-sm rounded-xl p-3 outline-none focus:bg-white focus:border-green-500 transition-all text-center font-medium"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Filters;