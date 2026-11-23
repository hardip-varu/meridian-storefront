"use client";

import { useState } from "react";
import { useCart } from "@/app/providers";

export default function AddToCart({ product, showQty = false }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, showQty ? qty : 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <button className="btn small" disabled data-testid="add-to-cart-disabled">
        Out of stock
      </button>
    );
  }

  return (
    <div>
      {showQty && (
        <div className="qty-row">
          <label htmlFor="qty">Quantity</label>
          <input
            id="qty"
            type="number"
            min="1"
            value={qty}
            data-testid="qty-input"
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      )}
      <button
        className="btn"
        data-testid="add-to-cart"
        data-product-id={product.id}
        onClick={handleAdd}
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}
