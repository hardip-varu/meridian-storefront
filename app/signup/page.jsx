"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setMessage(null);
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 201) {
        login({ email: data.email, token: data.token });
        router.push("/");
        return;
      }
      if (res.status === 409) {
        setMessage({ type: "error", text: "An account with that email already exists." });
      } else if (res.status === 400) {
        setErrors(data.errors || {});
      } else {
        setMessage({ type: "error", text: "Signup failed. Please try again." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="panel" data-testid="signup-panel">
        <h1>Create your account</h1>
        {message && (
          <div className={`notice ${message.type}`} data-testid="signup-message">
            {message.text}
          </div>
        )}
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              data-testid="signup-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error" data-testid="error-name">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              data-testid="signup-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span className="error" data-testid="error-email">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              data-testid="signup-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <span className="error" data-testid="error-password">{errors.password}</span>
            )}
            <span className="hint">At least 8 characters.</span>
          </div>
          <button
            className="btn"
            data-testid="signup-submit"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
          <p className="muted">
            Already have an account?{" "}
            <Link href="/login" data-testid="link-login">Log in</Link>
          </p>
          <p className="hint">
            Email existing@example.com is treated as already registered.
          </p>
        </div>
      </div>
    </div>
  );
}
