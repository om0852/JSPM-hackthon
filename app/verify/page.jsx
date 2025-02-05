'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, User, PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function VerifyPage() {
  const [account, setAccount] = useState('');
  const [userType, setUserType] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check verification status on load
  useEffect(() => {
    const checkVerification = async () => {
      // Check cookie first
      const isVerified = Cookies.get('isVerified');
      if (isVerified === 'true') {
        console.log('User is verified (from cookie), redirecting...');
        toast.success('Already verified! Redirecting...');
        window.location.href = '/home';
        return;
      }

      try {
        console.log('Checking initial verification status...');
        const response = await fetch('/api/verify');
        const data = await response.json();
        console.log('Initial verification response:', data);

        if (response.ok && data.data.isVerified) {
          console.log('User is already verified, redirecting...');
          toast.success('Already verified! Redirecting...');
          window.location.href = '/home';
        } else {
          toast('Please complete verification', {
            icon: '👋',
            duration: 4000
          });
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, []);

  // Check if MetaMask is installed
  const checkMetaMaskInstalled = () => {
    if (typeof window.ethereum !== 'undefined') {
      return true;
    }
    return false;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!checkMetaMaskInstalled()) {
      toast.error('Please install MetaMask to continue');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle user type selection and verification
  const handleVerification = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!userType) {
      toast.error('Please select a user type');
      return;
    }

    const verifyToast = toast.loading('Verifying your account...');

    try {
      console.log('Submitting verification...');
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          userType: userType
        }),
      });

      const data = await response.json();
      console.log('Verification submission response:', data);

      if (response.ok) {
        toast.success('Verification successful! Redirecting...', {
          id: verifyToast,
          duration: 2000
        });
        // Use timeout to ensure toast is shown before redirect
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error(error.message, { id: verifyToast });
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        if (accounts[0]) {
          toast.success('Wallet account changed');
        } else {
          toast.error('Wallet disconnected');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', setAccount);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6366F1',
              secondary: '#fff',
            },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Verify Your Account</h2>
          <p className="mt-2 text-gray-400">Connect your wallet and choose your role</p>
        </div>

        {/* Wallet Connection */}
        <div className="mt-8">
          <button
            onClick={connectWallet}
            disabled={isConnecting || account}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white ${
              account ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            <Wallet className="w-5 h-5" />
            {account
              ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
              : isConnecting
              ? 'Connecting...'
              : 'Connect MetaMask'}
          </button>
        </div>

        {/* User Type Selection */}
        <div className="mt-8 space-y-4">
          <h3 className="text-white text-lg font-semibold mb-4">Select User Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType('viewer')}
              className={`p-4 rounded-lg border-2 ${
                userType === 'viewer'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              } transition-colors`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-white font-medium">Viewer</p>
              <p className="text-sm text-gray-400 mt-1">Browse and interact with content</p>
            </button>

            <button
              onClick={() => setUserType('creator')}
              className={`p-4 rounded-lg border-2 ${
                userType === 'creator'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              } transition-colors`}
            >
              <PenTool className="w-8 h-8 mx-auto mb-2 text-white" />
              <p className="text-white font-medium">Creator</p>
              <p className="text-sm text-gray-400 mt-1">Create and publish content</p>
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <div className="mt-8">
          <button
            onClick={handleVerification}
            disabled={!account || !userType}
            className={`w-full px-4 py-3 rounded-lg text-white ${
              account && userType
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 cursor-not-allowed'
            } transition-colors`}
          >
            Verify Account
          </button>
        </div>
      </motion.div>
    </div>
  );
} 