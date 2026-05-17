import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import SearchInput from '../components/SearchInput'; 
import HeroSlider from '../components/HeroSlider';
import { TrendingUp, ChevronRight, ChevronLeft, SlidersHorizontal, Search, Sparkles } from 'lucide-react';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(''); // <--- State for search

  const scrollRef = useRef(null);

  const categories = [
    { name: 'Cow', icon: '🐄' }, { name: 'Buffalo', icon: '🐃' }, { name: 'Goat', icon: '🐐' },
    { name: 'Sheep', icon: '🐑' }, { name: 'Camel', icon: '🐫' }, { name: 'Horse', icon: '🐎' },
    { name: 'Dog', icon: '🐕' }, { name: 'Cat', icon: '🐈' }, { name: 'Bird', icon: '🦜' },
    { name: 'Hen', icon: '🐔' }, { name: 'Duck', icon: '🦆' }, { name: 'Rabbit', icon: '🐇' },
    { name: 'Fish', icon: '🐟' }, { name: 'Other', icon: '🐾' }
  ];

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.type === "All") delete params.type;
      
      // Add search query to params
      if (searchQuery) params.search = searchQuery; 

      const response = await api.get('/animals/', { params });
      setAnimals(response.data);
      setFilteredAnimals(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  // Re-fetch when filters OR search query changes
  useEffect(() => { fetchAnimals(); }, [filters, searchQuery]);

  useEffect(() => {
    let sorted = [...animals];
    if (sortOption === 'lowPrice') sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === 'highPrice') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredAnimals(sorted);
  }, [sortOption, animals]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      direction === 'left' ? current.scrollBy({ left: -scrollAmount, behavior: 'smooth' }) : current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
         <HeroSlider />
         
         <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold mb-6 animate-bounce">
               <Sparkles size={14} /> The #1 Animal Marketplace
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
               Find Your Next <br/>
               <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Premium Investment</span>
            </h1>
            
            <div className="max-w-2xl mx-auto">
               <SearchInput onSearch={setSearchQuery} />
            </div>
            
            <div className="flex justify-center gap-6 text-sm font-medium mt-10">
               <div className="px-6 py-3 rounded-2xl bg-white/5 text-white backdrop-blur-md border border-white/10 flex items-center gap-3 shadow-2xl transition-all hover:bg-white/10 hover:border-white/20">
                 <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp size={18} className="text-green-400"/>
                 </div>
                 <div className="text-left">
                    <div className="text-lg font-bold leading-none">{animals.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Active Listings</div>
                 </div>
               </div>

               <div className="px-6 py-3 rounded-2xl bg-white/5 text-white backdrop-blur-md border border-white/10 flex items-center gap-3 shadow-2xl transition-all hover:bg-white/10 hover:border-white/20">
                 <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Search size={18} className="text-blue-400"/>
                 </div>
                 <div className="text-left">
                    <div className="text-lg font-bold leading-none">Verified</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Sellers Only</div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        
        {/* --- CATEGORIES --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">Browse Categories</h3>
                <div className="flex gap-2">
                  <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition shadow-sm"><ChevronLeft size={20} /></button>
                  <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition shadow-sm"><ChevronRight size={20} /></button>
                </div>
            </div>
            
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x scroll-smooth">
                <button onClick={() => setFilters({ ...filters, type: 'All' })} className={`flex-none snap-start w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${!filters.type || filters.type === 'All' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20 scale-105' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-200'}`}>
                   <span className="text-3xl">🏠</span><span className="text-xs font-bold">All</span>
                </button>
                {categories.map(cat => (
                   <button key={cat.name} onClick={() => setFilters({ ...filters, type: cat.name })} className={`flex-none snap-start w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${filters.type === cat.name ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20 scale-105' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-200'}`}>
                      <span className="text-3xl">{cat.icon}</span><span className="text-xs font-bold">{cat.name}</span>
                   </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
             <Filters onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="pl-2">
                   <h2 className="text-xl font-bold text-gray-900">
                     {searchQuery ? `Results for "${searchQuery}"` : (filters.type && filters.type !== "All" ? `${filters.type}s` : "Latest Arrivals")}
                   </h2>
                   <p className="text-gray-400 text-xs font-medium mt-1">Showing {filteredAnimals.length} results</p>
                </div>

                <div className="flex items-center gap-3">
                   <div className="relative group">
                      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none bg-gray-50 border border-transparent text-gray-700 text-sm font-medium rounded-xl py-2.5 pl-4 pr-10 outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 cursor-pointer transition-all hover:bg-gray-100">
                        <option value="newest">Newest First</option>
                        <option value="lowPrice">Price: Low to High</option>
                        <option value="highPrice">Price: High to Low</option>
                      </select>
                      <SlidersHorizontal className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                   </div>
                </div>
             </div>

             {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (<div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100 shadow-sm"></div>))}
               </div>
             ) : filteredAnimals.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredAnimals.map((animal) => (<AnimalCard key={animal.id} animal={animal} />))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Search className="text-gray-400" size={24} /></div>
                 <h3 className="text-lg font-bold text-gray-900">No Listings Found</h3>
                 <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">We couldn't find anything matching your search.</p>
                 <button onClick={() => {setFilters({}); setSearchQuery('')}} className="mt-6 text-green-600 font-bold text-sm hover:underline">Clear Search & Filters</button>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;