"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setMessage(null);
    if (!form.email || !form.password) {
      setMessage({ type: "error", text: "Enter both email and password." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login({ email: data.email, token: data.token });
        router.push("/");
      } else {
        setMessage({ type: "error", text: data.error || "Login failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="panel" data-testid="login-panel">
        <h1>Log in</h1>
        {message && (
          <div className={`notice ${message.type}`} data-testid="login-message">
            {message.text}
          </div>
        )}
        <div className="form-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              data-testid="login-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              data-testid="login-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            className="btn"
            data-testid="login-submit"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
          <p className="hint">
            Demo account: demo@example.com / password123
          </p>
          <p className="muted">
            No account? <Link href="/signup" data-testid="link-signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
