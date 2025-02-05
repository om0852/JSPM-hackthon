"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Download, 
  Clock, 
  Users,
  BookOpen,
  Star
} from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import Sidebar from '../../../home/_components/Sidebar';
import ContentNavbar from '../../_components/ContentNavbar';
import { searchContent } from '../../../utils/search';
import { useParams } from 'next/navigation';
import CourseContent from '../../course/_components/CourseContent';

export default function ContentPage() {
  const params = useParams();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadContent = () => {
      try {
        // In a real app, this would be an API call
        const allContent = searchContent('');
        const foundContent = allContent.find(
          item => item.contentType === params.type && item.id.toString() === params.id
        );
        
        if (foundContent) {
          setContent(foundContent);
          
          // Get related content of the same type
          const related = allContent
            .filter(item => 
              item.contentType === params.type && 
              item.id.toString() !== params.id
            )
            .slice(0, 4);
          setRelatedContent(related);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [params.type, params.id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const formatDate = () => {
    if (!mounted) return ''; // Return empty string during SSR
    
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
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
                {/* Content Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  {content.contentType === 'video' && (
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
                  {content.contentType === 'image' && (
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
                        {content.contentType === 'video' && (
                          <>
                            <Users className="w-4 h-4" />
                            <span>{content.views} views</span>
                          </>
                        )}
                        {content.contentType === 'course' && (
                          <>
                            <Users className="w-4 h-4" />
                            <span>{content.students} students</span>
                            <span className="px-1">•</span>
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{content.rating}</span>
                          </>
                        )}
                        {content.contentType === 'article' && (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>{content.readTime}</span>
                          </>
                        )}
                        {content.contentType === 'image' && (
                          <>
                            <Download className="w-4 h-4" />
                            <span>{content.downloads} downloads</span>
                          </>
                        )}
                      </div>
                      {mounted && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{formatDate()}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                          isLiked
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        } transition-colors`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{content.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Course Content Section */}
                  {content.contentType === 'course' && (
                    <div className="mt-6">
                      <CourseContent course={content} />
                    </div>
                  )}

                  {/* Article Content Section */}
                  {content.contentType === 'article' && (
                    <div className="mb-6 p-4 bg-gray-800 rounded-xl">
                      <p className="text-gray-300 leading-relaxed">
                        {content.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Creator Info */}
                  <div className="mt-6 flex items-start gap-4 p-4 bg-gray-800 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {content.author || content.photographer}
                      </h3>
                      {content.contentType === 'course' && (
                        <div className="flex items-center gap-2 text-yellow-500 mt-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{content.rating} Instructor Rating</span>
                        </div>
                      )}
                      <p className="text-gray-400 mt-2">
                        {content.excerpt || `Professional ${content.contentType} creator`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Content */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold text-white mb-4">Related Content</h2>
                <div className="space-y-4">
                  {relatedContent.map((item) => (
                    <motion.a
                      key={item.id}
                      href={`/content/${item.contentType}/${item.id}`}
                      className="flex gap-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-40 aspect-video rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {item.author || item.photographer}
                        </p>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          {item.contentType === 'video' && (
                            <span>{item.views} views</span>
                          )}
                          {item.contentType === 'course' && (
                            <span>{item.students} students</span>
                          )}
                          {item.contentType === 'article' && (
                            <span>{item.readTime}</span>
                          )}
                          {item.contentType === 'image' && (
                            <span>{item.downloads} downloads</span>
                          )}
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