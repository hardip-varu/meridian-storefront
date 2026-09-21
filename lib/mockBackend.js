// Deterministic mock backend rules. Documented so tests can rely on them.
//
// AUTH
//   Demo login that always works:  demo@example.com / password123
//   Email already registered (409): existing@example.com
//   Password rule: minimum 6 characters
//
// PAYMENT (checkout)
//   Card number must be 16 digits.
//   Declined test card (402): 4000000000000002
//   Any other 16 digit number is accepted.

export const DEMO_USER = { email: "demo@example.com", password: "password123" };
export const REGISTERED_EMAIL = "existing@example.com";
export const DECLINED_CARD = "4000000000000002";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email || ""));
}

export function issueToken(email) {
  const payload = `${email}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

export function validateSignup({ name, email, password }) {
  const errors = {};
  if (!name || !String(name).trim()) errors.name = "Name is required.";
  if (!email || !String(email).trim()) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (String(password).length < 6)
    errors.password = "Password must be at least 6 characters.";
  return errors;
}

export function validateOrder(body) {
  const errors = {};
  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) errors.items = "Your cart is empty.";

  const c = body?.customer || {};
  if (!c.name || !String(c.name).trim()) errors.name = "Name is required.";
  if (!c.email || !isValidEmail(c.email)) errors.email = "A valid email is required.";
  if (!c.address || !String(c.address).trim()) errors.address = "Address is required.";

  const card = String(body?.payment?.card || "").replace(/\s+/g, "");
  if (!/^\d{16}$/.test(card)) errors.card = "Card number must be 16 digits.";

  return errors;
}
