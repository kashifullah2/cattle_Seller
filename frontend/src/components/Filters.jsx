import React, { useState } from 'react';
import { Filter } from 'lucide-react';

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold border-b pb-4">
        <Filter size={20} className="text-green-600" />
        <span>Filter Listings</span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select 
            name="type" 
            onChange={handleChange} 
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5 text-sm bg-gray-50"
          >
            <option value="All">All Categories</option>
            <optgroup label="Livestock">
                <option value="Goat">Goat</option>
                <option value="Cow">Cow</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Sheep">Sheep</option>
                <option value="Camel">Camel</option>
                <option value="Horse">Horse</option>
            </optgroup>
            <optgroup label="Pets">
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
            </optgroup>
            <optgroup label="Birds & Others">
                <option value="Bird">Bird</option>
                <option value="Hen">Hen</option>
                <option value="Duck">Duck</option>
                <option value="Fish">Fish</option>
                <option value="Other">Other</option> {/* <--- "Other" Added */}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Lahore"
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (PKR)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              onChange={handleChange}
              className="w-1/2 rounded-lg border-gray-300 shadow-sm border p-2 text-sm"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              onChange={handleChange}
              className="w-1/2 rounded-lg border-gray-300 shadow-sm border p-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;