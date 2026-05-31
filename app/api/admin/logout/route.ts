import { NextResponse } from "next/server";
import { clearAuthCookieOnResponse } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: Request) {
  if (!validateCsrf(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookieOnResponse(response);
  return response;
}
