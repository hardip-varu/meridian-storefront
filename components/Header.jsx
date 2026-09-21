"use client";

import Link from "next/link";
import { useCart, useAuth } from "@/app/providers";

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="site-header" data-testid="site-header">
      <div className="container bar">
        <Link href="/" className="brand" data-testid="brand">
          Meridian<span>.</span>
        </Link>
        <nav className="nav" data-testid="main-nav">
          <Link href="/">Shop</Link>
          <Link href="/admin" data-testid="nav-admin">
            Admin
          </Link>
          {user ? (
            <>
              <span className="muted" data-testid="nav-user">
                {user.email}
              </span>
              <button
                className="btn secondary small"
                data-testid="nav-logout"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" data-testid="nav-login">
              Log in
            </Link>
          )}
          <Link href="/cart" className="cart-link" data-testid="nav-cart">
            Cart
            <span className="cart-count" data-testid="cart-count">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
