"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { getProducts, CATEGORIES, formatPrice } from "@/lib/products";

export default function AdminPage() {
  const { user } = useAuth();
  const existing = getProducts();
  const [form, setForm] = useState({
    name: "",
    category: "single-origin",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [created, setCreated] = useState([]);

  if (!user) {
    return (
      <div className="container">
        <div className="panel" data-testid="admin-locked">
          <h1>Admin</h1>
          <div className="notice error">
            You must be logged in to manage products.
          </div>
          <p>
            <Link className="btn" href="/login" data-testid="admin-login-link">
              Go to login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  async function addProduct() {
    setMessage(null);
    setErrors({});
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: form.price,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setCreated((c) => [data.product, ...c]);
        setMessage({ type: "ok", text: `Product "${data.product.name}" created.` });
        setForm({ name: "", category: "single-origin", price: "" });
      } else if (res.status === 400) {
        setErrors(data.errors || {});
      } else if (res.status === 401) {
        setMessage({ type: "error", text: "Not authorized. Please log in again." });
      } else {
        setMessage({ type: "error", text: "Could not create product." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
  }

  return (
    <div className="container">
      <h1 className="section-title">Admin: products</h1>
      <p className="muted">Logged in as {user.email}</p>

      <div className="panel wide" data-testid="admin-form" style={{ margin: "20px 0" }}>
        <h2>Add a product</h2>
        {message && (
          <div className={`notice ${message.type}`} data-testid="admin-message">
            {message.text}
          </div>
        )}
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              data-testid="admin-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error" data-testid="error-name">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              data-testid="admin-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Price (USD)</label>
            <input
              id="price"
              data-testid="admin-price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <span className="error" data-testid="error-price">{errors.price}</span>}
          </div>
          <button className="btn" data-testid="admin-submit" onClick={addProduct}>
            Create product
          </button>
        </div>
      </div>

      <h2 className="section-title">Catalog</h2>
      <table className="table" data-testid="admin-catalog">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {[...created, ...existing].map((p) => (
            <tr key={p.id} data-testid="admin-row">
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.stock ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
