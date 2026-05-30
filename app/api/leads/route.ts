import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (name.trim().length > 100) {
      errors.name = "Name must be under 100 characters.";
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "A valid email address is required.";
    } else if (email.trim().length > 254) {
      errors.email = "Email must be under 254 characters.";
    }
    if (phone && typeof phone === "string" && phone.trim().length > 50) {
      errors.phone = "Phone must be under 50 characters.";
    }
    if (company && typeof company === "string" && company.trim().length > 100) {
      errors.company = "Company must be under 100 characters.";
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    } else if (message.trim().length > 5000) {
      errors.message = "Message must be under 5000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    await insertLead({
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === "string" ? phone.trim() : "",
      company: typeof company === "string" ? company.trim() : "",
      message: message.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _form: "Something went wrong. Please try again later." } },
      { status: 500 }
    );
  }
}
