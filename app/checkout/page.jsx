"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/providers";
import { formatPrice } from "@/lib/products";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    card: "",
    promoCode: "",
  });
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const discount = promo
    ? promo.type === "percent"
      ? Math.min(Number(((subtotal * promo.value) / 100).toFixed(2)), subtotal)
      : Math.min(promo.value, subtotal)
    : 0;
  const payable = Number((subtotal - discount).toFixed(2));

  async function applyPromoCode() {
    setPromoError(null);
    setPromo(null);
    setCheckingPromo(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.promoCode }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setPromo(data);
      } else {
        setPromoError(data.error || "This promo code is not valid.");
      }
    } catch (e) {
      setPromoError("Could not check the promo code. Please try again.");
    } finally {
      setCheckingPromo(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoError(null);
    update("promoCode", "");
  }

  async function placeOrder() {
    setMessage(null);
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          customer: {
            name: form.name,
            email: form.email,
            address: form.address,
          },
          payment: { card: form.card },
          promoCode: promo ? promo.code : undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        clearCart();
        router.push(
          `/order-confirmation?orderId=${encodeURIComponent(
            data.orderId
          )}&total=${encodeURIComponent(data.total)}`
        );
        return;
      }
      if (res.status === 402) {
        setMessage({ type: "error", text: "Your card was declined. Try a different card." });
      } else if (res.status === 400) {
        setErrors(data.errors || {});
        setMessage({ type: "error", text: "Please fix the errors below." });
      } else {
        setMessage({ type: "error", text: "Something went wrong. Please try again." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <div className="container">
        <div className="panel">
          <h1>Checkout</h1>
          <div className="empty" data-testid="checkout-empty">
            Your cart is empty. Add something before checking out.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="panel wide" data-testid="checkout-panel">
        <h1>Checkout</h1>

        {message && (
          <div className={`notice ${message.type}`} data-testid="checkout-message">
            {message.text}
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              data-testid="checkout-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            {errors.name && <span className="error" data-testid="error-name">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              data-testid="checkout-email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && <span className="error" data-testid="error-email">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="address">Shipping address</label>
            <textarea
              id="address"
              data-testid="checkout-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            {errors.address && <span className="error" data-testid="error-address">{errors.address}</span>}
          </div>
          <div className="field">
            <label htmlFor="card">Card number</label>
            <input
              id="card"
              data-testid="checkout-card"
              placeholder="16 digit card number"
              value={form.card}
              onChange={(e) => update("card", e.target.value)}
            />
            {errors.card && <span className="error" data-testid="error-card">{errors.card}</span>}
            <span className="hint">Test card 4000000000000002 is always declined.</span>
          </div>

          <div className="field">
            <label htmlFor="promoCode">Promo code</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="promoCode"
                data-testid="promo-input"
                placeholder="Enter a promo code"
                value={form.promoCode}
                disabled={!!promo}
                onChange={(e) => update("promoCode", e.target.value)}
              />
              {promo ? (
                <button
                  className="btn secondary"
                  data-testid="promo-remove"
                  onClick={removePromo}
                >
                  Remove
                </button>
              ) : (
                <button
                  className="btn secondary"
                  data-testid="promo-apply"
                  disabled={checkingPromo}
                  onClick={applyPromoCode}
                >
                  {checkingPromo ? "Checking..." : "Apply"}
                </button>
              )}
            </div>
            {promoError && (
              <span className="error" data-testid="promo-error">
                {promoError}
              </span>
            )}
            {promo && (
              <span className="notice ok" data-testid="promo-applied">
                Promo {promo.code} applied: {promo.label}
              </span>
            )}
          </div>

          <div className="cart-summary" style={{ justifyContent: "space-between" }}>
            <span className="muted">Subtotal</span>
            <span data-testid="checkout-subtotal">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="cart-summary" style={{ justifyContent: "space-between" }}>
              <span className="muted">Discount</span>
              <span data-testid="checkout-discount">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="cart-summary" style={{ justifyContent: "space-between" }}>
            <span className="muted">Order total</span>
            <span className="total" data-testid="checkout-total">
              {formatPrice(payable)}
            </span>
          </div>

          <button
            className="btn"
            data-testid="place-order"
            disabled={submitting}
            onClick={placeOrder}
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
