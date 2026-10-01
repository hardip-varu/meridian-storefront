export const metadata = { title: "Shipping policy | Meridian Coffee" };

export default function ShippingPolicyPage() {
  return (
    <div className="panel wide" data-testid="shipping-policy">
      <h1 className="section-title">Shipping policy</h1>
      <p data-testid="shipping-dispatch">
        Orders placed before 2 pm ship within 24 hours.
      </p>
      <p data-testid="shipping-free-threshold">
        Shipping is free on orders of 40.00 or more. Below that, a flat 4.95 applies.
      </p>
      <p data-testid="shipping-returns">
        Unopened coffee can be returned within 14 days of delivery.
      </p>
      <a href="/" data-testid="shipping-back-link">Back to shop</a>
    </div>
  );
}
