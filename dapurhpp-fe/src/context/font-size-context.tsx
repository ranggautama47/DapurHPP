"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface FontSizeContextValue {
  fontSize: string;
  setFontSize: (size: string) => Promise<void>;
}

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const storeSetUser = useAuthStore((s) => s.setUser);

  // Baca dari authStore — fallback "sedang" kalau user belum terisi
  const fontSize = user?.fontSize || "sedang";

  // Apply data-font-size attribute ke <html> setiap kali fontSize berubah
  useEffect(() => {
    if (!user) return; // belum login — jangan apply
    document.documentElement.setAttribute("data-font-size", fontSize);
  }, [fontSize, user]);

  const setFontSize = useCallback(
    async (size: string) => {
      if (!user || size === user.fontSize) return;
      const prev = user.fontSize;

      // Optimistic update: authStore + DOM langsung
      storeSetUser({ ...user, fontSize: size });
      document.documentElement.setAttribute("data-font-size", size);

      try {
        await api.patch("/users/profile", { fontSize: size });
      } catch {
        // Rollback: authStore + DOM kembali ke nilai sebelumnya
        storeSetUser({ ...user, fontSize: prev });
        document.documentElement.setAttribute("data-font-size", prev);
        toast.error("Gagal menyimpan ukuran font");
      }
    },
    [user, storeSetUser],
  );

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return ctx;
}