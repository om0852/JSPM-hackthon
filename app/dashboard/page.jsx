'use client';
import { auth } from '@clerk/nextjs';

export default async function DashboardPage() {


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">0</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">$0.00</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Content Count</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-center py-8">
          No recent activity
        </div>
      </div>
    </div>
  );
}
