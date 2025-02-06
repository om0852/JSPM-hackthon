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
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
          >
            <motion.h1 
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="text-white"
                whileHover={{ color: '#f87171' }}
                transition={{ duration: 0.2 }}
              >
                Block
              </motion.span>
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                Tube
              </motion.span>
            </motion.h1>
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