"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/(site)/kontak/actions";

const fieldCls =
  "mt-1.5 w-full rounded-sm border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60 focus-visible:border-batik-soft aria-[invalid=true]:border-danger";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {});
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (state.ok) {
    return (
      <div role="status" className="border-l-4 border-kunyit bg-mist p-6">
        <h2 className="text-2xl font-semibold">Pesan terkirim</h2>
        <p className="mt-2 text-muted">Terima kasih. Kami akan membalas lewat email dalam satu hari kerja.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error && (
        <p role="alert" className="border-l-4 border-danger bg-danger/5 px-4 py-3 text-danger">
          {state.error}
        </p>
      )}

      <Field label="Nama" name="name" error={err.name} defaultValue={v.name} required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" error={err.email} defaultValue={v.email} required autoComplete="email" />
        <Field label="Telepon (opsional)" name="phone" type="tel" error={err.phone} defaultValue={v.phone} autoComplete="tel" />
      </div>
      <Field label="Subjek (opsional)" name="subject" error={err.subject} defaultValue={v.subject} />

      <div>
        <label htmlFor="body" className="font-medium">
          Pesan
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          required
          defaultValue={v.body}
          aria-invalid={err.body ? true : undefined}
          aria-describedby={err.body ? "body-error" : undefined}
          className={fieldCls}
          placeholder="Ceritakan kebutuhan atau masalah yang ingin diselesaikan."
        />
        {err.body && (
          <p id="body-error" className="mt-1.5 text-sm text-danger">
            {err.body}
          </p>
        )}
      </div>

      {/* Kolom jebakan bot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Jangan diisi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-sm bg-batik px-8 text-base font-semibold text-white transition-colors hover:bg-batik-soft disabled:opacity-60"
      >
        {pending ? "Mengirim" : "Kirim pesan"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  defaultValue,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldCls}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
