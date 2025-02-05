"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import CategoryMenu from './CategoryMenu';

export default function ArticlesGrid() {
  const { user, isLoaded } = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likeInProgress, setLikeInProgress] = useState(false);

  const observer = useRef();
  const lastArticleElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchArticles = async (pageNum = 1, shouldAppend = false) => {
    try {
      const response = await fetch(
        `/api/content?page=${pageNum}&limit=12&type=article&filter=published`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch articles');
      }

      const articlesWithLikeStatus = data.data.map(article => ({
        ...article,
        isLiked: user ? article.likes.some(like => like.userId === user.id) : false
      }));

      setArticles(prev => shouldAppend ? [...prev, ...articlesWithLikeStatus] : articlesWithLikeStatus);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId, event) => {
    event.preventDefault(); // Prevent navigation
    
    if (!isLoaded || !user) {
      toast.error('Please sign in to like articles');
      return;
    }

    if (likeInProgress) return;

    setLikeInProgress(true);
    try {
      const response = await fetch(`/api/content/${articleId}/like`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process like');
      }

      setArticles(prev => prev.map(article => {
        if (article._id === articleId) {
          return {
            ...article,
            likesCount: data.likesCount,
            isLiked: data.isLiked
          };
        }
        return article;
      }));

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLikeInProgress(false);
    }
  };

  // Initial fetch and refresh handling
  useEffect(() => {
    if (isLoaded) {
      setPage(1);
      setArticles([]);
      setHasMore(true);
      setLoading(true);
      fetchArticles(1, false);
    }
  }, [isLoaded]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1 && isLoaded) {
      setLoading(true);
      fetchArticles(page, true);
    }
  }, [page, isLoaded]);

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'All' ? true : article.category === selectedCategory
  );

  if (loading && page === 1) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-300">Loading articles...</p>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 text-lg">No articles available</p>
      </div>
    );
  }

  return (
    <div>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article, index) => (
          <div key={article._id} className="relative">
            <Link href={`/content/article/${article._id}`}>
              <motion.div
                ref={index === articles.length - 1 ? lastArticleElementRef : null}
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
                    src={article.thumbnailURL || '/placeholder-image.jpg'}
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
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{article.commentsCount || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleLike(article._id, e)}
                      className={`flex items-center gap-1 transition-colors ${
                        article.isLiked ? 'text-red-400 hover:text-red-500' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {article.isLiked ? (
                        <ThumbsUp className="w-4 h-4 fill-current" />
                      ) : (
                        <ThumbsUp className="w-4 h-4" />
                      )}
                      <span>{article.likesCount || 0}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </div>

      {loading && page > 1 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-300">Loading more articles...</p>
        </div>
      )}

      {!loading && !hasMore && articles.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-300">No more articles to load</p>
        </div>
      )}
    </div>
  );
} 