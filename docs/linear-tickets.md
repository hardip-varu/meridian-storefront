# Linear tickets: team STORE

Create these in the new Linear workspace you connect to ContextQA, in a team with key STORE. Keep the titles and descriptions close to this wording so the ground truth mapping holds.

I can create these issues for you through the Linear connector once the new workspace and STORE team exist and the connector has access to them. Tell me the workspace and team and I will populate them.

---

## STORE-1  Signup with validation
Type: Feature
Labels: auth, signup

Description:
New customers can create an account. The form validates input and rejects an email that is already registered.

Acceptance criteria:
- Given valid name, email, and password (6 or more characters), when submitted, then the account is created (201) and the user is logged in.
- Given the email existing@example.com, when submitted, then the API returns 409 and the screen shows that the account already exists.
- Given a password shorter than 6 characters, when submitted, then a password error is shown.
- Given an invalid email format, when submitted, then an email error is shown.
- Given a missing name, when submitted, then a name error is shown.

---

## STORE-2  Out of stock product must not be addable
Type: Bug
Labels: cart, catalogue, regression

Description:
Reported: an out of stock product could be added to the cart in an earlier build.

Steps to reproduce:
1. Open the product Kenya Nyeri AA (id p10), which is out of stock.
2. Try to add it to the cart from both the catalogue card and the detail page.

Expected: the product shows an out of stock badge, the Add to cart button is disabled, and the product cannot be added.

Cover with a regression test asserting the disabled state on both the card and the detail page.

---

## STORE-3  Products list API search and category params
Type: Feature
Labels: api, catalogue

Description:
GET /api/products supports optional search and category query parameters.

Acceptance criteria:
- With no parameters, returns all 10 products and a count field.
- ?search=colombia returns Colombia Huila.
- ?category=equipment returns the 2 equipment products.
- search and category parameters combine.
- A query that matches nothing returns count 0 and an empty products array.

---

## STORE-4  Admin add product requires authentication
Type: Feature
Labels: admin, auth, negative

Description:
Only an authenticated admin can create a product via POST /api/admin/products. Input is validated.

Acceptance criteria:
- A request with no Authorization Bearer header returns 401.
- A request with a Bearer token and a valid body (name, valid category, price greater than 0) returns 201.
- An invalid or unknown category returns 400.
- A price of 0 or a non numeric price returns 400.
- Visiting the /admin page while logged out shows a locked state with a prompt to log in.

---

## STORE-5  Make the store faster
Type: Feature
Labels: performance

Description:
The store feels slow sometimes. Let us make it faster.

(Intentionally vague and non functional. No acceptance criteria.)

---

## STORE-6  Customers can search the catalogue
Type: Feature
Labels: search, catalogue

Description:
Shoppers should be able to search the product catalogue by keyword and see only matching products, with a clear message when nothing matches.

(This intentionally overlaps SHOP-1 in Jira. It exists to test how ContextQA deduplicates coverage across two connected sources.)
