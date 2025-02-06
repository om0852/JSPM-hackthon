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
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Menu
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-gray-800 rounded-lg transition ${
                route.className || ''
              } ${
                pathname === route.href ? "text-white bg-gray-800" : route.className ? "" : "text-zinc-400"
              }`}
            >
              <div className="flex items-center flex-1">
                <route.icon className={`h-5 w-5 mr-3 ${route.className ? 'text-white' : ''}`} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-gray-800 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
