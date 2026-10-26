"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form action={action} className="w-full max-w-sm rounded-[18px] bg-white p-8 shadow-[0_10px_40px_rgba(15,61,46,0.12)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-pine text-saffron">
            <Lock className="size-5" />
          </div>
          <h1 className="text-2xl font-semibold text-pine">JD Travels admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage the website</p>
        </div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="mb-4 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-pine" />
        <label className="mb-1 block text-sm font-semibold" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="mb-4 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-pine" />
        {state?.error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>}
        <button disabled={pending} className="w-full rounded-full bg-pine py-3 font-semibold text-white transition hover:brightness-125 disabled:opacity-60">
          {pending ? "Signing in..." : "Sign in"}
        </button>
        <a href="/" className="mt-4 block text-center text-sm text-muted hover:text-pine">Back to website</a>
      </form>
    </main>
  );
}
