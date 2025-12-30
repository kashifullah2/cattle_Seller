import React, { useEffect, useState } from 'react';
import api from '../api';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import { Search, TrendingUp, Filter, ArrowRight } from 'lucide-react';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('newest');

  const categories = [
    { name: 'Cow', icon: '🐄' },
    { name: 'Buffalo', icon: '🐃' },
    { name: 'Goat', icon: '🐐' },
    { name: 'Sheep', icon: '🐑' },
    { name: 'Camel', icon: '🐫' },
    { name: 'Horse', icon: '🐎' },
    { name: 'Dog', icon: '🐕' },
    { name: 'Cat', icon: '🐈' },
    { name: 'Bird', icon: '🦜' },
    { name: 'Hen', icon: '🐔' },
    { name: 'Duck', icon: '🦆' },
    { name: 'Rabbit', icon: '🐇' },
    { name: 'Fish', icon: '🐟' },
    { name: 'Other', icon: '🐾' },
  ];

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type && filters.type !== "All") params.type = filters.type;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;

      const response = await api.get('/animals/', { params });
      setAnimals(response.data);
      setFilteredAnimals(response.data);
    } catch (error) {
      console.error("Error fetching animals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let sorted = [...animals];
    if (sortOption === 'lowPrice') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'highPrice') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setFilteredAnimals(sorted);
  }, [sortOption, animals]);

  useEffect(() => {
    fetchAnimals();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-green-700 text-white py-12 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Find Your Perfect Animal</h1>
          <p className="text-green-100 text-lg mb-6">Pakistan's largest trustworthy livestock marketplace.</p>
          
          <div className="flex justify-center gap-6 text-sm font-semibold">
            <div className="bg-green-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-green-600">
              <TrendingUp size={16} /> {animals.length} Active Listings
            </div>
            <div className="bg-green-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-green-600">
              <Search size={16} /> {categories.length} Categories
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        <div className="mb-10">
           <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Browse by Category</h3>
           <div className="overflow-x-auto pb-4 scrollbar-hide">
             <div className="flex gap-4 min-w-max px-1">
                <button 
                  onClick={() => setFilters({ ...filters, type: 'All' })}
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition shadow-sm ${!filters.type || filters.type === 'All' ? 'border-green-600 bg-green-50 text-green-700' : 'border-white bg-white text-gray-600 hover:border-green-200 hover:shadow-md'}`}
                >
                  <span className="text-2xl mb-1">🏠</span>
                  <span className="font-bold text-xs">All</span>
                </button>

                {categories.map(cat => (
                  <button 
                      key={cat.name}
                      onClick={() => setFilters({ ...filters, type: cat.name })}
                      className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition shadow-sm ${filters.type === cat.name ? 'border-green-600 bg-green-50 text-green-700' : 'border-white bg-white text-gray-600 hover:border-green-200 hover:shadow-md'}`}
                  >
                      <span className="text-3xl mb-1">{cat.icon}</span>
                      <span className="font-bold text-xs">{cat.name}</span>
                  </button>
                ))}
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
             <Filters onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
             <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  {filters.type && filters.type !== "All" ? `${filters.type} Listings` : "Fresh Listings"}
                  <ArrowRight size={18} className="text-gray-400" />
                </h2>
                
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-500" />
                  <select 
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500 cursor-pointer"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="lowPrice">Price: Low to High</option>
                    <option value="highPrice">Price: High to Low</option>
                  </select>
                </div>
             </div>

             {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="bg-white rounded-xl shadow-md h-80 animate-pulse">
                     <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                     <div className="p-4 space-y-3">
                       <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : filteredAnimals.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredAnimals.map((animal) => (
                   <AnimalCard key={animal.id} animal={animal} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                 <Search className="mx-auto h-12 w-12 text-gray-400" />
                 <h3 className="mt-2 text-sm font-medium text-gray-900">No animals found</h3>
                 <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or category.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;