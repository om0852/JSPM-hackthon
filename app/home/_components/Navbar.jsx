"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Video, Book, Image as ImageIcon, FileText, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from "@clerk/nextjs"
import { searchContent } from "../../utils/search"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Dynamically import SearchResults
const SearchResults = dynamic(() => import('./SearchResults'), { ssr: false });

// Logo component
const BlockTubeIcon = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold">D</span>
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      DecentralHub
    </span>
  </div>
);

// Search Result Item component
const SearchResultItem = ({ result, onSelect }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'course':
        return <Book className="w-4 h-4 text-purple-500" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-green-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-red-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={() => onSelect(result)}
      className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
        <p className="text-xs text-gray-500 truncate">{result.creator}</p>
      </div>
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          {result.type}
        </span>
      </div>
    </motion.div>
  );
};

function Navbar({ selectedFilter, onFilterChange }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  const filters = ['All', 'Articles', 'Videos', 'Courses', 'Images'];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mounted]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data.results);
      } else {
        console.error('Search failed:', data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (result) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/content/${result.type}/${result._id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div 
      key="navbar-container"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-gray-900 border-b border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
        {/* Left side - Logo */}
        <Link href="/home">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center cursor-pointer"
          >
            <BlockTubeIcon />
          </motion.div>
        </Link>

        {/* Middle - Search Bar */}
        <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                className="relative flex items-center"
                initial={false}
                animate={{
                  width: searchQuery ? "100%" : "100%"
                }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full 
                           bg-gray-50 focus:bg-white
                           text-gray-900 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="Search for content..."
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </motion.div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && (searchResults.length > 0 || isSearching) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="py-2">
                      {isSearching ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                      ) : (
                        searchResults.map((result) => (
                          <SearchResultItem
                            key={result._id}
                            result={result}
                            onSelect={handleResultSelect}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right side - Clerk Profile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <UserButton afterSignOutUrl="/" />
        </motion.div>
      </div>

      {/* Filter Menu */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center px-4 py-2 border-t border-gray-800 bg-gray-900"
      >
        <nav className="flex justify-center gap-2 w-full max-w-2xl">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filter)}
              className={`px-6 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 flex-1 max-w-[120px] ${
                selectedFilter === filter
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </nav>
      </motion.div>
    </motion.div>
  );
}

export default Navbar