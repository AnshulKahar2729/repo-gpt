"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-secondary-900 opacity-90"></div>
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-500 rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Repository Experience?
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Join thousands of developers who are already using RepoGPT to analyze, optimize, and document their code. Get started for free today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-900 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => router.push('/signup')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => router.push('/login')}
            >
              Schedule Demo
            </Button>
          </div>
          
          <p className="mt-8 text-gray-300 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
