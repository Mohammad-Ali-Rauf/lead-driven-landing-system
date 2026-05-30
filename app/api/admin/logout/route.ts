import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: Request) {
  if (!validateCsrf(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
