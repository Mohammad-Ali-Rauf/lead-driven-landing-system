import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

let client: Client | null = null;
let initialized = false;

function getClient(): Client {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL environment variable is required.");
  }
  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

async function init() {
  if (initialized) return;
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      company TEXT DEFAULT '',
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  initialized = true;
}

export async function insertLead(lead: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}) {
  await init();
  const db = getClient();
  await db.execute({
    sql: "INSERT INTO leads (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)",
    args: [lead.name, lead.email, lead.phone, lead.company, lead.message],
  });
}

export async function getAllLeads(): Promise<Lead[]> {
  await init();
  const db = getClient();
  const rs = await db.execute("SELECT * FROM leads ORDER BY created_at DESC");
  return rs.rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    phone: String(r.phone ?? ""),
    company: String(r.company ?? ""),
    message: String(r.message ?? ""),
    created_at: String(r.created_at ?? ""),
  }));
}

export async function getLeadStats() {
  await init();
  const db = getClient();
  const total = await db.execute("SELECT COUNT(*) as count FROM leads");
  const today = await db.execute(
    "SELECT COUNT(*) as count FROM leads WHERE date(created_at) = date('now')"
  );
  const week = await db.execute(
    "SELECT COUNT(*) as count FROM leads WHERE created_at >= datetime('now', '-7 days')"
  );
  return {
    total: Number(total.rows[0]?.count ?? 0),
    today: Number(today.rows[0]?.count ?? 0),
    week: Number(week.rows[0]?.count ?? 0),
  };
}

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
};
