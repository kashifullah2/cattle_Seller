import React, { useEffect, useState } from 'react';
import api from '../api';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import { Search, TrendingUp, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('newest');

  // Categories with fixed icons
  const categories = [
    { name: 'Cow', icon: '🐄' }, { name: 'Buffalo', icon: '🐃' }, { name: 'Goat', icon: '🐐' },
    { name: 'Sheep', icon: '🐑' }, { name: 'Camel', icon: '🐫' }, { name: 'Horse', icon: '🐎' },
    { name: 'Dog', icon: '🐕' }, { name: 'Cat', icon: '🐈' }, { name: 'Bird', icon: '🦜' },
    { name: 'Other', icon: '🐾' }
  ];

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.type === "All") delete params.type;
      
      const response = await api.get('/animals/', { params });
      setAnimals(response.data);
      setFilteredAnimals(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    let sorted = [...animals];
    if (sortOption === 'lowPrice') sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === 'highPrice') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredAnimals(sorted);
  }, [sortOption, animals]);

  useEffect(() => { fetchAnimals(); }, [filters]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gray-900 pt-20 pb-24 text-center px-4 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/40 via-gray-900/0 to-gray-900/0 pointer-events-none"></div>
         <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 relative z-10">
            Find Your Next <span className="text-green-500">Investment</span>
         </h1>
         <p className="text-gray-400 max-w-xl mx-auto text-lg mb-8 relative z-10">
            The most trusted marketplace for premium livestock and pets. Verified sellers, secure deals.
         </p>
         
         <div className="flex justify-center gap-4 text-sm font-medium relative z-10">
            <div className="px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400"/> {animals.length}+ Animals Listed
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        
        {/* --- CATEGORIES (Floating Card) --- */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-12">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-gray-900 text-lg">Browse Categories</h3>
                <button onClick={() => setFilters({})} className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
                   View All <ChevronRight size={16} />
                </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                <button 
                  onClick={() => setFilters({ ...filters, type: 'All' })}
                  className={`flex-none snap-start w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${!filters.type || filters.type === 'All' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                >
                   <span className="text-2xl">🏠</span>
                   <span className="text-xs font-bold">All</span>
                </button>

                {categories.map(cat => (
                   <button 
                     key={cat.name}
                     onClick={() => setFilters({ ...filters, type: cat.name })}
                     className={`flex-none snap-start w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${filters.type === cat.name ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                   >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-bold">{cat.name}</span>
                   </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
             <Filters onFilterChange={setFilters} />
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
             
             {/* Header */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">
                     {filters.type && filters.type !== "All" ? `${filters.type}s` : "Latest Arrivals"}
                   </h2>
                   <p className="text-gray-500 text-sm mt-1">Showing {filteredAnimals.length} results</p>
                </div>

                <div className="flex items-center gap-3">
                   <div className="relative group">
                      <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl py-2.5 pl-4 pr-10 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 cursor-pointer shadow-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="lowPrice">Price: Low to High</option>
                        <option value="highPrice">Price: High to Low</option>
                      </select>
                      <SlidersHorizontal className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>
             </div>

             {/* Grid */}
             {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100"></div>
                 ))}
               </div>
             ) : filteredAnimals.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredAnimals.map((animal) => (
                   <AnimalCard key={animal.id} animal={animal} />
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-400" size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">No Listings Found</h3>
                 <p className="text-gray-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search for a different category.</p>
                 <button onClick={() => setFilters({})} className="mt-6 text-green-600 font-bold text-sm hover:underline">Reset Filters</button>
               </div>
             )}

          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;