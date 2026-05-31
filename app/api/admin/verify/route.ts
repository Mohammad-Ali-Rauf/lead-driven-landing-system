import { NextResponse } from "next/server";
import { createToken, setAuthCookieOnResponse } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { ok: allowed } = rateLimit(`verify:${ip}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { pin } = await request.json();
    const adminPin = process.env.ADMIN_PIN;

    if (!adminPin) {
      return NextResponse.json(
        { ok: false, error: "Admin PIN not configured on the server." },
        { status: 500 }
      );
    }

    if (!pin || typeof pin !== "string" || pin.trim() !== adminPin) {
      return NextResponse.json(
        { ok: false, error: "Incorrect PIN." },
        { status: 401 }
      );
    }

    const token = createToken(pin.trim());
    const response = NextResponse.json({ ok: true });
    setAuthCookieOnResponse(response, token);

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
