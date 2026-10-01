import { NextResponse } from "next/server";

const FREE_SHIPPING_THRESHOLD = 40;
const FLAT_RATE = 4.95;
const DISPATCH_HOURS = 24;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("subtotal");

  if (raw === null) {
    return NextResponse.json({
      dispatchHours: DISPATCH_HOURS,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      flatRate: FLAT_RATE,
    });
  }

  const subtotal = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json(
      { errors: { subtotal: "Subtotal must be a non-negative number." } },
      { status: 400 }
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
  return NextResponse.json({
    subtotal,
    shipping,
    freeShipping: shipping === 0,
    amountToFreeShipping: Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2))),
  });
}
