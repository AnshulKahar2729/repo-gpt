"use client";
import React from "react";
import { motion } from "framer-motion";

export default function MoreSections() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-300">Why Choose Us?</h3>
          <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-200">
            <li>✅ Easy integration with any Next.js project</li>
            <li>✅ Secure and scalable authentication</li>
            <li>✅ Customizable UI and theming</li>
            <li>✅ Great developer experience</li>
            <li>✅ Open source, MIT licensed</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img src="/auth-illustration.svg" alt="Authentication Illustration" className="w-72 h-72 object-contain" />
        </motion.div>
      </div>
    </section>
  );
}
