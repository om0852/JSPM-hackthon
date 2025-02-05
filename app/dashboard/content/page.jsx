'use client';
import { Plus, Search, Filter } from 'lucide-react';
import ContentList from './components/ContentList';
import CreateContentModal from './components/CreateContentModal';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContent, setEditingContent] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, isLoaded } = useUser();

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-2 text-gray-900">Loading...</p>
      </div>
    );
  }

  // Redirect or show message if no user is found
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-900">Please sign in to view your content.</p>
      </div>
    );
  }

  const refreshContents = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleContentCreated = (newContent) => {
    refreshContents();
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleContentDeleted = () => {
    refreshContents();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4CAF50',
              secondary: '#FFF',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#E53E3E',
              secondary: '#FFF',
            },
          },
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Content Management
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-200"
        >
          <Plus size={20} />
          <span>Create Content</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title, description, type, or category..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              bg-white transition-all duration-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              bg-white transition-all duration-200"
          >
            <option value="all">All Content</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </motion.div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ContentList 
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleContentDeleted}
          refreshTrigger={refreshTrigger}
          user={user}
        />
      </motion.div>

      {/* Create/Edit Content Modal */}
      <CreateContentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onContentCreated={handleContentCreated}
        editingContent={editingContent}
      />
    </motion.div>
  );
} 