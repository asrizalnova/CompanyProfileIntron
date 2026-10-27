"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  action: () => Promise<void> | void;
  confirmText: string;
  title?: string;
  confirmLabel?: string;
  children: ReactNode;
  variant?: "danger" | "default";
  className?: string;
};

export function ConfirmForm({
  action,
  confirmText,
  title,
  confirmLabel = "Hapus",
  children,
  variant = "danger",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await action();
      } catch (e) {
        console.error(e);
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      <ConfirmModal
        open={open}
        title={title ?? "Hapus item ini?"}
        message={confirmText}
        confirmLabel={confirmLabel}
        cancelLabel="Batal"
        variant={variant}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => !pending && setOpen(false)}
      />
    </>
  );
}