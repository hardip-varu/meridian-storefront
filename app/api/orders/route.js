import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { validateOrder, DECLINED_CARD } from "@/lib/mockBackend";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = validateOrder(body || {});
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const card = String(body.payment.card).replace(/\s+/g, "");
  if (card === DECLINED_CARD) {
    return NextResponse.json(
      { error: "Card declined.", code: "payment_declined" },
      { status: 402 }
    );
  }

  let total = 0;
  for (const item of body.items) {
    const product = getProduct(item.id);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.id}` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, parseInt(item.qty, 10) || 1);
    total += product.price * qty;
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  return NextResponse.json(
    { orderId, amountDue: Number(total.toFixed(2)), status: "confirmed" },
    { status: 201 }
  );
}
