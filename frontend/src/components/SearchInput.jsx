import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for animals (e.g. Sahiwal Cow)..."
          className="w-full bg-white text-gray-900 pl-12 pr-12 py-4 rounded-full shadow-lg border-2 border-transparent focus:border-green-500 focus:outline-none transition-all placeholder-gray-400 font-medium text-base"
        />
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        
        {query && (
          <button 
            type="button" 
            onClick={clearSearch}
            className="absolute right-14 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        
        <button 
          type="submit"
          className="absolute right-2 top-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition shadow-md"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchInput;