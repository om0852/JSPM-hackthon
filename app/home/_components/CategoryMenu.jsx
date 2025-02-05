"use client";

import { motion } from 'framer-motion';

export default function CategoryMenu({ selectedCategory, onCategoryChange }) {
  const categories = ['All', 'Tech', 'Art', 'Education', 'Gaming', 'Music'];

  return (
    <div className="mb-6">
      <nav className="flex justify-start gap-2 w-full">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </nav>
    </div>
  );
} 