"use client";
import { useUserStore } from "@/store/user";

export default function ProfilePage() {
  const { user } = useUserStore();

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold text-white">
            {user.name ? user.name[0] : user.email[0]}
          </div>
          <div>
            <div className="font-semibold text-xl">{user.name || user.email}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        </div>
        <div>
          <div className="mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
          <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
          {/* Add more user fields as needed */}
        </div>
      </div>
    </div>
  );
}
