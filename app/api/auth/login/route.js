import { NextResponse } from "next/server";
import { DEMO_USER, issueToken, isValidEmail } from "@/lib/mockBackend";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { password } = body || {};
  // Normalise the email so autofill whitespace and capitalisation
  // (common on mobile keyboards) don't reject valid credentials.
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    return NextResponse.json({ email, token: issueToken(email) }, { status: 200 });
  }

  return NextResponse.json(
    { error: "Invalid email or password." },
    { status: 401 }
  );
}
