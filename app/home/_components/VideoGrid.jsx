"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp, Play, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import CategoryMenu from './CategoryMenu';
import toast from 'react-hot-toast';

export default function VideoGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastVideoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchVideos = async (pageNum = 1, shouldAppend = false) => {
    try {
      const response = await fetch(
        `/api/videos?page=${pageNum}&limit=12${
          selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''
        }`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch videos');
      }

      setVideos(prev => shouldAppend ? [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when category changes
  useEffect(() => {
    setPage(1);
    setVideos([]);
    setHasMore(true);
    setLoading(true);
    fetchVideos(1, false);
  }, [selectedCategory]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      fetchVideos(page, true);
    }
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-300">Loading videos...</p>
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

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 text-lg">
          No videos available in {selectedCategory} category
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {videos.map((video, index) => (
            <Link key={video._id} href={`/content/video/${video._id}`}>
              <motion.div
                ref={index === videos.length - 1 ? lastVideoElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-gray-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnailURL || '/placeholder-video.jpg'}
                    alt={video.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {video.creator?.name || 'Anonymous'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{video.views || 0} views</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{video.commentsCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{video.likesCount || 0}</span>
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
          <p className="mt-2 text-gray-300">Loading more videos...</p>
        </div>
      )}

      {!loading && !hasMore && videos.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No more videos to load</p>
        </div>
      )}
    </div>
  );
} 