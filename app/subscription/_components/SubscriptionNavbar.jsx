"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { UserButton } from "@clerk/nextjs"
import Link from 'next/link'

function SubscriptionNavbar() {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-gray-900 border-b border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
        {/* Left side - Logo */}
        <Link href="/home">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer"
          >
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Block</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Tube</span>
            </h1>
          </motion.div>
        </Link>

        {/* Right side - Clerk Profile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <UserButton afterSignOutUrl="/" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SubscriptionNavbar 