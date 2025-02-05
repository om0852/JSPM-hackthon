"use client";

import { motion } from 'framer-motion';
import { Video, BookOpen, FileText, Image } from 'lucide-react';
import Link from 'next/link';

const getIcon = (contentType) => {
  switch (contentType) {
    case 'video':
      return Video;
    case 'course':
      return BookOpen;
    case 'article':
      return FileText;
    case 'image':
      return Image;
    default:
      return FileText;
  }
};

export default function SearchResults({ results, onClose }) {
  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 mx-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
    >
      <div className="divide-y divide-gray-700">
        {results.map((result) => {
          const Icon = getIcon(result.contentType);
          return (
            <Link
              key={result.id}
              href={`/content/${result.contentType}/${result.id}`}
              onClick={onClose}
              className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{result.title}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <Icon className="w-3 h-3" />
                  <span className="capitalize">{result.contentType}</span>
                  {(result.provider || result.author) && (
                    <>
                      <span className="px-1">•</span>
                      <span>{result.provider || result.author}</span>
                    </>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
} 