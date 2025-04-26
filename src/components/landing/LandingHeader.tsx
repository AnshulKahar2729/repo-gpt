import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 py-4 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-primary-600 tracking-tight">Repo GPT</span>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => router.push('/login')}>Login</Button>
        <Button variant="outline" onClick={() => router.push('/signup')}>Sign Up</Button>
      </div>
    </header>
  );
}
