"use client";

import { useActionState } from "react";
import { updateAccount, type FormState } from "@/app/admin/(panel)/actions";
import { btnPrimary, inputCls } from "./styles";

export function AccountForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateAccount, {});
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate className="max-w-xl space-y-5">
      {state.error && (
        <p role="alert" className="border-l-4 border-danger bg-danger/5 px-4 py-3 font-semibold text-danger">
          {state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p role="status" className="border-l-4 border-ok bg-ok/5 px-4 py-3 font-medium text-ok">
          {state.message}
        </p>
      )}

      <Input id="name" label="Nama" defaultValue={name} error={err.name} autoComplete="name" />
      <Input id="email" label="Email" type="email" defaultValue={email} error={err.email} autoComplete="email" />

      <fieldset className="space-y-5 border-t border-line pt-6">
        <legend className="font-display text-xl font-semibold text-batik">Password</legend>
        <Input
          id="currentPassword"
          label="Password saat ini"
          type="password"
          error={err.currentPassword}
          autoComplete="current-password"
          help="Wajib diisi untuk menyimpan perubahan apa pun."
        />
        <Input
          id="newPassword"
          label="Password baru"
          type="password"
          error={err.newPassword}
          autoComplete="new-password"
          help="Kosongkan bila tidak ingin mengganti. Minimal 8 karakter."
        />
        <Input
          id="confirmPassword"
          label="Ulangi password baru"
          type="password"
          error={err.confirmPassword}
          autoComplete="new-password"
        />
      </fieldset>

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Menyimpan" : "Simpan akun"}
      </button>
    </form>
  );
}

function Input({
  id,
  label,
  type = "text",
  defaultValue,
  error,
  help,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  help?: string;
  autoComplete?: string;
}) {
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputCls}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : (
        help && (
          <p id={`${id}-help`} className="mt-1.5 text-sm text-muted">
            {help}
          </p>
        )
      )}
    </div>
  );
}
