"use client";

import React, { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from "@clerk/nextjs"
import { searchContent } from "../../utils/search"
import SearchResults from '../../home/_components/SearchResults'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ContentNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchContent(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      const firstResult = searchResults[0];
      router.push(`/content/${firstResult.contentType}/${firstResult.id}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
    }
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-gray-900 border-b border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
        {/* Left side - Logo */}
        <Link href="/home">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
          >
            <motion.h1 
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="text-white"
                whileHover={{ color: '#f87171' }}
                transition={{ duration: 0.2 }}
              >
                Block
              </motion.span>
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                Tube
              </motion.span>
            </motion.h1>
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
    </motion.div>
  );
}

export default ContentNavbar 