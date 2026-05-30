import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is required.");
  }
  return secret;
}

export function hashPin(pin: string): string {
  return crypto
    .createHash("sha256")
    .update(pin + ":" + getSecret())
    .digest("hex");
}

export function createToken(pin: string): string {
  return hashPin(pin);
}

export function verifyToken(token: string): boolean {
  const pin = process.env.ADMIN_PIN;
  if (!pin) return false;
  const expected = createToken(pin);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function getAuthCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getAuthCookie();
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  const isSecure = process.env.NODE_ENV === "production";
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
