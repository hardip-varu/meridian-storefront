import { NextResponse } from "next/server";
import { isValidEmail, REGISTERED_EMAIL } from "@/lib/mockBackend";

// Deterministic rules: existing@example.com is already subscribed (409),
// an invalid email is rejected (400), anything else subscribes (201).
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const email = String(body?.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (email === REGISTERED_EMAIL) {
    return NextResponse.json({ error: "Already subscribed." }, { status: 409 });
  }
  return NextResponse.json({ subscribed: true, email }, { status: 201 });
}
