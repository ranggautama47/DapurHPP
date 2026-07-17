import { KategoriBahan } from "@/types/bahan-baku";

export const kategoriBadge: Record<
  KategoriBahan,
  { bg: string; text: string; label: string; emoji: string }
> = {
  TEPUNG: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Tepung",
    emoji: "🌾",
  },
  MINYAK: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Minyak",
    emoji: "🌻",
  },
  SAYURAN: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Sayuran",
    emoji: "🥦",
  },
  BUMBU: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Bumbu",
    emoji: "🌶️",
  },
  DAGING: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Daging",
    emoji: "🥩",
  },
  LAINNYA: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "Lainnya",
    emoji: "📦",
  },
};
