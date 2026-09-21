# Setup checklist

The order matters: the platform link and https://github.com/hardip-varu/meridian-storefront/pull/1 need to exist before ContextQA can correlate everything.

## 1. GitHub
- Create a new repo (for example meridian-storefront) and push this code.
- Create https://github.com/hardip-varu/meridian-storefront/pull/1 for the category filter so SHOP-6 has something real to link to. Simplest path: make a branch that adds the category filter (it is already implemented on the home page), open a PR, and reference it. Or open a PR for any small change and reuse its number, then update SHOP-6 with the real URL.
- Optional: open 2 or 3 GitHub Issues as well, so GitHub is a fourth ticket source alongside Jira and Linear. Good candidates: a bug about the order confirmation page, a feature for wishlist. Only do this if you want to test GitHub Issues parsing too.

## 2. Deploy the platform link
- Import the repo into Vercel (zero config). Copy the deployed URL.
- Update the `servers` URL in `openapi.yaml` to the deployed URL.

## 3. Jira
- Create a project with key SHOP.
- Import `docs/jira-import.csv`, or create the six tickets by hand from `docs/jira-tickets.md`.
- Update SHOP-6 with the real https://github.com/hardip-varu/meridian-storefront/pull/1 URL.

## 4. Linear
- Create the new workspace you plan to connect.
- Create a team with key STORE.
- Create the six issues from `docs/linear-tickets.md`. I can create these through the Linear connector once the workspace and team exist and the connector can see them.

## 5. ContextQA onboarding
- Connect Slack (optional), Linear, Jira, and GitHub.
- Set the platform link to the deployed URL.
- If ContextQA supports swagger based API generation, also point it at `openapi.yaml`.
- Let it generate test cases.

## 6. Evaluate
- Follow `docs/TEST-GROUND-TRUTH.md`. Tag each generated case by source, mark expected cases covered or missed, and log extras.
- Pay attention to the mirrored Jira and Linear pairs, the swagger vs ticket API cases, the SHOP-5 and STORE-5 ambiguity probes, the SHOP-6 cross source link, and the STORE-6 dedup probe.
