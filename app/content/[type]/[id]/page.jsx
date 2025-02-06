"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ThumbsUp, 
  Share2, 
  Download, 
  Clock, 
  Users,
  Star,
  MessageCircle
} from 'lucide-react';
import Sidebar from '../../../home/_components/Sidebar';
import ContentNavbar from '../../_components/ContentNavbar';
import { useParams, useRouter } from 'next/navigation';
import CourseContent from '../../course/_components/CourseContent';
import { useUser } from '@clerk/nextjs';
import toast, { Toaster } from 'react-hot-toast';
import ArticleView from '../../article/_components/ArticleView';
import ImageView from '../../image/_components/ImageView';
import Comments from '../../_components/Comments';
import PurchaseConfirmModal from '../../../home/_components/PurchaseConfirmModal';
import Web3 from 'web3';
import CONTRACT_ABI from '../../../home/contract.json';

export default function ContentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Check if user has purchased the content
  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/content/purchase/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setHasPurchased(data.hasPurchased);
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

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

      // Check purchase status if content is not free
      if (contentWithType.subscriptionTier !== 'free' && user) {
        checkPurchaseStatus();
      }

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

    try {
      const response = await fetch(`/api/content/${content._id}/like`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process like');
      }

      setContent(prev => ({
        ...prev,
        likesCount: data.likesCount,
        isLiked: data.isLiked
      }));

      toast.success(data.message);
    } catch (error) {
      console.error('Error liking content:', error);
      toast.error('Failed to process like');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #4B5563',
        },
        duration: 2000,
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link', {
        icon: '❌',
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #4B5563',
        },
      });
    }
  };

  const handlePurchaseConfirm = async (content) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Initializing payment...');

      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.dismiss(loadingToast);
        throw new Error('Please install MetaMask to make purchases');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);

      // Get the contract
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

      // Get user's wallet address
      const accounts = await web3.eth.getAccounts();
      const userWallet = accounts[0];

      // Convert price to wei (assuming price is in ETH)
      const priceInWei = web3.utils.toWei(content.price.toString(), 'ether');

      // Make the payment
      const transaction = await contract.methods.makePayment(content.creator.creatorWallet)
        .send({
          from: userWallet,
          value: priceInWei
        });

      // Record the purchase in the database
      const purchaseResponse = await fetch('/api/content/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content._id,
          transactionHash: transaction.transactionHash,
          amount: content.price,
          creatorId: content.userId,
          creatorWallet: content.creator.creatorWallet,
          contentType: content.contentType,
          subscriptionTier: content.subscriptionTier
        }),
      });

      const purchaseData = await purchaseResponse.json();

      if (!purchaseResponse.ok) {
        throw new Error(purchaseData.message || 'Failed to record purchase');
      }

      // Update purchase status
      setHasPurchased(true);
      setIsTransactionModalOpen(false);
      toast.dismiss(loadingToast);
      toast.success('Purchase successful!');

    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Failed to process payment');
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

  const renderContent = () => {
    if (!content) return null;

    // If content is free or user has purchased it, show the content
    if (content.subscriptionTier === 'free' || hasPurchased) {
      if (content.contentType === 'article') {
        return <ArticleView article={content} />;
      } else if (content.contentType === 'image') {
        return <ImageView image={content} />;
      } else {
        return (
          <>
            {/* Content Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
              <img
                src={content.thumbnailURL || '/placeholder-image.jpg'}
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
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      content.isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    } transition-colors`}
                    disabled={!user}
                  >
                    <ThumbsUp className={`w-4 h-4 ${content.isLiked ? 'fill-current' : ''}`} />
                    <span>{content.likesCount || 0}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
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
        );
      }
    } else {
      // Show purchase prompt if not purchased
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Premium Content</h2>
          <p className="text-gray-300 mb-6 text-center">
            This content requires a purchase to access. Price: ${content.price}
          </p>
          {user ? (
            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Purchase Now
            </button>
          ) : (
            <p className="text-gray-400">Please sign in to purchase this content</p>
          )}
        </div>
      );
    }
  };

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
                {renderContent()}
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

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onConfirm={handlePurchaseConfirm}
        content={content}
      />
    </div>
  );
} 