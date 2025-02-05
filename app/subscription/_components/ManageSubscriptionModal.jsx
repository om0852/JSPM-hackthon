"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CreditCard, AlertTriangle } from 'lucide-react';

export default function ManageSubscriptionModal({ isOpen, onClose, content }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState('1');

  useEffect(() => {
    if (!isOpen) {
      setShowCancelConfirm(false);
      setSelectedExtension('1');
    }
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const extensionOptions = [
    { value: '1', label: '1 Month', price: content.cost },
    { value: '6', label: '6 Months', price: `$${(parseFloat(content.cost.replace('$', '').replace('/month', '')) * 5.5).toFixed(2)}` },
    { value: '12', label: '12 Months', price: `$${(parseFloat(content.cost.replace('$', '').replace('/month', '')) * 10).toFixed(2)}` }
  ];

  const handleExtendSubscription = () => {
    // Handle subscription extension logic here
    console.log(`Extending subscription for ${selectedExtension} months`);
    onClose();
  };

  const handleCancelSubscription = () => {
    // Handle subscription cancellation logic here
    console.log('Cancelling subscription');
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Manage Subscription</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Subscription Info */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{content.title}</h3>
                    <p className="text-gray-400">{content.provider}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                    <p className="text-white font-semibold">{content.cost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Renewal Date</p>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(content.renewalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extend Subscription */}
              {!showCancelConfirm && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Extend Subscription</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {extensionOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedExtension(option.value)}
                        className={`p-4 rounded-lg border ${
                          selectedExtension === option.value
                            ? 'border-red-500 bg-red-500 bg-opacity-10'
                            : 'border-gray-700 hover:border-gray-600'
                        } transition-colors`}
                      >
                        <p className="text-white font-semibold mb-1">{option.label}</p>
                        <p className="text-sm text-gray-400">{option.price}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleExtendSubscription}
                    className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Extend Subscription
                  </button>
                </div>
              )}

              {/* Cancel Subscription */}
              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Cancel Subscription
                </button>
              ) : (
                <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Cancel Subscription?</h4>
                      <p className="text-sm text-gray-400">
                        Are you sure you want to cancel your subscription? You'll lose access to this content at the end of your current billing period.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelSubscription}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Yes, Cancel Subscription
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      Keep Subscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 