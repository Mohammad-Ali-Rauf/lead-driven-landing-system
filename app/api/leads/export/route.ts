import { NextRequest, NextResponse } from "next/server";
import { getAllLeads } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getAllLeads();
    const format = request.nextUrl.searchParams.get("format") || "csv";

    if (format === "json") {
      return NextResponse.json(leads);
    }

    const header = "ID,Name,Email,Phone,Company,Message,Submitted At";
    const rows = leads.map((l) =>
      [
        l.id,
        escapeCsv(l.name),
        escapeCsv(l.email),
        escapeCsv(l.phone),
        escapeCsv(l.company),
        escapeCsv(l.message),
        l.created_at,
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to export leads." },
      { status: 500 }
    );
  }
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
