'use client';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#18181b',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 