
"use client";

import { useId, useRef, useState } from "react";
import { btnSecondary, btnSmall } from "./styles";

const MAX_BYTES = 10 * 1024 * 1024;

type PdfFieldProps = {
  name: string;
  label: string;
  initial?: string;
  documentTitle?: string;
  help?: string;
  error?: string;
};

export function PdfField({
  name,
  label,
  initial = "",
  documentTitle = "",
  help,
  error,
}: PdfFieldProps) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const safeTitle = documentTitle
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const downloadName = safeTitle
    ? `${safeTitle.replace(/\.pdf$/i, "")}.pdf`
    : undefined;

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    setProblem(null);

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setProblem("Pilih berkas PDF.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setProblem("Ukuran PDF maksimal 10 MB.");
      return;
    }

    setBusy(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!res.ok || !data.url) {
        setProblem(data.error ?? "Gagal mengunggah PDF.");
        return;
      }

      setUrl(data.url);
    } catch {
      setProblem("Gagal mengunggah PDF. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  const message = problem ?? error;

  return (
    <div>
      <label
        id={`${id}-label`}
        htmlFor={`${id}-input`}
        className="font-medium"
      >
        {label}
      </label>

      <input type="hidden" name={name} value={url} />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {url ? (
          <a
  href={url}
  target="_blank"
  rel="noreferrer"
  className="text-sm underline"
>
  {downloadName ?? "Lihat PDF yang dipilih"}
</a>
        ) : (
          <span className="text-sm text-muted">Belum ada PDF</span>
        )}

        <button
          type="button"
          className={btnSecondary}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Mengunggah..." : url ? "Ganti PDF" : "Pilih PDF"}
        </button>

        {url && !busy && (
          <button
            type="button"
            className={btnSmall}
            onClick={() => {
              setUrl("");
              setProblem(null);
            }}
          >
            Hapus PDF
          </button>
        )}

        <input
          id={`${id}-input`}
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          tabIndex={-1}
          onChange={onPick}
        />
      </div>

      {help && !message && (
        <p className="mt-1.5 text-sm text-muted">{help}</p>
      )}

      {message && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
