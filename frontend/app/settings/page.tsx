"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import PasswordField from "@/components/PasswordField";
import { api } from "@/lib/api";
import { fraunces } from "@/lib/fonts";
import { useRequireAuth } from "@/lib/auth";

function SettingsInner() {
  const { user } = useRequireAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match — check and try again.");
      return;
    }
    if (next === current) {
      setError("New password must be different from the current one.");
      return;
    }
    setBusy(true);
    try {
      await api.changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess("Password updated. Use it next time you sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="glass-deep rounded-[1.75rem] p-8 sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45 dark:text-white/40">
          Security
        </p>
        <h1 className={`${fraunces.className} mt-2 text-[1.9rem] font-light leading-tight tracking-tight`}>
          Change password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/55 dark:text-white/50">
          Signed in as <span className="font-semibold text-ink/80 dark:text-white/80">{user?.name}</span>
          {" "}({user?.email}). Pick something memorable — at least 8 characters.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <PasswordField
            id="current-password"
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />

          {error && (
            <div
              className="rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="rounded-xl border border-emerald-900/15 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-200"
              role="status"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-ink py-3.5 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 dark:bg-mint-300 dark:text-abyss-950"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-ink/40 dark:text-white/35">
        Tip: after changing it here, use the new password everywhere —
        including the desktop app on the clinic PC.
      </p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsInner />
    </AppShell>
  );
}
