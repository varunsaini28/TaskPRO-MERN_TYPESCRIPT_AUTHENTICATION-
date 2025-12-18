import React, { useState, useEffect, useCallback } from 'react';
import { LiaSearchSolid } from "react-icons/lia";
import { useDebounce } from '../../hooks/useDebounce';
import type { Task } from '../../types/task.types';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  delay?: number;
}

const Search: React.FC<SearchProps> = ({ 
  onSearch, 
  placeholder = "Search tasks...",
  delay = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        {/* Search Icon */}
        <LiaSearchSolid
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
        />

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="
            w-full h-10 pl-10 pr-10
            rounded-lg bg-white
            text-gray-700 placeholder-gray-400
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600
              transition-colors duration-200
            "
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search tips */}
      {!searchTerm && (
        <div className="mt-2 text-xs text-gray-500 flex gap-4">
          <span>Try: "urgent", "meeting", "today"</span>
        </div>
      )}
    </div>
  );
};

export default Search;