"use client";
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Type Safe",
    desc: "End-to-end type safety with TypeScript, Prisma, and strict API responses.",
    icon: "🛡️",
  },
  {
    title: "Modern Auth",
    desc: "Supports OAuth (Google) and password login with JWT, all via NextAuth.",
    icon: "🔐",
  },
  {
    title: "Protected Routes",
    desc: "Route middleware ensures only authenticated users access sensitive pages.",
    icon: "🚧",
  },
  {
    title: "Beautiful UI",
    desc: "Built with TailwindCSS and shadcn/ui, customizable and accessible.",
    icon: "✨",
  },
  {
    title: "Dark Mode",
    desc: "Seamless light/dark theme switching for better UX.",
    icon: "🌙",
  },
  {
    title: "Production Ready",
    desc: "Battle-tested stack, ready for your next SaaS or project.",
    icon: "🚀",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background dark:bg-gray-950">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl shadow border bg-white dark:bg-gray-900 flex flex-col items-center"
          >
            <span className="text-4xl mb-3">{f.icon}</span>
            <h2 className="font-semibold text-xl mb-2 text-primary-700 dark:text-primary-300">{f.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
