import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "leads.db");

let db: SqlJsDatabase | null = null;
let initError: Error | null = null;
let initPromise: Promise<SqlJsDatabase> | null = null;

async function getDb(): Promise<SqlJsDatabase> {
  if (initError) throw initError;
  if (db) return db;

  if (!initPromise) {
    initPromise = initSqlJs().then(async (SQL) => {
      const exists = fs.existsSync(dbPath);
      const d = exists
        ? new SQL.Database(fs.readFileSync(dbPath))
        : new SQL.Database();

      d.run(`
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

      if (!exists) save(d);
      return d;
    }).catch((e) => {
      initError = e;
      throw e;
    });
  }

  db = await initPromise;
  return db;
}

function save(d: SqlJsDatabase) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const data = d.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function insertLead(lead: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}) {
  const d = await getDb();
  d.run(
    "INSERT INTO leads (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)",
    [lead.name, lead.email, lead.phone, lead.company, lead.message]
  );
  save(d);
}

export async function getAllLeads(): Promise<Lead[]> {
  const d = await getDb();
  const stmt = d.prepare("SELECT * FROM leads ORDER BY created_at DESC");
  const rows: Lead[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as Lead);
  }
  stmt.free();
  return rows;
}

export async function getLeadStats() {
  const d = await getDb();
  const total = (
    d.exec("SELECT COUNT(*) FROM leads")[0]?.values[0]?.[0] ?? 0
  ) as number;
  const today = (
    d.exec("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now')")[0]
      ?.values[0]?.[0] ?? 0
  ) as number;
  const week = (
    d.exec(
      "SELECT COUNT(*) FROM leads WHERE created_at >= datetime('now', '-7 days')"
    )[0]?.values[0]?.[0] ?? 0
  ) as number;
  return { total, today, week };
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
