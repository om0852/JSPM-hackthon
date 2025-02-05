'use client';
import { SignUp, useSignUp } from '@clerk/nextjs'
import AnimatedBackground from '../../components/AnimatedBackground'
import { useUserSetup } from '../../hooks/useUserSetup'
import { useEffect } from 'react'

export default function Page() {
  const { 
    metamaskAddress, 
    userType, 
    setUserType, 
    connectMetamask,
    saveUserDetails 
  } = useUserSetup();
  
  const { isLoaded, signUp } = useSignUp();

  // Handle the completion of sign-up
  useEffect(() => {
    if (isLoaded && signUp?.status === 'complete') {
      saveUserDetails(
        signUp.userData?.emailAddress,
        signUp.userData?.username
      ).catch(console.error);
    }
  }, [isLoaded, signUp?.status]);

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <div className="space-y-4 mt-6">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full p-2 rounded border bg-white/50 backdrop-blur-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="creator">Creator</option>
              </select>
              <button
                onClick={connectMetamask}
                className="w-full p-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded hover:opacity-90 transition-opacity"
              >
                {metamaskAddress ? 'MetaMask Connected' : 'Connect MetaMask'}
              </button>
            </div>
          </div>
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-gray-300 hover:bg-white/50 transition-all duration-200',
                formFieldInput: 'backdrop-blur-sm bg-white/50 border-gray-200',
              },
              variables: {
                colorPrimary: '#4f46e5',
              }
            }}
          />
        </div>
      </div>
    </>
  )
}