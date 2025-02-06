"use client";

import React,{ useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ThumbsUp, MessageCircle, Crown, Star, Sparkles, Play } from "lucide-react";
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useUser } from '@clerk/nextjs';
import CONTRACT_ABI from './contract.json';
import AllContentGrid from './_components/AllContentGrid';

// Dynamically import components with no SSR
const Sidebar = dynamic(() => import("./_components/Sidebar"), { ssr: false });
const Navbar = dynamic(() => import("./_components/Navbar"), { ssr: false });
const PurchaseConfirmModal = dynamic(() => import('./_components/PurchaseConfirmModal'), { ssr: false });

// Subscription badge configurations
const subscriptionBadges = {
  free: {
    icon: Star,
    text: 'Free',
    className: 'bg-green-900 text-green-200 border border-green-700'
  },
  basic: {
    icon: Sparkles,
    text: 'Basic',
    className: 'bg-blue-900 text-blue-200 border border-blue-700'
  },
  premium: {
    icon: Crown,
    text: 'Premium',
    className: 'bg-purple-900 text-purple-200 border border-purple-700'
  }
};

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load Web3 provider
  const loadProvider = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (provider) {
        // Request account access
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(CONTRACT_ABI,process.env.NEXT_PUBLIC_CONTRACT_ADDRESS );
        setWeb3Api({
          provider,
          web3,
          contract,
        });

        setAccount(accounts[0]);
      } else {
        toast.error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error loading provider:', error);
      toast.error('Error connecting to MetaMask');
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProvider();
  }, []);


  const observer = useRef();
  const lastContentElementRef = useCallback(node => {
    if (loading || !mounted) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, mounted]);

  const fetchContents = useCallback(async (pageNum = 1, shouldAppend = false) => {
    if (!mounted) return;
    try {
      const contentType = selectedFilter === 'All' ? '' : selectedFilter.toLowerCase().slice(0, -1);
      const response = await fetch(
        `/api/content?page=${pageNum}&limit=12${contentType ? `&type=${contentType}` : ''}&filter=published`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contents');
      }

      setContents(prev => shouldAppend ? [...prev, ...data.data] : data.data);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, mounted]);

  // Reset and fetch when filters change
  useEffect(() => {
    if (mounted) {
      setPage(1);
      setContents([]);
      setHasMore(true);
      setLoading(true);
      fetchContents(1, false);
    }
  }, [selectedFilter, fetchContents, mounted]);

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1 && mounted) {
      setLoading(true);
      fetchContents(page, true);
    }
  }, [page, fetchContents, mounted]);

  // Function to handle content click
  const handleContentClick = async (content) => {
    if (!user) {
      toast.error('Please sign in to access content');
      return;
    }

    if (content.subscriptionTier === 'premium' || content.subscriptionTier === 'basic') {
      try {
        // Check if user has already purchased this content
        const response = await fetch(`/api/content/purchase/${content._id}`);
        const data = await response.json();

        if (response.ok && data.hasPurchased) {
          // If already purchased, redirect to content
          router.push(`/content/${content.contentType}/${content._id}`);
        } else {
          // If not purchased, show confirmation modal
          setSelectedContent(content);
          setIsTransactionModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
        toast.error('Error checking purchase status');
      }
    } else {
      // For free content, navigate directly
      router.push(`/content/${content.contentType}/${content._id}`);
    }
  };

  // Update the handlePurchaseConfirm function
  const handlePurchaseConfirm = async (content) => {
    try {
      setIsLoading(true);
      setError(null);

      // Show loading toast
      const loadingToast = toast.loading('Initializing payment...');

      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.dismiss(loadingToast);
        throw new Error('Please install MetaMask to make purchases');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      if (!account) {
        toast.dismiss(loadingToast);
        throw new Error('No account found. Please connect your MetaMask wallet.');
      }

      // Initialize Web3 with the current provider
      const web3 = new Web3(window.ethereum);
      
      // Get contract address from environment variable
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      // Initialize contract instance
      const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
      
      // Verify contract is accessible
      try {
        await contract.methods.owner().call();
      } catch (error) {
        console.error('Contract verification error:', error);
        throw new Error('Unable to connect to payment contract. Please try again later.');
      }

      // Convert price to Wei
      const priceInWei = web3.utils.toWei(content.price.toString(), 'ether');
      console.log('Price in Wei:', priceInWei);
      console.log('Creator wallet:', content.creator?.creatorWallet);

      // Show transaction confirmation toast
      toast.dismiss(loadingToast);
      const transactionToast = toast.loading('Please confirm the transaction in MetaMask...');

      // Send payment transaction
      const tx = await contract.methods
        .makePayment(content.creator.creatorWallet)
        .send({
          from: account,
          value: priceInWei,
        });

      // Update purchase status in database
      const response = await fetch('/api/content/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content._id,
          transactionHash: tx.transactionHash,
          amount: content.price,
          creatorId: content.userId,
          creatorWallet: content.creator?.creatorWallet,
          contentType: content.contentType,
          subscriptionTier: content.subscriptionTier
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record purchase');
      }

      toast.dismiss(transactionToast);
      toast.success('Payment successful!');
      setIsTransactionModalOpen(false);

      // Redirect to content
      router.push(`/content/${content.contentType}/${content._id}`);
    } catch (error) {
      console.error('Transaction error:', error);
      
      if (error.code === 4001) {
        toast.error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds in your wallet');
      } else {
        toast.error(error.message || 'Failed to process payment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    if (loading && page === 1) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-300">Loading contents...</p>
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

    if (contents.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-300 text-lg">
            No {selectedFilter.toLowerCase()} available
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {contents.map((content, index) => (
              <motion.div
                key={content._id}
                ref={index === contents.length - 1 ? lastContentElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleContentClick(content)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-gray-700"
              >
                <div className="relative">
                  <img
                    src={content.thumbnailURL || '/placeholder-image.jpg'}
                    alt={content.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {/* Content Type Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      content.contentType === 'video' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                      content.contentType === 'article' ? 'bg-green-900 text-green-200 border border-green-700' :
                      content.contentType === 'course' ? 'bg-purple-900 text-purple-200 border border-purple-700' :
                      'bg-gray-700 text-gray-200 border border-gray-600'
                    }`}>
                      {content.contentType}
                    </div>
                    {/* Subscription Badge */}
                    {content.subscriptionTier && subscriptionBadges[content.subscriptionTier] && (
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                        subscriptionBadges[content.subscriptionTier].className
                      }`}>
                        {React.createElement(subscriptionBadges[content.subscriptionTier].icon, {
                          className: "w-3 h-3"
                        })}
                        <span>{subscriptionBadges[content.subscriptionTier].text}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  {content.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{content.duration}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400">
                    {content.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{content.commentsCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{content.likesCount || 0}</span>
                      </div>
                    </div>
                    {content.price > 0 && (
                      <div className="text-white font-semibold">
                        ${content.price}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {loading && page > 1 && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-300">Loading more...</p>
          </div>
        )}

        {!loading && !hasMore && contents.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-300">No more contents to load</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar key="navbar" selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <div className="flex pt-32">
        <div className="w-64 flex-shrink-0 fixed left-0 top-32 bottom-0">
          <Sidebar key="sidebar" />
        </div>
        <div className="pl-64 w-full">
          <main className="px-8 pb-8">
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-100">
                {selectedFilter === 'All' ? 'Recommended for you' : `${selectedFilter}`}
              </h2>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      {selectedContent && <PurchaseConfirmModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onConfirm={handlePurchaseConfirm}
        content={selectedContent}
      />}
    </div>
  );
}

