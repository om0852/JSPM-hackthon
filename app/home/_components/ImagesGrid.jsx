"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, MessageCircle } from 'lucide-react';
import CategoryMenu from './CategoryMenu';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ImagesGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastImageElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchImages = async (pageNum = 1, shouldAppend = false) => {
    try {
      const response = await fetch(
        `/api/images?page=${pageNum}&limit=12${
          selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''
        }`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch images');
      }

      setImages(prev => shouldAppend ? [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when category changes
  useEffect(() => {
    setPage(1);
    setImages([]);
    setHasMore(true);
    setLoading(true);
    fetchImages(1, false);
  }, [selectedCategory]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      fetchImages(page, true);
    }
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-300">Loading images...</p>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 text-lg">
          No images available in {selectedCategory} category
        </p>
      </div>
    );
  }

  return (
    <div>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => (
            <Link key={image._id} href={`/content/image/${image._id}`}>
            <motion.div
              ref={index === images.length - 1 ? lastImageElementRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
                {/* Image */}
                <div className="relative">
                  <img
                    src={image.thumbnailURL}
                    alt={image.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <a 
                      href={image.contentURL || image.thumbnailURL}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(image.contentURL || image.thumbnailURL, '_blank');
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-1 group-hover:text-red-400">
                    {image.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">by {image.creator?.name || 'Anonymous'}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{image.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{image.commentsCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{image.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
              </Link>
          ))}
        </AnimatePresence>
      </div>

      {loading && page > 1 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-300">Loading more images...</p>
        </div>
      )}

      {!loading && !hasMore && images.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No more images to load</p>
        </div>
      )}
    </div>
  );
} 