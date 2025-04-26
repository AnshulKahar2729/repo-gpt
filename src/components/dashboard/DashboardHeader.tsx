import React from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardHeader() {
  const { user, clearUser } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    clearUser();
    // remove the token from localStorage
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-primary-600">Repo GPT</span>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-lg font-bold text-white ml-2">
          {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
        </div>
      </div>
    </div>
  );
}
