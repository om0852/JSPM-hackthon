"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import CategoryMenu from './CategoryMenu';

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2024",
    author: "John Developer",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    duration: "2:15:30",
    likes: "12K",
    rating: "4.8",
    students: "2.5K",
    type: "Course",
    category: "Tech",
    contentType: "course"
  },
  {
    id: 2,
    title: "UI/UX Design Principles for Beginners",
    author: "Design Masters",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    duration: "1:30:00",
    likes: "18K",
    rating: "4.9",
    students: "3.2K",
    type: "Course",
    category: "Art",
    contentType: "course"
  },
  {
    id: 3,
    title: "Machine Learning with Python: From Zero to Hero",
    author: "AI Experts",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    duration: "3:45:00",
    likes: "15K",
    rating: "4.7",
    students: "1.8K",
    type: "Course",
    category: "Education",
    contentType: "course"
  },
  {
    id: 4,
    title: "Mobile App Development with React Native",
    author: "App Academy",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    duration: "2:00:00",
    likes: "10K",
    rating: "4.6",
    students: "2.1K",
    type: "Course",
    category: "Tech",
    contentType: "course"
  }
];

export default function CourseGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'All' ? true : course.category === selectedCategory
  );

  return (
    <div>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, index) => (
            <Link 
              key={course.id} 
              href={`/content/course/${course.id}`}
            >
              <motion.div
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
                    src={course.thumbnail}
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{course.author}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{course.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 