'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { LogOut, Bug, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Bubble component for background animation
const Bubble = ({ delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [1, 2, 2, 1],
      opacity: [0.5, 0.2, 0.2, 0],
      y: [-50, -100],
      x: [0, Math.random() * 100 - 50]
    }}
    transition={{ 
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 w-12 h-12"
    style={{
      left: `${Math.random() * 100}%`,
      bottom: '-20px'
    }}
  />
);

export default function SettingsPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleReportBug = async () => {
    setIsSubmitting(true);
    try {
      // Add your bug report logic here
      toast.success('Bug report submitted successfully');
    } catch (error) {
      toast.error('Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedback = async () => {
    setIsSubmitting(true);
    try {
      // Add your feedback submission logic here
      toast.success('Feedback submitted successfully');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate bubbles for background animation
  const bubbles = Array.from({ length: 10 }, (_, i) => (
    <Bubble key={i} delay={i * 0.5} />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated background bubbles */}
      <div className="fixed inset-0 pointer-events-none">
        {bubbles}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <SettingsIcon className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logout Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 rounded-full">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sign Out</h3>
              <p className="text-gray-500">Securely sign out from your account</p>
              <button
                onClick={handleSignOut}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Report Bug Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Bug className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Report Bug</h3>
              <p className="text-gray-500">Help us improve by reporting issues</p>
              <button
                onClick={handleReportBug}
                disabled={isSubmitting}
                className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                Report Bug
              </button>
            </div>
          </motion.div>

          {/* Feedback Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200 md:col-span-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Send Feedback</h3>
              <p className="text-gray-500">Share your thoughts and suggestions with us</p>
              <button
                onClick={handleFeedback}
                disabled={isSubmitting}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Send Feedback
              </button>
            </div>
          </motion.div>
        </div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          <p>Version 1.0.0</p>
          <p>© 2024 DecentralHub. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
} 