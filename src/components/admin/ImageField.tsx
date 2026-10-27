"use client";
/* eslint-disable @next/next/no-img-element */

import { useId, useRef, useState } from "react";
import { btnSecondary, btnSmall } from "./styles";

const MAX_BYTES = 5 * 1024 * 1024;

export function ImageField({
  name,
  label,
  initial,
  help,
  error,
}: {
  name: string;
  label: string;
  initial: string;
  help?: string;
  error?: string;
}) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProblem(null);
    if (file.size > MAX_BYTES) {
      setProblem("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setProblem(data.error ?? "Gagal mengunggah gambar. Coba lagi.");
      } else {
        setUrl(data.url);
      }
    } catch {
      setProblem("Gagal mengunggah gambar. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  const message = problem ?? error;

  return (
    <div>
      <span id={`${id}-label`} className="font-medium">
        {label}
      </span>
      <input type="hidden" name={name} value={url} />
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {url ? (
          <img src={url} alt="" className="h-24 w-36 rounded-sm border border-line object-cover" />
        ) : (
          <div className="flex h-24 w-36 items-center justify-center rounded-sm border border-dashed border-line bg-mist text-sm text-muted">
            Belum ada gambar
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            disabled={busy}
            aria-labelledby={`${id}-label`}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Mengunggah" : url ? "Ganti gambar" : "Pilih gambar"}
          </button>
          {url && !busy && (
            <button type="button" className={btnSmall} onClick={() => setUrl("")}>
              Hapus gambar
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          tabIndex={-1}
          onChange={onPick}
        />
      </div>
      {help && !message && <p className="mt-1.5 text-sm text-muted">{help}</p>}
      {message && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
