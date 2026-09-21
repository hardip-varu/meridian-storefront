# Meridian Coffee Storefront (QA Test Fixture)

A small but realistic e-commerce storefront built as a **test fixture** for evaluating ContextQA's onboarding and automatic test-case generation. It is deliberately deterministic: every flow has a known, documented expected outcome, so generated test cases can be scored against ground truth.

Stack: Next.js 14 (App Router), React 18, plain CSS. No database. A mock backend implements deterministic auth, checkout, and admin rules.

## Why this exists

ContextQA's onboarding connects GitHub, Jira, Linear, and a platform link, then generates test cases from all of them. This repo is the single coherent product those sources revolve around:

- The **repo** is the app (this codebase + `openapi.yaml`).
- The **platform link** is this app, deployed.
- **Jira** and **Linear** tickets (in `docs/`) describe features and bugs for this exact app.

Because the tickets were authored against known behaviour, `docs/TEST-GROUND-TRUTH.md` lists the test cases that *should* be generated. That turns "do the generated cases look reasonable" into a measurable coverage exercise.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
# or
npm run build && npm run start
```

## Deploy (platform link)

Push to GitHub, then import the repo into Vercel (zero config for Next.js). The deployed URL becomes the platform link you paste into ContextQA. Netlify works too via the Next runtime.

After deploying, update the `servers` URL in `openapi.yaml` to your deployment.

## Deterministic rules (for assertions)

Auth
- Demo login that always succeeds: `demo@example.com` / `password123`
- Signup email treated as already registered (409): `existing@example.com`
- Password minimum length: 8

Checkout
- Card number must be 16 digits
- Declined test card (402): `4000000000000002`
- Any other 16 digit number is accepted

Catalog
- `Kenya Nyeri AA` (`p10`) is intentionally out of stock, so its Add to cart is disabled

## Element hooks for automation

Every interactive and assertable element carries a stable `data-testid`. Prefer these over CSS or text selectors in any follow-up Playwright or Selenium work. Product elements also carry `data-product-id`.

## API

See `openapi.yaml` for the full contract. Summary:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/products | List, with `search` and `category` filters |
| GET | /api/products/{id} | Single product, 404 if missing |
| POST | /api/auth/signup | Create account (400 / 409) |
| POST | /api/auth/login | Log in (400 / 401) |
| POST | /api/orders | Place order (400 / 402 / 201) |
| GET | /api/orders/{id} | Order stub |
| POST | /api/admin/products | Create product, Bearer token required (401 / 400) |

## User flows

Browse and search, view product detail, add to cart, update quantity, checkout with validation and payment decline handling, signup, login, logout, and an admin add-product screen gated behind login.

## Repo layout

```
app/            App Router pages and API route handlers
components/      Header, ProductCard, AddToCart
lib/            products.js (catalog), mockBackend.js (deterministic rules)
data/           products.json (seed catalog)
docs/           Ground truth + Jira and Linear ticket sets + Jira import CSV
openapi.yaml    API contract for swagger based test generation
```

## Notes

Orders and admin created products are not persisted (no database). Endpoints validate and return correct status codes so flows are fully testable; state simply does not survive a reload. This is intentional to keep the deploy dependency free.
