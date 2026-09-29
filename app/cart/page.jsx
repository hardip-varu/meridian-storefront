"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, ready } = useCart();
  const router = useRouter();

  if (!ready) {
    return (
      <div className="container">
        <p className="empty">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="section-title">Your cart</h1>
        <div className="empty" data-testid="cart-empty">
          Your cart is empty. <Link href="/">Browse the shop</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Your cart</h1>
      <table className="table" data-testid="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Line total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} data-testid="cart-row" data-product-id={item.id}>
              <td data-testid="cart-item-name">{item.name}</td>
              <td>{formatPrice(item.price)}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.qty}
                  className="field"
                  style={{ width: 72, padding: "6px 8px" }}
                  data-testid="cart-qty"
                  onChange={(e) => updateQty(item.id, e.target.value)}
                />
              </td>
              <td data-testid="cart-line-total">
                {formatPrice(item.price * item.qty)}
              </td>
              <td>
                <button
                  className="btn secondary small"
                  data-testid="cart-remove"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subtotal >= 40 ? (
        <div className="notice ok" data-testid="free-shipping">
          You qualify for free shipping.
        </div>
      ) : (
        <div className="notice" data-testid="free-shipping">
          Add {formatPrice(40 - subtotal)} more for free shipping.
        </div>
      )}

      <div className="cart-summary">
        <span className="muted">Subtotal</span>
        <span className="total" data-testid="cart-subtotal">
          {formatPrice(subtotal)}
        </span>
        <button
          className="btn"
          data-testid="checkout-button"
          onClick={() => router.push("/checkout")}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
