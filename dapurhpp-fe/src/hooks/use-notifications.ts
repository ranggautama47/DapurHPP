"use client";

import { useCallback, useEffect } from "react";
import { api } from "@/lib/axios";
import { useNotifStore } from "@/lib/notification-store";

export function useNotifications() {
  const { notifications, unreadCount, isLoading, setData, setLoading, markRead, markAllRead, remove } =
    useNotifStore();

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post("/notifikasi/generate");
      setData(res.data);
      return res.data;
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifikasi");
      setData(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  const handleMarkRead = useCallback(
    async (id: number) => {
      markRead(id);
      try {
        await api.patch(`/notifikasi/${id}/read`);
      } catch {
        fetchAll();
      }
    },
    [markRead, fetchAll]
  );

  const handleMarkAllRead = useCallback(async () => {
    markAllRead();
    try {
      await api.patch("/notifikasi/baca-semua");
    } catch {
      fetchAll();
    }
  }, [markAllRead, fetchAll]);

  const handleRemove = useCallback(
    async (id: number) => {
      remove(id);
      try {
        await api.delete(`/notifikasi/${id}`);
      } catch {
        fetchAll();
      }
    },
    [remove, fetchAll]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    generate,
    fetchAll,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    remove: handleRemove,
  };
}
