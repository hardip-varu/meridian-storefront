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
      { error: "Card declined.", code: "card_declined" },
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
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      return NextResponse.json(
        { error: `Quantity for ${product.name} must be a whole number of at least 1.` },
        { status: 400 }
      );
    }
    if (product.stock <= 0) {
      return NextResponse.json(
        { error: `${product.name} is out of stock.`, code: "out_of_stock" },
        { status: 409 }
      );
    }
    if (qty > product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} of ${product.name} left in stock.`, code: "insufficient_stock" },
        { status: 409 }
      );
    }
    total += product.price * qty;
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  return NextResponse.json(
    { orderId, total: Number(total.toFixed(2)), status: "confirmed" },
    { status: 201 }
  );
}
