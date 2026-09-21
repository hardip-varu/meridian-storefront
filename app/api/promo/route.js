import { NextResponse } from "next/server";
import { validatePromo } from "@/lib/mockBackend";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = validatePromo(body?.code);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.reason }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    code: result.code,
    type: result.type,
    value: result.value,
    label: result.label,
  });
}
