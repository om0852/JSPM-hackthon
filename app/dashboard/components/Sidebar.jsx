'use client';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { 
  LayoutDashboard,
  Film,
  DollarSign,
  UserCircle,
  Settings,
  Youtube,
  Home,
  Info,
  Mail
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: 'Home', icon:Home, path: '/home' },
    { name: 'Content', icon: Film, path: '/dashboard/content' },
    { name: 'Earnings', icon: DollarSign, path: '/dashboard/earnings' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { name: 'About', icon: Info, path: '/about' },
    { name: 'Contact', icon: Mail, path: '/contact' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-4">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Link href="/dashboard">
        <div className="mb-8 flex items-center space-x-2">
          <Youtube className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BlockTube
          </h1>
        </div>
        </Link>

        {/* Menu Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  <span className="text-gray-700 group-hover:text-purple-600 transition-colors">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center space-x-3 px-4">
            <UserButton afterSignOutUrl="/sign-in" />
            <span className="text-sm text-gray-700">Your Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 