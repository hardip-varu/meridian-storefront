"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/products";

export default function Confirmation() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const total = params.get("total");

  if (!orderId) {
    return (
      <div className="container">
        <div className="panel">
          <h1>No order found</h1>
          <p className="muted">
            We could not find an order to confirm. <Link href="/">Return to shop</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="panel" data-testid="confirmation-panel">
        <div className="notice ok" data-testid="confirmation-message">
          Thank you. Your order is confirmed.
        </div>
        <h1>Order confirmed</h1>
        <p>
          Order reference:{" "}
          <strong data-testid="confirmation-order-id">{orderId}</strong>
        </p>
        {total && (
          <p>
            Total charged:{" "}
            <strong data-testid="confirmation-total">
              {formatPrice(total)}
            </strong>
          </p>
        )}
        <p style={{ marginTop: 20 }}>
          <Link className="btn" href="/" data-testid="continue-shopping">
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
}
