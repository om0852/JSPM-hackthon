"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard,
  LogOut,
  Info,
  Mail
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: CreditCard,
      label: "Manage Your Subscription",
      href: "/subscription",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: Info,
      label: "About",
      href: "/about",
    },
    {
      icon: Mail,
      label: "Contact",
      href: "/contact",
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white relative">
      

      {/* Menu Section */}
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`
                text-sm group flex p-3 w-full justify-start font-medium cursor-pointer
                rounded-lg transition-all duration-200 ease-in-out
                ${pathname === route.href 
                  ? 'bg-gray-800/50 backdrop-blur-sm shadow-lg text-white' 
                  : 'text-gray-400 hover:bg-gray-800/30'
                }
                hover:translate-x-1
                hover:shadow-md
              `}
            >
              <div className="flex items-center flex-1 relative">
                <div className="relative">
                  <route.icon className={`h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    pathname === route.href ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {pathname === route.href && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
                  )}
                </div>
                <span>{route.label}</span>
                {pathname === route.href && (
                  <div className="absolute left-0 -ml-[12px] h-full w-[3px] bg-gradient-to-b from-blue-500 to-purple-500 rounded-r" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="px-3 py-4 border-t border-gray-800/50 mt-auto">
        <button
          onClick={handleSignOut}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer 
            rounded-lg transition-all duration-200 ease-in-out
            text-gray-400 hover:bg-red-500/10 hover:text-red-500
            hover:translate-x-1 hover:shadow-md"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
            <span>Logout</span>
          </div>
        </button>
      </div>

      {/* Version or Additional Info */}
      <div className="px-6 py-2 text-xs text-gray-500">
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
