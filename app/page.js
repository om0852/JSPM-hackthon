import ProtectedLayout from "./protected-layout";
import AnimatedBackground from "./components/AnimatedBackground";
// import HomeContent from "./home-content"; 
export default function Home() {
  return (
    <ProtectedLayout>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-4xl w-full transform transition-all hover:scale-[1.01]">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 animate-fade-in">
            Your secure and personalized space awaits.
          </p>
        </div>
      </div>
    </ProtectedLayout>
  );
}
