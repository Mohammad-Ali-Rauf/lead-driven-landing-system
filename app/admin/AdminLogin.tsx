"use client";

import { useState, type FormEvent } from "react";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": "1" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Incorrect PIN.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            LP
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your PIN to view leads.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="pin" className="mb-1 block text-sm font-medium text-gray-700">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              required
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-500/40"
              placeholder="Enter admin PIN"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <a href="/" className="font-medium text-brand-600 transition hover:text-brand-700">
              &larr; Back to landing page
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
