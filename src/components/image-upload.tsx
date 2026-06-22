"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui";

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Falha no upload");
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

export function ImageUpload({
  value,
  onChange,
  label = "Enviar imagem",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-background">
          <Image src={value} alt="preview" fill className="object-contain" sizes="64px" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
            aria-label="Remover"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={14} />
        {busy ? "Enviando..." : label}
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
