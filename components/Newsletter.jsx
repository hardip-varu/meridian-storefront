"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function subscribe() {
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setMessage({ type: "ok", text: "You're subscribed. Watch your inbox for new roasts." });
        setEmail("");
      } else if (res.status === 409) {
        setMessage({ type: "error", text: "That email is already subscribed." });
      } else {
        setMessage({ type: "error", text: data.error || "Could not subscribe. Please try again." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel wide" data-testid="newsletter" style={{ margin: "8px auto 48px" }}>
      <h2 style={{ marginTop: 0 }}>New roasts, first</h2>
      <p className="muted">Get an email when a new single origin lands. No more than twice a month.</p>
      {message && (
        <div className={`notice ${message.type}`} data-testid="newsletter-message">
          {message.text}
        </div>
      )}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="newsletter-email">Email</label>
          <input
            id="newsletter-email"
            data-testid="newsletter-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn" data-testid="newsletter-submit" disabled={submitting} onClick={subscribe}>
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
    </section>
  );
}
