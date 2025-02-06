"use client";

import { motion } from 'framer-motion';
import { Shield, Users, Target, Zap, Award, Globe, Cpu, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const FloatingBubble = ({ delay }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  
  // Updated gradient combinations with neon-like effects and higher opacity
  const gradients = [
    "from-[#FF00FF]/60 via-[#FF1493]/60 to-[#FF69B4]/60", // Neon Pink
    "from-[#00FF00]/60 via-[#7FFF00]/60 to-[#98FB98]/60", // Neon Green
    "from-[#FF4500]/60 via-[#FF6347]/60 to-[#FF7F50]/60", // Neon Orange
    "from-[#00FFFF]/60 via-[#40E0D0]/60 to-[#48D1CC]/60", // Neon Cyan
    "from-[#FFD700]/60 via-[#FFA500]/60 to-[#FF8C00]/60", // Neon Gold
    "from-[#FF00FF]/60 via-[#9400D3]/60 to-[#8A2BE2]/60", // Neon Purple
    "from-[#00FF7F]/60 via-[#7FFFD4]/60 to-[#40E0D0]/60", // Neon Turquoise
    "from-[#FF0000]/60 via-[#FF4500]/60 to-[#FF6347]/60"  // Neon Red
  ];
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  const randomSize = 16 + Math.random() * 32; // Random size between 4rem and 8rem

  return (
    <motion.div
      initial={{ 
        x: `${randomX}vw`,
        y: "110vh",
        scale: 0.2 + Math.random() * 0.8,
        opacity: 0.3 + Math.random() * 0.5  // Increased opacity range
      }}
      animate={{
        y: "-10vh",
        rotate: 360,
        transition: {
          duration: randomDuration,
          repeat: Infinity,
          ease: "linear",
          delay,
          rotate: {
            duration: randomDuration * 2,
            repeat: Infinity,
            ease: "linear"
          }
        }
      }}
      className={`absolute w-${Math.floor(randomSize)} h-${Math.floor(randomSize)} rounded-full bg-gradient-to-br ${randomGradient} blur-md shadow-lg shadow-current`}
      style={{
        width: `${randomSize}rem`,
        height: `${randomSize}rem`,
        mixBlendMode: 'lighten'
      }}
    />
  );
};

const AnimatedBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    setBubbles(Array.from({ length: 25 }, (_, i) => ({  // Increased to 25 bubbles
      id: i,
      delay: i * 1  // Reduced delay for more continuous flow
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[100px]" /> {/* Added subtle blur effect */}
      {bubbles.map((bubble) => (
        <FloatingBubble key={bubble.id} delay={bubble.delay} />
      ))}
    </div>
  );
};

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with blockchain verification"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners worldwide"
    },
    {
      icon: Target,
      title: "Focused Learning",
      description: "Personalized learning paths"
    },
    {
      icon: Award,
      title: "Certified Content",
      description: "Expert-verified courses and materials"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1000+", label: "Course Hours" },
    { number: "200+", label: "Expert Instructors" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[400px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/about-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px)'
          }}
        />
        {/* Multiple Pulse Animations with different colors */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ 
            scale: [1.2, 0.8, 1.2],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ 
            scale: [0.9, 1.3, 0.9],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
          >
            Revolutionizing Education Through Blockchain
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl"
          >
            BlockTube is transforming the way people learn by combining cutting-edge blockchain technology with expert-led educational content.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl text-center"
            >
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
              >
                {stat.number}
              </motion.h3>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                BlockTube is dedicated to revolutionizing online learning through blockchain technology. 
                We believe in creating a secure, transparent, and accessible platform where knowledge meets innovation.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <Cpu className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-300">Blockchain Powered</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <Lock className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-300">Secure Learning</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl"
              >
                <div className="p-3 bg-red-500/10 rounded-full w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Vision Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 bg-gradient-to-b from-gray-800 to-gray-900 py-16 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Our Vision
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We envision a future where education is borderless, verifiable, and accessible to everyone. 
              Through blockchain technology, we're building a trustless ecosystem for learning and skill verification 
              that empowers individuals to achieve their full potential.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-medium cursor-pointer"
            >
              <Globe className="w-5 h-5 mr-2" />
              Join Our Global Community
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
