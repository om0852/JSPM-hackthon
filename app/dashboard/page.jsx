'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, DollarSign, FileText, Clock, ThumbsUp, MessageCircle, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stats');
        }

        setStats(data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');

      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'content':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'like':
        return <ThumbsUp className="w-5 h-5 text-red-600" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'content':
        return `New ${activity.contentType} created: "${activity.title}"`;
      case 'like':
        return `Someone liked your ${activity.contentType}: "${activity.title}"`;
      case 'comment':
        return `${activity.userName} commented on your ${activity.contentType}: "${activity.title}"`;
      case 'purchase':
        return `New purchase of ${activity.contentType}: "${activity.title}" for ${formatCurrency(activity.amount)}`;
      default:
        return activity.title;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats?.totalViews.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {formatCurrency(stats?.totalEarnings || 0)}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Content Count</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats?.contentCount || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6 mt-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {[...stats.recentActivity].reverse().map((activity, index) => (
              <motion.div
                key={`${activity.type}-${activity.date}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'content' ? 'bg-blue-100' :
                      activity.type === 'like' ? 'bg-red-100' :
                      activity.type === 'comment' ? 'bg-green-100' :
                      activity.type === 'purchase' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getActivityMessage(activity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
                {activity.type === 'content' && (
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{activity.stats.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{activity.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{activity.stats.comments}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No recent activity
          </div>
        )}
      </motion.div>
    </div>
  );
}
