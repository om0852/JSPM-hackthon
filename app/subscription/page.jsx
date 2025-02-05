"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Star, Clock, Users, BookOpen, Video, Image } from 'lucide-react';
import Sidebar from '../home/_components/Sidebar';
import SubscriptionNavbar from './_components/SubscriptionNavbar';
import ManageSubscriptionModal from './_components/ManageSubscriptionModal';

const subscribedContent = [
  {
    id: 1,
    title: "Advanced Web Development Course 2024",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    provider: "Tech Masters Pro",
    subscriptionDate: "2024-01-15",
    renewalDate: "2025-01-15",
    tier: "Premium",
    cost: "$14.99/month",
    type: "Course",
    totalContent: "45 lessons"
  },
  {
    id: 2,
    title: "Premium Tech Articles Bundle",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    provider: "TechInsights+",
    subscriptionDate: "2024-02-01",
    renewalDate: "2025-02-01",
    tier: "Pro",
    cost: "$9.99/month",
    type: "Article",
    totalContent: "100+ articles"
  },
  {
    id: 3,
    title: "Professional Photography Collection",
    thumbnail: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5",
    provider: "VisualArts Pro",
    subscriptionDate: "2024-01-20",
    renewalDate: "2025-01-20",
    tier: "Premium",
    cost: "$12.99/month",
    type: "Image",
    totalContent: "500+ images"
  },
  {
    id: 4,
    title: "Video Tutorials Premium Access",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279",
    provider: "VideoEdu Plus",
    subscriptionDate: "2024-02-15",
    renewalDate: "2025-02-15",
    tier: "Premium",
    cost: "$19.99/month",
    type: "Video",
    totalContent: "200+ videos"
  }
];

const getContentIcon = (type) => {
  switch (type) {
    case 'Course':
      return BookOpen;
    case 'Video':
      return Video;
    case 'Image':
      return Image;
    default:
      return Star;
  }
};

export default function SubscriptionPage() {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalMonthlyCost = subscribedContent
    .reduce((sum, item) => sum + parseFloat(item.cost.replace('$', '').replace('/month', '')), 0)
    .toFixed(2);

  const handleManageClick = (content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

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
                <h1 className="text-3xl font-bold mb-2 text-white">Manage Your Subscriptions</h1>
                <p className="text-gray-400">View and manage your content subscriptions</p>
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
                  <p className="text-3xl font-bold text-white">{subscribedContent.length}</p>
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
                  {subscribedContent.map((content, index) => {
                    const ContentIcon = getContentIcon(content.type);
                    return (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-6 flex items-center justify-between hover:bg-gray-750 transition-colors"
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
                              {content.tier === "Premium" && (
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
                          <button 
                            onClick={() => handleManageClick(content)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Manage
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <ManageSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={selectedContent}
      />
    </div>
  );
} 