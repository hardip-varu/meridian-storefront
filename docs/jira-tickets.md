# Jira tickets: project SHOP

Create these in a dedicated Jira project (suggested key SHOP). Keep the summaries and descriptions close to this wording so the ground truth mapping holds. A ready to import CSV is in `jira-import.csv`.

---

## SHOP-1  Product search and category filter
Type: Story
Labels: storefront, catalogue, search

Description:
Customers on the storefront home page need to find products quickly by name or origin and narrow the catalogue by category.

Acceptance criteria:
- Given a shopper on the home page, when they type a term into search and apply, then only products whose name, origin, or description match are shown.
- Given a search with no matches, when applied, then a clear "no products match" message is shown instead of an empty grid.
- Given any casing of a search term, when applied, then matching is case insensitive.
- Given a shopper, when they select a category, then only products in that category are shown.
- Given both a search term and a category, when applied, then both filters combine.
- Given active filters, when the shopper clicks Clear, then the full catalogue is shown again.

---

## SHOP-2  Cart subtotal must update when quantity changes
Type: Bug
Labels: cart, regression

Description:
Reported by a customer: after changing the quantity of an item in the cart, the subtotal appeared stale until a page reload.

Steps to reproduce:
1. Add any product to the cart.
2. Open the cart page.
3. Change the quantity field from 1 to 3.

Expected: the line total and the cart subtotal recalculate immediately.
Also expected: setting a quantity to 0 removes the item from the cart.

This should be covered by a regression test that asserts the subtotal updates live.

---

## SHOP-3  Checkout order API contract and validation
Type: Story
Labels: api, checkout, orders

Description:
The order endpoint POST /api/orders accepts items, customer details, and a payment card, and must validate input and handle a declined card.

Acceptance criteria:
- A valid request returns 201 with an orderId and a total equal to the sum of item price times quantity.
- An empty items array returns 400 with an items validation error.
- The test card 4000000000000002 returns 402 (declined).
- Missing customer name, email, or address returns 400.
- A card number that is not 16 digits returns 400 with a card error.

---

## SHOP-4  Login error handling
Type: Story
Labels: auth, login, negative

Description:
The login screen must handle invalid input and failed authentication gracefully.

Acceptance criteria:
- Given valid credentials (demo@example.com / password123), when submitted, then the user is logged in and returned to the shop.
- Given an incorrect password, when submitted, then the API returns 401 and the screen shows an error message.
- Given an empty email or password, when submitted, then a client side validation message is shown and no request is sent.

---

## SHOP-5  Improve the checkout experience
Type: Story
Labels: checkout

Description:
Checkout could be better. Let us make it smoother for customers.

(Intentionally vague. No acceptance criteria.)

---

## SHOP-6  Category filter on catalogue
Type: Story
Labels: catalogue, filter

Description:
Add the ability to filter the catalogue by category on the home page. Implemented in GitHub PR #3 (see the pull request for the exact behaviour and the categories supported).

Acceptance criteria:
- Selecting Single Origin shows 4 products, Blends shows 2, Decaf shows 2, Equipment shows 2.
- The visible result count updates to reflect the active category.

Note: replace the PR reference with the real pull request URL once PR #3 exists in your GitHub repo, so ContextQA can correlate the ticket to the code.
