import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const products = getProducts({ search, category });
  return NextResponse.json({ count: products.length, products });
}
