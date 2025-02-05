'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function VerificationCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      // Skip verification check on sign-in and sign-up pages
      if (pathname === '/sign-in' || pathname === '/sign-up') {
        setIsChecking(false);
        return;
      }

      if (!isLoaded || !user) {
        setIsChecking(false);
        return;
      }

      // Check cookie first
      const isVerified = Cookies.get('isVerified');
      const userType = Cookies.get('userType');

      // If we're on the verify page
      if (pathname === '/verify') {
        if (isVerified === 'true') {
          console.log('User is verified (from cookie), redirecting from verify page...');
          window.location.href = '/home';
          return;
        }
        setIsChecking(false);
        return;
      }

      // If we have cookie verification, no need to check API
      if (isVerified === 'true') {
        console.log('User is verified (from cookie)');
        setIsChecking(false);
        return;
      }

      try {
        console.log('Checking verification status with API...');
        const response = await fetch('/api/verify');
        const data = await response.json();
        console.log('Verification response:', data);

        if (response.ok) {
          if (data.data.isVerified) {
            console.log('User is verified, redirecting to home...');
            toast.success('Welcome back!');
            window.location.href = '/home';
          } else {
            console.log('User is not verified, redirecting to verify...');
            toast('Please complete verification', {
              icon: '👋',
              duration: 4000
            });
            window.location.href = '/verify';
          }
        } else {
          throw new Error(data.message || 'Failed to check verification status');
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        toast.error('Error checking verification status');
        window.location.href = '/verify';
      } finally {
        setIsChecking(false);
      }
    };

    checkVerification();
  }, [isLoaded, user, pathname]);

  if (isChecking) {
    console.log('Still checking verification...');
    return null;
  }

  return null;
} 