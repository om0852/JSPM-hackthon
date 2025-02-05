"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp, Play } from 'lucide-react';
import CategoryMenu from './CategoryMenu';

const videos = [
  {
    id: 1,
    title: "Introduction to Web3 and Blockchain",
    author: "Crypto Academy",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    views: "89K",
    duration: "45:20",
    likes: "9.5K",
    type: "Video",
    category: "Tech"
  },
  {
    id: 2,
    title: "Getting Started with TypeScript",
    author: "Code Masters",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    views: "75K",
    duration: "32:15",
    likes: "8K",
    type: "Video",
    category: "Tech"
  },
  {
    id: 3,
    title: "Docker for Beginners",
    author: "DevOps Pro",
    thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
    views: "120K",
    duration: "28:45",
    likes: "11K",
    type: "Video",
    category: "Education"
  },
  {
    id: 4,
    title: "Advanced Git Workflows",
    author: "Version Control Hub",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb",
    views: "95K",
    duration: "38:30",
    likes: "9.8K",
    type: "Video",
    category: "Tech"
  }
];

export default function VideoGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'All' ? true : video.category === selectedCategory
  );

  return (
    <div>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
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
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{video.author}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{video.views} views</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{video.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 