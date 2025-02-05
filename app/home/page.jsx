"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";
import AllContentGrid from "./_components/AllContentGrid";
import VideoGrid from "./_components/VideoGrid";
import CourseGrid from "./_components/CourseGrid";
import ArticlesGrid from "./_components/ArticlesGrid";
import ImagesGrid from "./_components/ImagesGrid";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const renderContent = () => {
    switch (selectedFilter) {
      case 'Articles':
        return <ArticlesGrid />;
      case 'Images':
        return <ImagesGrid />;
      case 'Videos':
        return <VideoGrid />;
      case 'Courses':
        return <CourseGrid />;
      case 'All':
      default:
        return <AllContentGrid filter={selectedFilter} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      <div className="flex pt-32">
        <div className="w-64 flex-shrink-0 fixed left-0 top-32 bottom-0">
          <Sidebar />
        </div>
        <div className="pl-64 w-full">
          <main className="px-8 pb-8">
            {/* Main Content */}
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-100">
                {selectedFilter === 'All' ? 'Recommended for you' : `${selectedFilter}`}
              </h2>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
