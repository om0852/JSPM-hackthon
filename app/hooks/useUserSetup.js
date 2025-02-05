'use client';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export const useUserSetup = () => {
  const [metamaskAddress, setMetamaskAddress] = useState('');
  const [userType, setUserType] = useState('viewer');
  const { userId } = useAuth();

  const connectMetamask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setMetamaskAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const saveUserDetails = async (email, username) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          metamaskAddress,
          userType
        })
      });

      if (!response.ok) throw new Error('Failed to save user details');
      return await response.json();
    } catch (error) {
      console.error('Error saving user details:', error);
      throw error;
    }
  };

  return {
    metamaskAddress,
    userType,
    setUserType,
    connectMetamask,
    saveUserDetails
  };
}; 