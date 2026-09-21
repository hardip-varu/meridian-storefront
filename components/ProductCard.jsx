import Link from "next/link";
import AddToCart from "./AddToCart";
import { categoryLabel, formatPrice } from "@/lib/products";

export default function ProductCard({ product }) {
  const initial = product.name.charAt(0).toUpperCase();
  return (
    <div className="card" data-testid="product-card" data-product-id={product.id}>
      <Link href={`/products/${product.id}`} aria-label={product.name}>
        <div className="thumb">{initial}</div>
      </Link>
      <div className="body">
        <span className="meta">{categoryLabel(product.category)}</span>
        <h3>
          <Link href={`/products/${product.id}`} data-testid="product-name">
            {product.name}
          </Link>
        </h3>
        <span className="meta">
          {product.origin !== "N/A" && product.origin !== "Blend"
            ? product.origin
            : product.origin}{" "}
          {product.weight !== "N/A" ? `• ${product.weight}` : ""}
        </span>
        <span className="price" data-testid="product-price">
          {formatPrice(product.price)}
        </span>
        {product.stock <= 0 && (
          <span className="badge out" data-testid="stock-badge">
            Out of stock
          </span>
        )}
        <div className="actions">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
