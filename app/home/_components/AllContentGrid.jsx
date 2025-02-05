"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const allContent = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    author: "John Developer",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    views: "125K",
    duration: "2:15:30",
    likes: "12K",
    type: "Course"
  },
  {
    id: 2,
    title: "Blockchain Fundamentals: A Comprehensive Guide",
    author: "Crypto Academy",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    views: "89K",
    duration: "45:20",
    likes: "9.5K",
    type: "Video"
  },
  {
    id: 3,
    title: "UI/UX Design Principles for Beginners",
    author: "Design Masters",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    views: "200K",
    duration: "1:30:00",
    likes: "18K",
    type: "Course"
  },
  {
    id: 4,
    title: "Machine Learning with Python: From Zero to Hero",
    author: "AI Experts",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    views: "150K",
    duration: "3:45:00",
    likes: "15K",
    type: "Course"
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    author: "App Academy",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    views: "95K",
    duration: "2:00:00",
    likes: "10K",
    type: "Course"
  },
  {
    id: 6,
    title: "DevOps Best Practices for 2024",
    author: "Tech Solutions",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    views: "75K",
    duration: "1:15:00",
    likes: "8K",
    type: "Video"
  }
];

export default function AllContentGrid({ filter }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastContentElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchContents = async (pageNum = 1, shouldAppend = false) => {
    try {
      const contentType = filter === 'All' ? '' : filter.toLowerCase().slice(0, -1); // Remove 's' from end
      const response = await fetch(
        `/api/content?page=${pageNum}&limit=12${contentType ? `&type=${contentType}` : ''}&filter=published`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contents');
      }

      setContents(prev => shouldAppend ? [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setContents([]);
    setHasMore(true);
    setLoading(true);
    fetchContents(1, false);
  }, [filter]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      fetchContents(page, true);
    }
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-300">Loading contents...</p>
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

  if (contents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 text-lg">
          No {filter.toLowerCase()} available
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contents.map((content, index) => (
          <motion.div
            key={content._id}
            ref={index === contents.length - 1 ? lastContentElementRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative pb-[56.25%]">
              <img
                src={content.thumbnailURL || '/placeholder-image.jpg'}
                alt={content.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2">
                {content.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {content.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  content.contentType === 'video' ? 'bg-blue-900 text-blue-200' :
                  content.contentType === 'article' ? 'bg-green-900 text-green-200' :
                  content.contentType === 'course' ? 'bg-purple-900 text-purple-200' :
                  'bg-gray-700 text-gray-200'
                }`}>
                  {content.contentType}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  content.subscriptionTier === 'premium' ? 'bg-yellow-900 text-yellow-200' :
                  content.subscriptionTier === 'basic' ? 'bg-orange-900 text-orange-200' :
                  'bg-gray-700 text-gray-200'
                }`}>
                  {content.subscriptionTier}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && page > 1 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-300">Loading more...</p>
        </div>
      )}

      {!loading && !hasMore && contents.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No more contents to load</p>
        </div>
      )}
    </>
  );
} 