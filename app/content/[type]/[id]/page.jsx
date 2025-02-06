"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThumbsUp, 
  Share2, 
  Download, 
  Clock, 
  Users,
  Star,
  MessageCircle,
  Twitter,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import Sidebar from '../../../home/_components/Sidebar';
import ContentNavbar from '../../_components/ContentNavbar';
import { useParams } from 'next/navigation';
import CourseContent from '../../course/_components/CourseContent';
import { useUser } from '@clerk/nextjs';
import toast, { Toaster } from 'react-hot-toast';
import ArticleView from '../../article/_components/ArticleView';
import ImageView from '../../image/_components/ImageView';
import Comments from '../../_components/Comments';

export default function ContentPage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Fetch content data
  const fetchContent = async () => {
    try {
      // Use the appropriate endpoint based on content type
      const endpoint = params.type === 'course' 
        ? `/api/content/course/${params.id}`
        : params.type === 'image'
        ? `/api/content/image/${params.id}`
        : `/api/content/${params.id}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch content');
      }

      // Add content type to the data
      const contentWithType = {
        ...data.data,
        contentType: params.type
      };

      setContent(contentWithType);
      setIsLiked(data.data.isLiked || false);
      setLikesCount(data.data.likesCount || 0);

      // Fetch related content
      const relatedResponse = await fetch(
        `/api/content?page=1&limit=4&type=${params.type}&filter=published`
      );
      const relatedData = await relatedResponse.json();

      if (relatedResponse.ok) {
        // Filter out current content and add like status
        const filteredRelated = relatedData.data
          .filter(item => item._id !== params.id)
          .map(item => ({
            ...item,
            isLiked: user ? item.likes.some(like => like.userId === user.id) : false
          }));
        setRelatedContent(filteredRelated);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchContent();
    }
  }, [params.id, params.type, isLoaded]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like content');
      return;
    }

    if (likeInProgress) return;

    try {
      setLikeInProgress(true);
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

      const response = await fetch(`/api/content/${params.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update if request fails
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
        throw new Error(data.message || 'Failed to update like');
      }

      // Show success animation
      toast.success(isLiked ? 'Removed from likes' : 'Added to likes', {
        icon: isLiked ? '💔' : '❤️'
      });

      // Update state with actual server response
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error(error.message || 'Failed to update like');
    } finally {
      setLikeInProgress(false);
    }
  };

  const handleShare = async (platform = 'copy') => {
    const shareUrl = window.location.href;
    const shareTitle = content?.title || 'Check out this content';
    const shareText = content?.description || 'Interesting content from DecentralHub';

    try {
      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          toast.success('Opening Twitter to share');
          break;

        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          toast.success('Opening Facebook to share');
          break;

        case 'copy':
        default:
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!', {
            icon: '📋',
            style: {
              borderRadius: '10px',
            },
          });
          break;
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      toast.error('Failed to share content');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ContentNavbar />
        <div className="flex pt-16">
          <div className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0">
            <Sidebar />
          </div>
          <div className="pl-64 w-full">
            <main className="container mx-auto px-8 py-6">
              <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ContentNavbar />
        <div className="flex pt-16">
          <div className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0">
            <Sidebar />
          </div>
          <div className="pl-64 w-full">
            <main className="container mx-auto px-8 py-6">
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-xl text-white mb-4">Content not found</h2>
                <p className="text-gray-400">The content you're looking for doesn't exist or has been removed.</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ContentNavbar />
      <div className="flex pt-16">
        <div className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0">
          <Sidebar />
        </div>
        <div className="pl-64 w-full">
          <main className="container mx-auto px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {params.type === 'article' ? (
                  <ArticleView article={content} />
                ) : params.type === 'image' ? (
                  <ImageView image={content} />
                ) : (
                  <>
                    {/* Content Preview */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                      <img
                        src={content.thumbnailURL || '/placeholder-image.jpg'}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      {params.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
                          </motion.button>
                        </div>
                      )}
                      {params.type === 'image' && (
                        <div className="absolute bottom-4 right-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Image
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="mt-4">
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {content.title}
                      </h1>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            {params.type === 'video' && (
                              <>
                                <Users className="w-4 h-4" />
                                <span>{content.views} views</span>
                              </>
                            )}
                            {params.type === 'course' && (
                              <>
                                <Users className="w-4 h-4" />
                                <span>{content.students || 0} students</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span>{content.commentsCount || 0} comments</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLike}
                            disabled={likeInProgress || !user}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                              isLiked
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            } ${likeInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <ThumbsUp 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isLiked ? 'fill-current scale-110' : ''
                              }`} 
                            />
                            <span>{likesCount}</span>
                          </motion.button>

                          <div className="relative group">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all duration-200"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </motion.button>

                            {/* Share options dropdown */}
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 py-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 hidden group-hover:block"
                              >
                                <button
                                  onClick={() => handleShare('copy')}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                  Copy Link
                                </button>
                                <button
                                  onClick={() => handleShare('twitter')}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <Twitter className="w-4 h-4" />
                                  Share on Twitter
                                </button>
                                <button
                                  onClick={() => handleShare('facebook')}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <Facebook className="w-4 h-4" />
                                  Share on Facebook
                                </button>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6 p-4 bg-gray-800 rounded-xl">
                        <p className="text-gray-300 leading-relaxed">
                          {content.description}
                        </p>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">Comments</h2>
                        <Comments contentId={content._id} />
                      </div>
                    </div>
                  </>
                )}

                {/* Creator Info */}
                <div className="mt-6 flex items-start gap-4 p-4 bg-gray-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Creator"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      Creator
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Wallet: {content.creatorWallet}
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Content */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold text-white mb-4">Related Content</h2>
                <div className="space-y-4">
                  {relatedContent.map((item) => (
                    <motion.a
                      key={item._id}
                      href={`/content/${item.contentType}/${item._id}`}
                      className="flex gap-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-40 aspect-video rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnailURL || '/placeholder-image.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.likesCount || 0}</span>
                          <span>•</span>
                          <MessageCircle className="w-3 h-3" />
                          <span>{item.commentsCount || 0}</span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 