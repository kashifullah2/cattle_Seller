import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import { Search } from 'lucide-react';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'All',
    city: '',
    minPrice: '',
    maxPrice: ''
  });

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      // Create a clean params object
      const params = {};
      
      // Only add parameters if they have actual values
      if (filters.type && filters.type !== "All") params.type = filters.type;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;

      const response = await api.get('/animals/', { params });
      setAnimals(response.data);
    } catch (error) {
      console.error("Error fetching animals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [filters]); // Re-run when filters change

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
             <Filters onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
             <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Fresh Listings</h1>
                <span className="text-sm text-gray-500">{animals.length} animals found</span>
             </div>

             {loading ? (
               <div className="flex justify-center items-center h-64">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
               </div>
             ) : animals.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {animals.map((animal) => (
                   <AnimalCard key={animal.id} animal={animal} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                 <Search className="mx-auto h-12 w-12 text-gray-400" />
                 <h3 className="mt-2 text-sm font-medium text-gray-900">No animals found</h3>
                 <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;