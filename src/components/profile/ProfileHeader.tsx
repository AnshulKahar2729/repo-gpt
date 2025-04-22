"use client";
import React from "react";
import { motion } from "framer-motion";
import { User } from "@/store/user";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl md:text-5xl font-bold text-white">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          
          {/* Edit button */}
          <button 
            className="absolute bottom-0 right-0 bg-gray-100 dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Edit profile picture"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {user.name || 'Anonymous User'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">12</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">48</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Analyses</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">156</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Commits</div>
            </div>
          </div>
        </div>
        
        <div className="ml-auto hidden md:block">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
