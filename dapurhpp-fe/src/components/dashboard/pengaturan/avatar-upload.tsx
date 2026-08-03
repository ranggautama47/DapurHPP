"use client";

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string | null;
  userName: string;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

export function AvatarUpload({
  avatarUrl,
  userName,
  isUploading,
  onFileSelect,
}: AvatarUploadProps) {
  const [previewFile, setPreviewFile] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewFile) URL.revokeObjectURL(previewFile.url);
    };
  }, [previewFile]);

  const displayUrl = isUploading && previewFile ? previewFile.url : avatarUrl;
  const initial = userName?.charAt(0).toUpperCase() || "P";

  const validateFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return false;
    if (file.size > 2 * 1024 * 1024) return false;
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    if (previewFile) URL.revokeObjectURL(previewFile.url);
    const url = URL.createObjectURL(file);
    setPreviewFile({ file, url });
    onFileSelect(file);
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="relative shrink-0">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleChange}
      />
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-200 hover:border-[#FF8A00] ${
          displayUrl ? "" : "bg-[#FFE9E4]"
        }`}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={userName || "Avatar"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-[#FF8A00] text-3xl font-bold">{initial}</span>
        )}
      </div>
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FF8A00] rounded-full flex items-center justify-center hover:bg-[#E67E00] transition-colors shadow-md"
      >
        <Camera className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}
