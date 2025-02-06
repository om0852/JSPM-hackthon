"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  MessageSquare, 
  Flag,
  LogOut,
  Moon,
  Sun,
  Globe,
  Lock,
  Mail
} from 'lucide-react';
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

const SettingSection = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl"
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-3 bg-red-500/10 rounded-full">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('english');
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission
    console.log('Feedback submitted');
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // Handle report submission
    console.log('Report submitted');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"
          >
            Settings
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Settings */}
            <SettingSection icon={User} title="Account Settings">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span>Change Password</span>
                  </div>
                  <button className="text-red-500 hover:text-red-400">Update</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>Update Email</span>
                  </div>
                  <button className="text-red-500 hover:text-red-400">Change</button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </SettingSection>

            {/* Preferences */}
            <SettingSection icon={Settings} title="Preferences">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-gray-400" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-red-500' : 'bg-gray-600'
                    } relative`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        darkMode ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span>Notifications</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications ? 'bg-red-500' : 'bg-gray-600'
                    } relative`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        notifications ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span>Language</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-white rounded-lg px-3 py-1 border border-gray-700"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                  </select>
                </div>
              </div>
            </SettingSection>

            {/* Feedback Section */}
            <SettingSection icon={MessageSquare} title="Send Feedback">
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea
                  placeholder="Share your thoughts with us..."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium hover:from-red-600 hover:to-red-700"
                >
                  Submit Feedback
                </motion.button>
              </form>
            </SettingSection>

            {/* Report Section */}
            <SettingSection icon={Flag} title="Report an Issue">
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <select
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                >
                  <option value="">Select Issue Type</option>
                  <option value="bug">Bug Report</option>
                  <option value="content">Content Issue</option>
                  <option value="security">Security Concern</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Describe the issue in detail..."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium hover:from-red-600 hover:to-red-700"
                >
                  Submit Report
                </motion.button>
              </form>
            </SettingSection>
          </div>

          {/* Help & Support */}
          <SettingSection icon={HelpCircle} title="Help & Support">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="#faq"
                className="p-4 bg-gray-700/30 rounded-lg text-center hover:bg-gray-700/50 transition-colors"
              >
                <HelpCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <h3 className="font-medium">FAQs</h3>
                <p className="text-sm text-gray-400">Find quick answers</p>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="#support"
                className="p-4 bg-gray-700/30 rounded-lg text-center hover:bg-gray-700/50 transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <h3 className="font-medium">Support</h3>
                <p className="text-sm text-gray-400">Contact our team</p>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="#security"
                className="p-4 bg-gray-700/30 rounded-lg text-center hover:bg-gray-700/50 transition-colors"
              >
                <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <h3 className="font-medium">Security</h3>
                <p className="text-sm text-gray-400">Privacy & security info</p>
              </motion.a>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
} 