"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EnhancedHeroSection() {
  const router = useRouter();
  
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[80vh] py-16 px-6 md:px-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Left content */}
      <div className="z-10 w-full md:w-1/2 text-left md:pr-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              RepoGPT
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">
              AI-Powered Repository Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-xl">
            Transform your coding workflow with intelligent repository management. 
            Analyze, organize, and optimize your projects with AI assistance.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl bg-primary-600 hover:bg-primary-700 transition-all"
              onClick={() => router.push('/login')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              onClick={() => router.push('/signup')}
            >
              Sign Up Free
            </Button>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-primary-${i*100} flex items-center justify-center text-white font-bold`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold">1,000+</span> developers trust RepoGPT
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Right content - illustration */}
      <motion.div 
        className="w-full md:w-1/2 mt-12 md:mt-0 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="relative w-full h-[400px] md:h-[500px]">
          {/* This would be better with an actual image, but using a placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 p-6">
              <div className="bg-white dark:bg-gray-800 h-full w-full rounded-lg shadow-inner overflow-hidden">
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-sm text-gray-600 dark:text-gray-300 font-mono">repository-analysis.js</div>
                </div>
                <div className="p-4 font-mono text-sm text-gray-700 dark:text-gray-300">
                  <div className="text-blue-600 dark:text-blue-400">{/* // RepoGPT analyzing repository structure */}</div>
                  <div className="mt-2"><span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-green-600 dark:text-green-400">analysis</span> = <span className="text-purple-600 dark:text-purple-400">await</span> repoGPT.analyze(repository);</div>
                  <div className="mt-2"><span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-green-600 dark:text-green-400">insights</span> = analysis.getInsights();</div>
                  <div className="mt-2"><span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-green-600 dark:text-green-400">optimizations</span> = analysis.suggestOptimizations();</div>
                  <div className="mt-4 text-blue-600 dark:text-blue-400">{/* // Generate documentation */}</div>
                  <div className="mt-2"><span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-green-600 dark:text-green-400">docs</span> = <span className="text-purple-600 dark:text-purple-400">await</span> repoGPT.generateDocs(repository);</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl z-0"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute -bottom-32 right-10 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl z-0"
        animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-300 rounded-full opacity-10 blur-3xl z-0"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />
    </section>
  );
}
