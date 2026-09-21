# Ground Truth: expected test cases

This is the scoring rubric for ContextQA's generated tests. Every ticket below was written against the known, deterministic behaviour of the Meridian Coffee storefront, so the "expected cases" are what a good generator should produce. After onboarding, compare what ContextQA generates to this list.

How to use it:
1. Run ContextQA onboarding with all four sources connected plus the deployed platform link, and the `openapi.yaml` for API generation.
2. Tag each generated case by the source it came from (Jira, Linear, GitHub, platform crawl, or swagger).
3. For each ticket, mark expected cases as covered or missed, and log any extra cases (possible hallucinations or genuinely useful additions).
4. Score the specific behaviours in the "What this probes" column.

The ticket set is symmetric on purpose. The same category of ticket appears on both Jira and Linear so you can compare how consistently each integration is parsed. STORE-6 is a deliberate near duplicate of SHOP-1 to test deduplication across sources.

---

## Jira tickets (project SHOP)

### SHOP-1 (Story, clean acceptance criteria) Product search and category filter
Expected cases:
- Searching "ethiopia" returns exactly one result (Ethiopia Yirgacheffe).
- Searching a nonsense term shows the no results empty state.
- Search is case insensitive (ETHIOPIA behaves like ethiopia).
- Selecting category Decaf shows only the two decaf products.
- Search plus category combine (both filters applied).
- Clear resets to the full catalogue of 10 products.

What this probes: acceptance criteria mapped to concrete steps. Mostly browser cases.

### SHOP-2 (Bug with repro steps) Cart subtotal must update on quantity change
Expected cases:
- Add an item, open cart, change quantity 1 to 3, subtotal becomes 3x unit price.
- Line total equals quantity times unit price.
- Setting quantity to 0 removes the row from the cart.

What this probes: whether a bug report yields a regression test that asserts correct behaviour.

### SHOP-3 (Story, API focused) Checkout order API contract
Expected cases:
- POST /api/orders with valid body returns 201 with orderId and correct total.
- Empty items array returns 400 with an items error.
- Card 4000000000000002 returns 402 (declined).
- Missing customer fields return 400.
- Card that is not 16 digits returns 400 with a card error.

What this probes: API case generation from an endpoint description. Compare against the cases generated from `openapi.yaml` for the same endpoint.

### SHOP-4 (Story, negative and edge) Login error handling
Expected cases:
- Wrong password returns 401 and the UI shows an error message.
- Empty email or password shows the client validation message.
- Valid demo credentials log in and redirect home.

What this probes: negative and edge case generation. Browser and API.

### SHOP-5 (Vague, underspecified) Improve the checkout experience
Expected cases: none specific. This ticket is intentionally thin.

What this probes: ambiguity handling. Best outcome is the generator flags it as too vague or produces a single reasonable smoke test (checkout page loads). Worst outcome is a pile of confidently invented cases with details not present anywhere. Score qualitatively.

### SHOP-6 (Story with GitHub link) Category filter on catalogue (see PR #3)
Expected cases:
- Category Single Origin shows 4 products, Blends 2, Decaf 2, Equipment 2.
- Result count updates when a category is applied.

What this probes: correlation across sources. Note whether generated cases reference the linked PR or repo implementation, or ignore the link entirely.

---

## Linear tickets (team STORE)

### STORE-1 (Story, clean acceptance criteria) Signup with validation
Expected cases:
- Valid signup returns 201 and logs the user in.
- Email existing@example.com returns 409 with a duplicate message.
- Password shorter than 6 characters shows the password error.
- Invalid email format shows the email error.
- Missing name shows the name error.

What this probes: acceptance criteria mapped to steps. Compare fidelity against SHOP-1 to gauge Jira vs Linear parsing consistency.

### STORE-2 (Bug with repro steps) Out of stock product must not be addable
Expected cases:
- Kenya Nyeri AA (p10) detail page shows Out of stock and a disabled Add to cart.
- The catalogue card for p10 shows the out of stock badge and a disabled button.
- p10 cannot be added to the cart.

What this probes: regression test from a bug report. Compare against SHOP-2.

### STORE-3 (Story, API focused) Products list API search and category params
Expected cases:
- GET /api/products returns 10 products with a count field.
- ?search=colombia returns Colombia Huila.
- ?category=equipment returns 2 products.
- Combined search and category params.
- A query with no match returns count 0 and an empty array.

What this probes: API case generation. Compare against SHOP-3 and against swagger generated cases.

### STORE-4 (Story, negative and edge) Admin add product requires auth
Expected cases:
- POST /api/admin/products with no Authorization header returns 401.
- POST with a Bearer token and valid body returns 201.
- Invalid category returns 400.
- Price of 0 or non numeric returns 400.
- Visiting /admin while logged out shows the locked state with a login prompt.

What this probes: negative, edge, and auth gating. Compare against SHOP-4.

### STORE-5 (Vague) Make the store faster
Expected cases: none specific. Non functional and vague.

What this probes: ambiguity and non functional handling. Compare behaviour against SHOP-5.

### STORE-6 (Near duplicate of SHOP-1) Customers can search the catalogue
Expected cases: same as SHOP-1.

What this probes: deduplication across sources. Does the generator recognise this overlaps SHOP-1, merge them, or generate a redundant second set. Log which.

---

## Summary matrix

| Ticket | Source | Type | Primary probe |
| --- | --- | --- | --- |
| SHOP-1 | Jira | Story with AC | AC to steps |
| SHOP-2 | Jira | Bug | Regression from bug |
| SHOP-3 | Jira | API story | API cases from ticket |
| SHOP-4 | Jira | Negative | Error and edge cases |
| SHOP-5 | Jira | Vague | Ambiguity handling |
| SHOP-6 | Jira | GitHub link | Correlation across sources |
| STORE-1 | Linear | Story with AC | AC to steps (vs SHOP-1) |
| STORE-2 | Linear | Bug | Regression (vs SHOP-2) |
| STORE-3 | Linear | API story | API cases (vs SHOP-3, vs swagger) |
| STORE-4 | Linear | Negative | Auth and edge (vs SHOP-4) |
| STORE-5 | Linear | Vague | Ambiguity (vs SHOP-5) |
| STORE-6 | Linear | Duplicate | Deduplication vs SHOP-1 |

## What to measure at the end

- Coverage per ticket: expected cases covered divided by total expected.
- Extras per ticket: generated cases with no expected match, split into useful vs hallucinated.
- Source distribution: how many cases came from Jira vs Linear vs GitHub vs platform crawl vs swagger.
- Jira vs Linear consistency: on the mirrored pairs (1, 2, 3, 4, 5), did both produce comparable cases.
- API path comparison: SHOP-3 and STORE-3 (from tickets) vs the swagger generated cases for the same endpoints. Which is richer.
- Dedup: how STORE-6 was handled relative to SHOP-1.
- Ambiguity: what SHOP-5 and STORE-5 produced.
