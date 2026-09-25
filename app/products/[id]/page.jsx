import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { getProduct, categoryLabel, formatPrice } from "@/lib/products";

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const initial = product.name.charAt(0).toUpperCase();

  return (
    <div className="container">
      <p style={{ marginTop: 20 }}>
        <Link href="/" data-testid="back-link">
          Back to shop
        </Link>
      </p>
      <div className="detail" data-testid="product-detail" data-product-id={product.id}>
        <div className="thumb">{initial}</div>
        <div>
          <span className="meta">{categoryLabel(product.category)}</span>
          <h1 data-testid="detail-name">{product.name}</h1>
          <p className="muted">
            {product.origin !== "N/A" ? `Origin: ${product.origin}` : "Brewing equipment"}
            {product.roast !== "n/a" ? ` • Roast: ${product.roast}` : ""}
            {product.weight !== "N/A" ? ` • ${product.weight}` : ""}
          </p>
          <div className="price" data-testid="detail-price">
            {formatPrice(product.price)}
          </div>
          <p>{product.description}</p>
          {product.stock > 0 ? (
            <span className="badge" data-testid="stock-status">
              In stock: {product.stock}
            </span>
          ) : (
            <span className="badge out" data-testid="stock-status">
              Out of stock
            </span>
          )}
          {product.stock > 0 && product.stock <= 15 && (
            <p className="hint" data-testid="low-stock">
              Only {product.stock} left, order soon.
            </p>
          )}
          <div style={{ marginTop: 20 }}>
            <AddToCart product={product} showQty />
          </div>
        </div>
      </div>
    </div>
  );
}
