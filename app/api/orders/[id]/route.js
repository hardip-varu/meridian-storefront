import { NextResponse } from "next/server";

// Demo stub. Orders are not persisted in this fixture, so this endpoint
// returns a synthesized record for any well formed order id (ORD-XXXX).
export async function GET(request, { params }) {
  const id = params.id || "";
  if (!/^ORD-[A-Z0-9]+$/.test(id)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({
    order: {
      orderId: id,
      status: "confirmed",
      note: "Synthesized demo order. Not persisted.",
    },
  });
}
