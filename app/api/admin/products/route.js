import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/products";

function isAuthorized(request) {
  const header = request.headers.get("authorization") || "";
  return /^Bearer\s+.+/.test(header);
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = {};
  if (!body?.name || !String(body.name).trim()) errors.name = "Name is required.";

  const validCategories = CATEGORIES.map((c) => c.value);
  if (!body?.category || !validCategories.includes(body.category)) {
    errors.category = "A valid category is required.";
  }

  const price = Number(body?.price);
  if (body?.price === "" || body?.price == null || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const product = {
    id: `new-${Date.now().toString(36)}`,
    name: String(body.name).trim(),
    category: body.category,
    price: Number(price.toFixed(2)),
    stock: 0,
  };

  // Not persisted in this fixture. Returned so the flow can be tested.
  return NextResponse.json({ product }, { status: 201 });
}
