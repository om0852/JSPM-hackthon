"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp, BookOpen, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import CategoryMenu from './CategoryMenu';
import toast from 'react-hot-toast';

export default function CourseGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastCourseElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchCourses = async (pageNum = 1, shouldAppend = false) => {
    try {
      const response = await fetch(
        `/api/courses?page=${pageNum}&limit=12${
          selectedCategory !== 'All' ? `&category=${selectedCategory}` : ''
        }`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      setCourses(prev => shouldAppend ? [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when category changes
  useEffect(() => {
    setPage(1);
    setCourses([]);
    setHasMore(true);
    setLoading(true);
    fetchCourses(1, false);
  }, [selectedCategory]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      fetchCourses(page, true);
    }
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-300">Loading courses...</p>
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

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 text-lg">
          No courses available in {selectedCategory} category
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
          {courses.map((course, index) => (
            <Link 
              key={course._id} 
              href={`/content/course/${course._id}`}
            >
              <motion.div
                ref={index === courses.length - 1 ? lastCourseElementRef : null}
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
                    src={course.thumbnailURL}
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  {course.rating && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {course.creator?.name || 'Anonymous'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{course.commentsCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{course.likesCount}</span>
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
          <p className="mt-2 text-gray-300">Loading more courses...</p>
        </div>
      )}

      {!loading && !hasMore && courses.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No more courses to load</p>
        </div>
      )}
    </div>
  );
} 