"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/db";

export default function AdminDashboard({
  leads,
  stats,
}: {
  leads: Lead[];
  stats: { total: number; today: number; week: number };
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
    );
  }, [search, leads]);

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "x-csrf-token": "1" },
    });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              LP
            </div>
            <span className="text-lg font-semibold text-gray-900">Leads Dashboard</span>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="/"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Landing Page
            </a>
            <div ref={exportRef} className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 focus:outline-none"
              >
                Export
              </button>
              {exportOpen && (
                <div className="absolute right-0 z-10 mt-2 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <a
                    href="/api/leads/export?format=csv"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Export CSV
                  </a>
                  <a
                    href="/api/leads/export?format=json"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Export JSON
                  </a>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus:ring-2 focus:ring-brand-500/40 focus:outline-none"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 focus:ring-2 focus:ring-brand-500/40 focus:outline-none sm:hidden"
            aria-label="Toggle menu"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div ref={menuRef} className="border-t border-gray-200 px-6 py-4 sm:hidden">
            <div className="flex flex-col gap-3">
              <a
                href="/"
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Landing Page
              </a>
              <a
                href="/api/leads/export?format=csv"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Export CSV
              </a>
              <a
                href="/api/leads/export?format=json"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Export JSON
              </a>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Leads" value={stats.total} />
          <StatCard label="This Week" value={stats.week} />
          <StatCard label="Today" value={stats.today} />
        </div>

        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, or message..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-500/40"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
            {leads.length === 0
              ? "No leads yet. Share your landing page to start collecting inquiries."
              : "No leads match your search."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Name</th>
                    <th className="px-4 py-3 sm:px-6">Email</th>
                    <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Phone</th>
                    <th className="hidden px-4 py-3 md:table-cell md:px-6">Company</th>
                    <th className="hidden px-4 py-3 lg:table-cell lg:px-6">Message</th>
                    <th className="px-4 py-3 sm:px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 sm:px-6">
                        {lead.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600 sm:px-6">
                        {lead.email}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 sm:table-cell sm:px-6">
                        {lead.phone || "—"}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 md:table-cell md:px-6">
                        {lead.company || "—"}
                      </td>
                      <td className="hidden max-w-xs truncate px-4 py-3 text-gray-500 lg:table-cell lg:px-6">
                        {lead.message}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500 sm:px-6">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400 sm:px-6">
              Showing {filtered.length} of {leads.length} lead{leads.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
