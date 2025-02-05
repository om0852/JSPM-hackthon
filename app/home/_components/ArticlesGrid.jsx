"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ThumbsUp, BookOpen } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "Understanding Modern JavaScript: ES6 and Beyond",
    author: "Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    readTime: "5 min read",
    likes: "8.2K",
    type: "Article",
    excerpt: "Dive deep into modern JavaScript features and best practices..."
  },
  {
    id: 2,
    title: "The Complete Guide to React Hooks in 2024",
    author: "Mike Chen",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    readTime: "8 min read",
    likes: "12K",
    type: "Article",
    excerpt: "Learn how to leverage React Hooks to write cleaner, more efficient code..."
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    author: "Alex Thompson",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    readTime: "10 min read",
    likes: "6.5K",
    type: "Article",
    excerpt: "Best practices for building robust and scalable APIs using Node.js..."
  },
  {
    id: 4,
    title: "Machine Learning: A Beginner's Guide",
    author: "Dr. Emily White",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    readTime: "12 min read",
    likes: "15K",
    type: "Article",
    excerpt: "Get started with machine learning concepts and practical applications..."
  }
];

export default function ArticlesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            layout
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-gray-700"
          >
            {/* Article Header */}
            <div className="relative h-48">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400">
                  {article.title}
                </h3>
                <p className="text-gray-200 text-sm">{article.author}</p>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-4">
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{article.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 