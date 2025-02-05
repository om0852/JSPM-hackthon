'use client';

import { motion } from 'framer-motion';
import { Clock, MessageCircle, Globe, Twitter, Github } from 'lucide-react';
import Comments from './Comments';

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
        {article.subscriptionTier !== 'free' && article.price > 0 && (
          <div className="flex items-center gap-2">
            <span>Price:</span>
            <span>${article.price}</span>
          </div>
        )}
      </div>

      {/* Creator Info */}
      <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-xl">
        <img
          src={article.creator?.image || '/placeholder-user.jpg'}
          alt={article.creator?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {article.creator?.name}
          </h3>
          {article.creator?.bio && (
            <p className="text-gray-300 mb-4">{article.creator.bio}</p>
          )}
          <div className="flex items-center gap-4">
            {article.creator?.socialLinks?.website && (
              <a
                href={article.creator.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
            {article.creator?.socialLinks?.twitter && (
              <a
                href={article.creator.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {article.creator?.socialLinks?.github && (
              <a
                href={article.creator.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Comments</h2>
        <Comments contentId={article._id} />
      </div>
    </div>
  );
} 