"use client";
import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/store/user";
import { fetchProfile } from "@/utils/api";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function getProfile() {
      try {
        const user = await fetchProfile();
        setUser(user);
      } catch (err) {
        setUser(null);
      }
    }
    getProfile();
  }, [setUser]);

  return children;
}
