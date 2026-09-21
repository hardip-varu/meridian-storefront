import { NextResponse } from "next/server";
import {
  REGISTERED_EMAIL,
  issueToken,
  validateSignup,
} from "@/lib/mockBackend";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = validateSignup(body || {});
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (String(body.email).toLowerCase() === REGISTERED_EMAIL) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { email: body.email, token: issueToken(body.email) },
    { status: 201 }
  );
}
