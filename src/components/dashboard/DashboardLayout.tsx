"use client";
import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background dark:bg-gray-950">
      <aside className="sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30">
        <DashboardSidebar />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 w-full">
          <DashboardHeader />
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
