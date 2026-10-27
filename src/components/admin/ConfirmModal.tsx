"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmModal({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // State untuk handle animasi masuk & keluar
  const [mounted, setMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    } else if (mounted) {
      setIsClosing(true);
      document.body.style.overflow = "";
      // Tunggu animasi keluar selesai (180ms) baru hapus dari DOM
      const t = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  // ESC untuk tutup
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel, loading]);

  // Fokus ke tombol batal saat modal terbuka
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => cancelRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/40 ${
          isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
        }`}
        onClick={() => !loading && onCancel()}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className={`relative w-full max-w-[26rem] overflow-hidden rounded-2xl border border-line/60 bg-white shadow-2xl ${
          isClosing ? "animate-modal-card-out" : "animate-modal-card-in"
        }`}
      >
        {/* Aksen atas */}
        <div
          className={
            variant === "danger"
              ? "h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-400"
              : "h-1.5 w-full bg-gradient-to-r from-batik-soft/60 via-batik-soft to-batik-soft/60"
          }
        />

        <div className="p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Icon */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                variant === "danger"
                  ? "bg-red-50 text-red-600 ring-8 ring-red-50/50"
                  : "bg-mist text-batik-soft ring-8 ring-mist/50"
              }`}
            >
              {variant === "danger" ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h2 id="confirm-title" className="text-xl font-bold tracking-tight text-ink">
                {title}
              </h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-mist focus:outline-none focus:ring-2 focus:ring-batik-soft/30 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-batik-soft hover:bg-batik focus:ring-batik-soft"
              }`}
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Memproses…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}