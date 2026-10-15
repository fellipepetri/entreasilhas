"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  previewHeightClass?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  placeholder = "/images/exemplo.jpg ou https://...",
  helperText,
  previewHeightClass = "h-36"
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao fazer upload da imagem");
      }

      onChange(data.url);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "Erro desconhecido no upload."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(value);
            }}
            className="text-[11px] text-brand-sea hover:underline font-medium"
          >
            Copiar caminho
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-sea focus:outline-none focus:ring-2 focus:ring-brand-sea/20"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition"
        >
          {isUploading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>Subir Foto</span>
              <span>📁</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Miniatura de Pré-visualização */}
      {value && (
        <div
          className={`relative ${previewHeightClass} w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 mt-2`}
        >
          {value.startsWith("http") || value.startsWith("/") ? (
            <Image
              src={value}
              alt="Pré-visualização"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Caminho de imagem não reconhecido
            </div>
          )}
        </div>
      )}
    </div>
  );
}
