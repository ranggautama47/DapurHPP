import { create } from "zustand";

export interface NotifItem {
  id: number;
  tipe: string;
  judul: string;
  deskripsi: string | null;
  icon: string;
  link: string | null;
  relatedId: number | null;
  isRead: boolean;
  createdAt: string;
}

interface NotifResponse {
  data: NotifItem[];
  unreadCount: number;
}

interface NotifState {
  notifications: NotifItem[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean;
  setData: (res: NotifResponse) => void;
  setLoading: (v: boolean) => void;
  setOpen: (v: boolean) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  remove: (id: number) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isOpen: false,
  setData: (res) =>
    set({ notifications: res.data, unreadCount: res.unreadCount }),
  setLoading: (v) => set({ isLoading: v }),
  setOpen: (v) => set({ isOpen: v }),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  remove: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
      unreadCount: s.notifications.find((n) => n.id === id && !n.isRead)
        ? s.unreadCount - 1
        : s.unreadCount,
    })),
}));
