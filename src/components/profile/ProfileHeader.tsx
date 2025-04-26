"use client";
import React from "react";
import { motion } from "framer-motion";
import { User } from "@/store/user";
import { Camera, Edit, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          {/* Avatar */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-md">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          
          {/* Edit button */}
          <button 
            className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2.5 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
            aria-label="Edit profile picture"
          >
            <Camera size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex gap-3 justify-center md:justify-start mb-4">
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">12</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">48</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Analyses</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="text-xl font-semibold text-gray-900 dark:text-white">156</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Commits</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
