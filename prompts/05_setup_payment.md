Add PayPal payments to the VELOUR checkout. The InsForge backend (auth, products, carts, orders, /profile) is already connected — see `prompts/05_backend_database_and_auth.md` and the README Backend section. Keep the existing design; only touch what this flow needs.

BACKEND (InsForge CLI):
- `orders` table: add `payment_status` (text, default 'unpaid') and `payment_method` (text, default 'paypal').
- Order status flow becomes: pending (created, unpaid) → confirmed (paid) → shipped → delivered.
- RLS: add a policy so users can UPDATE their own orders (required to mark payment).

FLOW:
1. Place Order → create the order (status `pending`, payment_status `unpaid`) → redirect to `/payment/<orderId>`. Remove the payment-receipt upload from checkout — payment is PayPal now.
2. `/payment/[orderId]` — interstitial page: shows the order total, then redirects to the PayPal payment link (PayPal.me URL from env `NEXT_PUBLIC_PAYPAL_ME_URL`, amount appended, e.g. `https://paypal.me/@ai.with.hassan/49.99`). PayPal.me has no callback, so include a clear "I've paid — return to store" button pointing to `/payment/return?orderId=<id>`. If the env var is unset, skip the external redirect and show a "Simulate payment" button instead (demo mode).
3. `/payment/return` — on load, update the order via the SDK: `payment_status='paid'`, `status='confirmed'`; show a payment-success confirmation with the real order id and a link to `/profile`.
4. `/profile` — show a paid/unpaid badge per order; status tracker becomes pending → confirmed → shipped → delivered.

VERIFY (required): `npm run build` clean; on a production server run the full E2E — login → add to cart → checkout → order is pending/unpaid in the DB → PayPal interstitial → return → order shows confirmed + paid in `/profile` AND in the database. Set `NEXT_PUBLIC_PAYPAL_ME_URL` on the deployment (`npx @insforge/cli deployments env`), redeploy, and verify the live URL.
