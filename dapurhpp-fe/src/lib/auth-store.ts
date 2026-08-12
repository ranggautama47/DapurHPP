import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  namaUsaha: string | null;
  nomorHp: string | null;
  fontSize: string;
  notifAplikasi: boolean;
  notifStok: boolean;
  notifPenjualan: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setAccessToken: (token: string) => set({ accessToken: token }),
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export function setTokenCookie(token: string | null) {
  if (token) {
    Cookies.set("auth-token", token, {
      expires: 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    Cookies.remove("auth-token");
  }
}
