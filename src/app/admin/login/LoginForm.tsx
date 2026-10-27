"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const inputCls =
  "mt-1.5 w-full rounded-sm border border-line bg-white px-4 py-3 text-base text-ink focus-visible:border-batik-soft";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p role="alert" className="border-l-4 border-danger bg-danger/5 px-4 py-3 text-danger">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.email}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-batik px-6 font-semibold text-white transition-colors hover:bg-batik-soft disabled:opacity-60"
      >
        {pending ? "Memeriksa" : "Masuk"}
      </button>
    </form>
  );
}
