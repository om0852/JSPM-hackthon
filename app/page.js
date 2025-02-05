'use client';

import { useState, useEffect } from 'react';
import ProtectedLayout from "./protected-layout";
import AnimatedBackground from "./components/AnimatedBackground";
import VerificationCheck from "./components/VerificationCheck";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Users, Palette } from "lucide-react";
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Secure Content Management",
      description: "Your content is protected with blockchain technology and secure authentication."
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      title: "Fast & Responsive",
      description: "Lightning-fast content delivery and responsive design across all devices."
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Community Driven",
      description: "Connect with creators and viewers in a thriving decentralized community."
    },
    {
      icon: <Palette className="w-6 h-6 text-red-500" />,
      title: "Creative Freedom",
      description: "Express yourself with various content types - articles, images, videos, and courses."
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <ProtectedLayout>
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
      <VerificationCheck />
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-4xl w-full transform hover:shadow-2xl transition-all"
        >
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent"
            >
              Welcome to DecentralHub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Your gateway to decentralized content creation and sharing. Connect your wallet, choose your role, and join our thriving community.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Link href="/home" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">
                Explore Content
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-md">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl max-w-4xl w-full text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">Join our community and start sharing your content today.</p>
          <Link href="/verify" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">
            Connect Wallet
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </ProtectedLayout>
  );
}
