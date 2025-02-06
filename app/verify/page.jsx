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
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

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
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
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
    try {
      setVerifying(true);
      setError('');

      // Get current user info
      const userInfo = {
        walletAddress: account,
        userType,
        name: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user?.username || 'Anonymous',
        image: user?.imageUrl || '',
        email: user?.emailAddresses?.[0]?.emailAddress || ''
      };

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Store user information in localStorage
      localStorage.setItem('userWallet', account);
      localStorage.setItem('userName', userInfo.name);
      localStorage.setItem('userImage', userInfo.image);
      localStorage.setItem('userEmail', userInfo.email);
      localStorage.setItem('userType', userType);

      toast.success('Verification successful!');
      router.push('/home');

    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Failed to verify wallet');
      toast.error(error.message || 'Verification failed');
    } finally {
      setVerifying(false);
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