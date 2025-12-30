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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold border-b pb-2">
        <Filter size={20} />
        <span>Filters</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Animal Type</label>
          <select 
            name="type" 
            onChange={handleChange} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
          >
            <option value="All">All Types</option>
            <option value="Goat">Goat</option>
            <option value="Cow">Cow</option>
            <option value="Buffalo">Buffalo</option>
            <option value="Sheep">Sheep</option>
            <option value="Camel">Camel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City / Location</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Lahore"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              onChange={handleChange}
              className="w-1/2 rounded-md border-gray-300 shadow-sm border p-2"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              onChange={handleChange}
              className="w-1/2 rounded-md border-gray-300 shadow-sm border p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;