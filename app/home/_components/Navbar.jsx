"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from "@clerk/nextjs"
import { searchContent } from "../../utils/search"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Dynamically import SearchResults
const SearchResults = dynamic(() => import('./SearchResults'), { ssr: false });

const BlockTubeIcon = () => (
  <motion.svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    className="mr-2"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
  >
    <motion.rect
      x="4"
      y="4"
      width="24"
      height="24"
      rx="4"
      fill="url(#gradient)"
      className="mr-2"
      initial={{ rotate: 0 }}
      animate={{
        rotate: 360,
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    />
    <motion.path
      d="M20 16L14 20L14 12L20 16Z"
      fill="white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
    />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
  </motion.svg>
);

function Navbar({ selectedFilter, onFilterChange }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  const filters = ['All', 'Articles', 'Videos', 'Courses', 'Images'];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mounted]);

  const handleSearch = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchContent(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      const firstResult = searchResults[0];
      router.push(`/${firstResult.contentType}s/${firstResult.id}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
    }
  }, [searchQuery, searchResults, router]);

  const handleCloseSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  }, []);

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
            <h1 className="text-2xl font-bold tracking-tight">
              <motion.span 
                className="text-white inline-block"
                whileHover={{ scale: 1.1 }}
              >
                Block
              </motion.span>
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 inline-block"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                Tube
              </motion.span>
            </h1>
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
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="flex items-center flex-1 group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for content..."
                  className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-l-full focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 placeholder-gray-400"
                />
                <button 
                  type="submit"
                  className="px-6 py-2 text-gray-400 bg-gray-800 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-700 transition-colors duration-200 group-hover:border-red-500"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <AnimatePresence>
              {isSearchFocused && (
                <SearchResults 
                  results={searchResults}
                  onClose={handleCloseSearch}
                />
              )}
            </AnimatePresence>
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