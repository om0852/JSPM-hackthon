'use client';

import { motion } from 'framer-motion';
import { Clock, MessageCircle } from 'lucide-react';

export default function ArticleView({ article }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Article Header */}
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-800">
        <img
          src={article.thumbnailURL || '/placeholder-image.jpg'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
      </div>

      {/* Article Info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{article.commentsCount || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
        <div className="text-gray-300">
          {/* Split description into paragraphs */}
          {article.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Article Categories */}
      {article.categories && article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
          {article.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Article Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>Views:</span>
          <span>{article.views || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Likes:</span>
          <span>{article.likesCount || 0}</span>
        </div>
        {article.subscriptionTier !== 'free' && (
          <div className="flex items-center gap-2">
            <span>Price:</span>
            <span>${article.price || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
} 