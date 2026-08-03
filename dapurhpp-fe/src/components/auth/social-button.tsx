"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SocialButtonProps {
  label: string;
  disabled?: boolean;
  ariaLabelPrefix?: string;
  tooltipText?: string;
}

export function SocialButton({ label, disabled = true, ariaLabelPrefix, tooltipText }: SocialButtonProps) {
  const Icon = label === "Google" ? (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ) : (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.65c.78-.57 1.22-1.44 1.22-2.45 0-2.31-1.89-4.2-4.2-4.2S10.1 15.74 10.1 18.05c0 .78.22 1.5.6 2.1-.98.2-1.98.3-3 .3-2.86 0-5.4-2.07-6.15-4.93H0v2.85c1.7 1.9 4.3 3.45 7.15 3.45 3.8 0 7-.24 9.9-.7z" />
    </svg>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1711] text-white transition-all duration-200
              ${disabled
                ? "opacity-50 cursor-not-allowed scale-100 hover:scale-100"
                : "hover:scale-105 hover:bg-[#3D251C] focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2"}`}
            aria-label={`${ariaLabelPrefix || "Masuk dengan"} ${label}`}
            aria-disabled={disabled}
          >
            {Icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#2A1711] text-white text-xs px-2 py-1 rounded shadow-lg">
          {tooltipText || "Segera Hadir"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}