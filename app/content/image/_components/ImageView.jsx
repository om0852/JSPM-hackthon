'use client';

import { motion } from 'framer-motion';
import { Download, MessageCircle, Globe, Twitter, Github } from 'lucide-react';
import Comments from '../../article/_components/Comments';

export default function ImageView({ image }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Image Display */}
      <div className="relative rounded-xl overflow-hidden bg-gray-800">
        <img
          src={image.contentURL || image.thumbnailURL}
          alt={image.title}
          className="w-full object-contain max-h-[70vh]"
        />
        {/* Download Button */}
        <div className="absolute bottom-4 right-4">
          <a
            href={image.contentURL || image.thumbnailURL}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.open(image.contentURL || image.thumbnailURL, '_blank');
            }}
          >
            <Download className="w-4 h-4" />
            Download Image
          </a>
        </div>
      </div>

      {/* Image Info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Published on {formatDate(image.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{image.commentsCount || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Image Content */}
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-4">{image.title}</h1>
        <div className="text-gray-300">
          {/* Split description into paragraphs */}
          {image.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Image Categories */}
      {image.categories && image.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
          {image.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Image Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>Views:</span>
          <span>{image.views || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Likes:</span>
          <span>{image.likesCount || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Downloads:</span>
          <span>{image.downloads || 0}</span>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex items-start gap-6 p-6 bg-gray-800 rounded-xl">
        <img
          src={image.creator?.image || '/placeholder-user.jpg'}
          alt={image.creator?.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {image.creator?.name || 'Anonymous'}
          </h3>
          {image.creator?.bio && (
            <p className="text-gray-300 mb-4">{image.creator.bio}</p>
          )}
          <div className="flex items-center gap-4">
            {image.creator?.socialLinks?.website && (
              <a
                href={image.creator.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
            {image.creator?.socialLinks?.twitter && (
              <a
                href={image.creator.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {image.creator?.socialLinks?.github && (
              <a
                href={image.creator.socialLinks.github}
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
        <Comments contentId={image._id} />
      </div>
    </div>
  );
} 