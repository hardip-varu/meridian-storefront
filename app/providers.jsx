"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const AuthContext = createContext(null);

const CART_KEY = "meridian_cart";
const AUTH_KEY = "meridian_auth";

export function AppProviders({ children }) {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(c)) setItems(c);
      const a = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (a) setUser(a);
    } catch (e) {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }, [user, ready]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, qty },
      ];
    });
  }

  function updateQty(id, qty) {
    const n = Math.max(0, parseInt(qty, 10) || 0);
    setItems((prev) =>
      n === 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty: n } : i))
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const cartValue = {
    items,
    count,
    subtotal,
    ready,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  const authValue = {
    user,
    login: (u) => setUser(u),
    logout: () => setUser(null),
  };

  return (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
    </AuthContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within AppProviders");
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AppProviders");
  return ctx;
}
