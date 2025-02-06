'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, BarChart2, ArrowUp, ArrowDown, Eye, ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({
    today: 0,
    yesterday: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    lastYear: 0
  });
  const [contentEarnings, setContentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/earnings');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to fetch earnings data'
        }));
        throw new Error(errorData.message || 'Failed to fetch earnings');
      }

      const data = await response.json().catch(() => {
        throw new Error('Invalid response format');
      });

      if (data.status === 'error') {
        throw new Error(data.message || 'Error fetching earnings');
      }

      setEarnings(data.earnings);
      setContentEarnings(data.contentEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Calculate total earnings
  const totalEarnings = contentEarnings.reduce((sum, content) => sum + content.totalEarnings, 0);

  return (
    <div className="space-y-8 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Earnings Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Lifetime earnings</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </motion.div>

        {/* Today's Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
              <div className="flex items-center mt-2">
                {calculatePercentageChange(earnings.today, earnings.yesterday) > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${calculatePercentageChange(earnings.today, earnings.yesterday) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(calculatePercentageChange(earnings.today, earnings.yesterday)).toFixed(1)}% vs yesterday
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Total: {formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </motion.div>

        {/* Monthly Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
              <div className="flex items-center mt-2">
                {calculatePercentageChange(earnings.thisMonth, earnings.lastMonth) > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${calculatePercentageChange(earnings.thisMonth, earnings.lastMonth) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(calculatePercentageChange(earnings.thisMonth, earnings.lastMonth)).toFixed(1)}% vs last month
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Total: {formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            <Calendar className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </motion.div>

        {/* Yearly Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Year</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
              <div className="flex items-center mt-2">
                {calculatePercentageChange(earnings.thisYear, earnings.lastYear) > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${calculatePercentageChange(earnings.thisYear, earnings.lastYear) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(calculatePercentageChange(earnings.thisYear, earnings.lastYear)).toFixed(1)}% vs last year
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Total: {formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            <BarChart2 className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* Content Earnings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Content Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentEarnings.map((content) => (
                <tr key={content._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={content.thumbnailURL || '/placeholder.jpg'}
                        alt={content.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500">{content.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {content.contentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(content.totalEarnings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ShoppingCart className="w-4 h-4 mr-1 text-gray-400" />
                      {content.totalPurchases}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Eye className="w-4 h-4 mr-1 text-gray-400" />
                      {content.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      content.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {content.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 