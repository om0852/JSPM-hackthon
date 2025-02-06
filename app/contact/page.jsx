"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';
import styled from 'styled-components';

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
        opacity: 0.3 + Math.random() * 0.5
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
    setBubbles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      delay: i * 1
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[100px]" />
      {bubbles.map((bubble) => (
        <FloatingBubble key={bubble.id} delay={bubble.delay} />
      ))}
    </div>
  );
};

const StyledInput = styled.input`
  &:focus ~ label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #ef4444;
  }
  &:not(:placeholder-shown) ~ label {
    transform: translateY(-1.5rem) scale(0.85);
  }
`;

const StyledTextArea = styled.textarea`
  &:focus ~ label {
    transform: translateY(-1.5rem) scale(0.85);
    color: #ef4444;
  }
  &:not(:placeholder-shown) ~ label {
    transform: translateY(-1.5rem) scale(0.85);
  }
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[300px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/contact-bg.jpg")',
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
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300"
          >
            We'd love to hear from you
          </motion.p>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Mail className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg">hado90@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Phone className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-lg">+91 78238 86059</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                >
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <MapPin className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-lg">Sector 29, Nigdi Pradhikaran, Pimpri-Chinchwad, near Akurdi Railway Station, Pune, Maharashtra 411044</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gray-700/30 rounded-lg text-center"
                >
                  <Clock className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">24/7 Support</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gray-700/30 rounded-lg text-center"
                >
                  <MessageCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Live Chat</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gray-700/30 rounded-lg text-center"
                >
                  <Globe className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Global</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <StyledInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white transition-all duration-200"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
                    Your Name
                  </label>
                </div>

                <div className="relative">
                  <StyledInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white transition-all duration-200"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
                    Your Email
                  </label>
                </div>

                <div className="relative">
                  <StyledInput
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white transition-all duration-200"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
                    Subject
                  </label>
                </div>

                <div className="relative">
                  <StyledTextArea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder=" "
                    rows="4"
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white transition-all duration-200"
                  />
                  <label className="absolute left-4 top-3 text-gray-400 transition-all duration-200 pointer-events-none">
                    Your Message
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 