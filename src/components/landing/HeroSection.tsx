"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-24 text-center bg-gradient-to-b from-primary-50 to-white overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
      >
        Secure. Modern. Auth.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-2xl md:text-3xl mb-10 text-gray-700 dark:text-gray-200 max-w-2xl mx-auto"
      >
        Effortless authentication for your Next.js app. JWT, OAuth, protected routes, and beautiful UI.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="flex gap-6 justify-center"
      >
        <Button size="lg" onClick={() => router.push('/login')}>Get Started</Button>
        <Button size="lg" variant="outline" onClick={() => router.push('/signup')}>Sign Up</Button>
      </motion.div>
      {/* Animated background shapes */}
      <motion.div
        className="absolute -top-10 -left-10 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-2xl z-0"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute -bottom-16 right-0 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-2xl z-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />
    </section>
  );
}
