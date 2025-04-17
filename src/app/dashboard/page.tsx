"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/utils/api";
import { useUserStore } from "@/store/user";

export default function DashboardPage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // useEffect(() => {
  //   async function load() {
  //     const profile = await fetchProfile();
  //     if (!profile) {
  //       router.replace("/login");
  //       return;
  //     }
  //     setUser(profile);
  //   }
  //   load();
  //   // eslint-disable-next-line
  // }, []);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || user.email}!</h1>
      <p className="mb-4">This is your dashboard.</p>
    </div>
  );
}
