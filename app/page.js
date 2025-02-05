import ProtectedLayout from "./protected-layout";
// import HomeContent from "./home-content"; 
export default function Home() {
  return (
    <ProtectedLayout>
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold p-4 bg-red-300 rounded-lg shadow-md">Home</h2>
      </div>
    </ProtectedLayout>
  );
}
