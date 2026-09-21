import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export async function GET(request, { params }) {
  const product = getProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
