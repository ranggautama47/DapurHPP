"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DashboardLoading() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(0);

  const name = user?.name ? user.name.split(" ")[0] : "Pemilik";

  // Simulasi progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const clampedProgress = Math.min(Math.round(progress), 100);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-[500px] w-full px-6 py-12">
        {/* Ganti SVG jadi Image dari public/loading/loading.png */}
        <div className="mb-8">
          <Image
            src="/loading/loading.png"
            alt="Memuat dapur..."
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-[#2A1711] mb-2">
          Memuat dapur...
        </h2>
        <p className="text-base text-[#8A7362] mb-8">
          Mohon ditunggu sebentar ya,{" "}
          <span className="text-[#FF8A00] font-semibold">{name}</span> 👩‍🍳
        </p>

        {/* Progress Bar */}
        <div className="relative h-8 bg-white rounded-full border-2 border-[#E8D5C4] overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] rounded-full flex items-center justify-end pr-3 transition-all duration-300 ease-out"
            style={{ width: `${clampedProgress}%` }}
          >
            <span className="text-white text-sm font-semibold drop-shadow-sm">
              {clampedProgress}%
            </span>
          </div>
          <div
            className="absolute top-0 left-0 h-full rounded-full overflow-hidden opacity-30"
            style={{ width: `${clampedProgress}%` }}
          >
            <div
              className="h-full w-[200%] animate-[slide_1s_linear_infinite]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 16px)",
              }}
            />
          </div>
        </div>

        {/* Fun tip */}
        <p className="text-[13px] text-[#A1887F] mt-5 italic">
          💡 Tips: Sambil menunggu, cek stok bahan baku agar tidak kehabisan di
          tengah produksi!
        </p>
      </div>

      {/* Keyframes stripe */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-16px);
          }
        }
      `}</style>
    </div>
  );
}
