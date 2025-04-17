import React from "react";
import { useUserStore } from "@/store/user";

export default function DashboardHeader() {
  const { user } = useUserStore();
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-primary-600">MyApp</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-lg font-bold text-white">
          {user?.name ? user.name[0] : user?.email[0]}
        </div>
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{user?.name || user?.email}</span>
      </div>
    </div>
  );
}
