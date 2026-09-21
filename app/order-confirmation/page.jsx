import { Suspense } from "react";
import Confirmation from "./Confirmation";

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container">
          <p className="empty">Loading your confirmation...</p>
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
