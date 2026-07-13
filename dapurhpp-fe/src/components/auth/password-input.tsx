"use client";

import { forwardRef, useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

interface PasswordInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ name, control, label, placeholder = "••••••••", error }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-[#FFEDE8] mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8A7362]">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              const { ref: fieldRef, ...rest } = field;
              return (
                <input
                  ref={ref}
                  type={showPassword ? "text" : "password"}
                  id={name}
                  {...rest}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 border-[#E8D5C4] rounded-[1rem] text-[#2A1711] text-base placeholder-[#8A7362]
                    focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20
                    disabled:bg-[#F5F0EB] disabled:cursor-not-allowed
                    ${error ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                  placeholder={placeholder}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${name}-error` : undefined}
                />
              );
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8A7362] hover:text-[#FF8A00] transition-colors"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && (
          <p id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A]" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

interface EmailInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  error?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ name, control, label, placeholder = "nama@bisnisanda.com", error }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-[#FFEDE8] mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8A7362]">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              const { ref: fieldRef, ...rest } = field;
              return (
                <input
                  ref={ref}
                  type="email"
                  id={name}
                  {...rest}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#E8D5C4] rounded-[1rem] text-[#2A1711] text-base placeholder-[#8A7362]
                    focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20
                    disabled:bg-[#F5F0EB] disabled:cursor-not-allowed
                    ${error ? "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/20" : ""}`}
                  placeholder={placeholder}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${name}-error` : undefined}
                />
              );
            }}
          />
        </div>
        {error && (
          <p id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-[#BA1A1A]" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

EmailInput.displayName = "EmailInput";