import { SignIn } from '@clerk/nextjs'
import AnimatedBackground from "../../components/AnimatedBackground"
export default function Page() {
  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2 animate-fade-in">
              Sign in to continue your journey
            </p>
          </div>
          <SignIn 
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
  );
}