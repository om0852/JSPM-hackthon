"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp } from 'lucide-react';

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

export default function AllContentGrid({ filter = 'All' }) {
  const filteredContent = allContent.filter(content => {
    if (filter === 'All') return true;
    return content.type === filter;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {filteredContent.map((content, index) => (
          <motion.div
            key={content.id}
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
                src={content.thumbnail}
                alt={content.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{content.duration}</span>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {content.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                {content.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">{content.author}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{content.views} views</span>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{content.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 