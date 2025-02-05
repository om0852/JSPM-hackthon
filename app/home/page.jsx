import Sidebar from "./_components/Sidebar";

export default function Home() {
  return (
    <div className="h-screen flex">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
        {/* Your main content will go here */}
      </main>
    </div>
  );
}
