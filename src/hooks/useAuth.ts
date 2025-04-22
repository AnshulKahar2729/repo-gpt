"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { fetchProfile } from "@/utils/api";

export default function useAuth() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function getProfile() {
      try {
        const user = await fetchProfile();
        setUser(user);
      } catch (err : any) {
        setUser(null);
      }
    }
    getProfile();
    // Optionally, you could add logic here to re-run on route change if needed
  }, [setUser]);
}
