"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart } from 'lucide-react';

const images = [
  {
    id: 1,
    title: "Modern Web Development Setup",
    photographer: "Tech Visuals",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: "2.3K",
    downloads: "1.2K",
    type: "Image"
  },
  {
    id: 2,
    title: "AI and Machine Learning Concept",
    photographer: "Future Labs",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    likes: "3.1K",
    downloads: "856",
    type: "Image"
  },
  {
    id: 3,
    title: "Clean Code Architecture",
    photographer: "Code Aesthetics",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    likes: "4.2K",
    downloads: "2.1K",
    type: "Image"
  },
  {
    id: 4,
    title: "Blockchain Technology",
    photographer: "Crypto Vision",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    likes: "1.8K",
    downloads: "945",
    type: "Image"
  },
  {
    id: 5,
    title: "Mobile App Development",
    photographer: "App Design Pro",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    likes: "2.7K",
    downloads: "1.5K",
    type: "Image"
  },
  {
    id: 6,
    title: "DevOps Pipeline Visualization",
    photographer: "Tech Flow",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    likes: "1.9K",
    downloads: "780",
    type: "Image"
  }
];

export default function ImagesGrid() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
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
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-100 mb-1 group-hover:text-red-400">
                  {image.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">by {image.photographer}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{image.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{image.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 