"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Star, Clock, Users, BookOpen, Video, Image } from 'lucide-react';
import Sidebar from '../home/_components/Sidebar';
import SubscriptionNavbar from './_components/SubscriptionNavbar';
import TransactionConfirmModal from './_components/TransactionConfirmModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Web3 from 'web3';

const getContentIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'course':
      return BookOpen;
    case 'video':
      return Video;
    case 'image':
      return Image;
    default:
      return Star;
  }
};

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch subscriptions');
        }

        setSubscriptions(data.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        toast.error('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchSubscriptions();
    }
  }, [isLoaded, user]);

  const totalMonthlyCost = subscriptions
    .reduce((sum, item) => sum + parseFloat(item.cost.replace('$', '').replace('/month', '')), 0)
    .toFixed(2);

  const handleContentClick = (content) => {
    if (content.tier === 'premium' || content.tier === 'basic') {
      setSelectedContent(content);
      setIsTransactionModalOpen(true);
    } else {
      // For free content, navigate directly
      router.push(`/content/${content.type}/${content.id}`);
    }
  };

  const handleTransactionConfirm = async (content) => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to make purchases');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      if (!account) {
        throw new Error('No account found. Please connect your MetaMask wallet.');
      }

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      
      // Get contract address
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      // Get contract ABI
      const contractABI = require('../home/contract.json');
      
      // Initialize contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Convert price to Wei
      const priceInWei = web3.utils.toWei(content.cost.replace('$', '').replace('/month', ''), 'ether');

      // Show transaction confirmation toast
      const transactionToast = toast.loading('Please confirm the transaction in MetaMask...');

      // Send payment transaction
      const tx = await contract.methods
        .makePayment(content.creatorWallet)
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
          contentId: content.id,
          transactionHash: tx.transactionHash,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record purchase');
      }

      toast.dismiss(transactionToast);
      toast.success('Payment successful!');
      setIsTransactionModalOpen(false);

      // Redirect to content
      router.push(`/content/${content.type}/${content.id}`);
    } catch (error) {
      console.error('Transaction error:', error);
      
      if (error.code === 4001) {
        toast.error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds in your wallet');
      } else {
        toast.error(error.message || 'Failed to process payment');
      }
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
        <p className="ml-2 text-gray-300">Loading subscriptions...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SubscriptionNavbar />
      <div className="flex pt-20">
        <div className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0">
          <Sidebar />
        </div>
        <div className="pl-64 w-full">
          <main className="px-8 pb-8">
            <div className="max-w-6xl">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold mb-2 text-white">Your Subscriptions</h1>
                <p className="text-gray-400">View your content subscriptions and purchases</p>
              </motion.div>

              {/* Subscription Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Active Subscriptions</h3>
                    <Users className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">{subscriptions.length}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Total Monthly Cost</h3>
                    <DollarSign className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-white">${totalMonthlyCost}</p>
                </div>
              </motion.div>

              {/* Subscribed Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-xl border border-gray-700"
              >
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Subscribed Content</h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {subscriptions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      No subscriptions found. Purchase some content to get started!
                    </div>
                  ) : (
                    subscriptions.map((content, index) => {
                      const ContentIcon = getContentIcon(content.type);
                      return (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="p-6 flex items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer"
                          onClick={() => handleContentClick(content)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <img 
                                src={content.thumbnail} 
                                alt={content.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 right-0 bg-gray-900 p-1 rounded-tl">
                                <ContentIcon className="w-3 h-3 text-red-500" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold flex items-center gap-2 text-white">
                                {content.title}
                                {content.tier === "premium" && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {content.provider} • {content.totalContent}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Subscription Cost</p>
                              <p className="font-semibold text-red-400">{content.cost}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Renewal Date</p>
                              <p className="font-semibold flex items-center gap-1 text-white">
                                <Clock className="w-4 h-4" />
                                {new Date(content.renewalDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      
      <TransactionConfirmModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onConfirm={handleTransactionConfirm}
        content={selectedContent}
      />
    </div>
  );
} 