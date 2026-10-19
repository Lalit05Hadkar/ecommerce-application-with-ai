# VELOUR

## YouTube Tutorial

[![Watch the VELOUR eCommerce tutorial on YouTube](https://img.youtube.com/vi/qLr-wwwNB4o/maxresdefault.jpg)](https://youtu.be/qLr-wwwNB4o)

Follow the complete build in the [YouTube video tutorial](https://youtu.be/qLr-wwwNB4o).

## Project Resources

| Resource | URL | Purpose |
| --- | --- | --- |
| YouTube tutorial | [https://youtu.be/qLr-wwwNB4o](https://youtu.be/qLr-wwwNB4o) | Video walkthrough for this project |
| Kimi | [https://platform.kimi.ai?track_id=track-1a3e07d8701646e1b04b9a4b690c921c](https://platform.kimi.ai?track_id=track-1a3e07d8701646e1b04b9a4b690c921c) | AI platform used to help plan and build the application |
| InsForge | [https://go.insforge.dev/aiwithhassanr1](https://go.insforge.dev/aiwithhassanr1) | Create the backend used for database and authentication |

VELOUR is a full-stack, premium fashion eCommerce storefront for women and men. It combines a custom responsive interface with a real InsForge backend for products, email/password authentication, synchronized carts, and customer orders. A demo PayPal.me-style payment confirmation flow is also included.

## Features

- Responsive editorial fashion storefront for desktop and mobile
- Women and men collections with subcategory filters and sorting
- Product search, product detail pages, image galleries, sizes, and quantities
- Guest cart persistence through browser `localStorage`
- Authenticated cart synchronization through InsForge
- Email/password registration, six-digit email verification, sign-in, and sign-out
- Authenticated checkout with contact and shipping validation
- Customer profile with order history and order status tracking
- InsForge Postgres database protected by row-level security policies
- Product CSV and image processing workflow
- Demo/manual PayPal payment confirmation flow
- Custom CSS design system with no UI kit or icon package

## Tech Stack

| Technology | Version/role |
| --- | --- |
| [Next.js](https://nextjs.org/) | `16.3.0`, App Router |
| [React](https://react.dev/) | `19.2.8` |
| [TypeScript](https://www.typescriptlang.org/) | Application types and configuration |
| [InsForge](https://go.insforge.dev/aiwithhassanr1) | Postgres database, authentication, and row-level security |
| [InsForge JavaScript SDK](https://www.npmjs.com/package/@insforge/sdk) | Browser-side backend client |
| [PayPal.Me](https://www.paypal.com/paypalme/) | Optional payment-link configuration for the demo flow |
| CSS | Custom responsive design system in `app/globals.css` |

## Prerequisites

Install or create the following before starting:

- [Node.js](https://nodejs.org/) 20 or newer
- npm, included with Node.js
- An [InsForge account/project](https://go.insforge.dev/aiwithhassanr1)
- An optional [PayPal.Me](https://www.paypal.com/paypalme/) link
- macOS `sips` only if you intend to run the included product image importer

The repository uses `package-lock.json`, so npm is the recommended package manager.

## Quick Start

1. Clone your copy of the repository and enter the project directory.

   ```bash
   git clone <your-repository-url>
   cd ecommerce-application
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root.

   ```dotenv
   NEXT_PUBLIC_INSFORGE_URL=https://your-project.region.insforge.app
   NEXT_PUBLIC_INSFORGE_ANON_KEY=your-anon-key

   # Optional. Use the base URL without a trailing slash or amount.
   NEXT_PUBLIC_PAYPAL_ME_URL=https://paypal.me/your-handle
   ```

4. Set up the InsForge database by following [Backend Setup](#backend-setup).

5. Start the development server.

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_INSFORGE_URL` | Yes | `https://your-project.region.insforge.app` | InsForge project API base URL |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | Yes | `ik_...` | Public anonymous key used by the browser SDK; access is restricted by grants and RLS |
| `NEXT_PUBLIC_PAYPAL_ME_URL` | No | `https://paypal.me/your-handle` | PayPal.Me base link shown by the demo payment screen |

All three variables are exposed to browser code because they use Next.js's `NEXT_PUBLIC_` prefix. Never put an InsForge admin key, PayPal secret, or another private credential in one of these variables. `.env.local` and `.insforge/` are ignored by Git and must not be committed.

## Backend Setup

### 1. Create or Link an InsForge Project

Create an account and project from the [InsForge project link](https://go.insforge.dev/aiwithhassanr1). This repository was developed against the `velour` project at:

```text
https://565htiv4.eu-central.insforge.app
```

Use your own project URL and anonymous key for a new installation. The hostname in `next.config.ts` currently permits images from the original project. If your product image URLs use a different InsForge hostname, replace that hostname in `images.remotePatterns`.

To manage the backend from the CLI, run:

```bash
npx -y @insforge/cli login
npx -y @insforge/cli link
npx -y @insforge/cli current
```

The CLI creates `.insforge/project.json` after linking. It contains project credentials and must remain uncommitted.

### 2. Apply the Database Migrations

The `migrations/` directory contains the complete application schema:

| Migration | Creates/changes |
| --- | --- |
| `20260811181906_velour-core.sql` | `products`, `carts`, and `orders`; foreign keys; grants; triggers; and initial RLS policies |
| `20260811211447_paypal-payments.sql` | Payment columns, the confirmed order state, and owner order updates |

Apply all pending migrations to the linked project:

```bash
npx -y @insforge/cli db migrations list
npx -y @insforge/cli db migrations up --all
```

The policies provide public product reads while restricting carts and orders to their authenticated owners.

### 3. Add Products

The storefront reads products from the InsForge `products` table through `lib/api.ts`. A fresh database therefore needs product rows before collection pages can display anything.

Each product follows this shape:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text | Unique URL-safe product identifier |
| `name` | text | Product display name |
| `category` | text | Must be `women` or `men` |
| `subcategory` | text | For example, `Dresses`, `Shirts`, or `Outerwear` |
| `price` | numeric | Current price |
| `compare_at_price` | numeric/null | Optional original price |
| `description` | text | Product description |
| `sizes` | JSON array | For example, `["S", "M", "L"]` |
| `images` | JSON array | Primary and hover image URLs |
| `featured` | boolean | Includes the item in featured results |
| `is_new` | boolean | Includes the item in new arrivals |
| `trending` | boolean | Includes the item in trending results |

Add rows through the InsForge dashboard or with an InsForge database import. Product image URLs must point to a hostname accepted by `next.config.ts`.

### 4. Configure Authentication

The app uses InsForge email/password authentication. Registration can require a six-digit verification code sent by email. Configure the authentication and email settings for your project in InsForge, then test the flow at [http://localhost:3000/login](http://localhost:3000/login).

The application supports:

- Account creation with name, email, and password
- Six-digit email verification and code resend
- Password sign-in and sign-out
- Protected checkout, profile, and payment pages
- Safe return to the originally requested page after login

## Application URLs

The local base URL is [http://localhost:3000](http://localhost:3000). Replace it with your deployment URL in production.

| Route | Example URL | Description |
| --- | --- | --- |
| `/` | [http://localhost:3000](http://localhost:3000) | Homepage with hero, collections, featured products, and promotions |
| `/women` | [http://localhost:3000/women](http://localhost:3000/women) | Women's collection |
| `/men` | [http://localhost:3000/men](http://localhost:3000/men) | Men's collection |
| `/women?sub=Dresses&sort=price-asc` | [Filtered women example](http://localhost:3000/women?sub=Dresses&sort=price-asc) | Collection filters and sorting |
| `/search?q=coat` | [Search example](http://localhost:3000/search?q=coat) | Product search results |
| `/product/[id]` | `http://localhost:3000/product/product-id` | Dynamic product detail page |
| `/cart` | [http://localhost:3000/cart](http://localhost:3000/cart) | Shopping cart |
| `/checkout` | [http://localhost:3000/checkout](http://localhost:3000/checkout) | Authenticated checkout |
| `/login` | [http://localhost:3000/login](http://localhost:3000/login) | Sign-in, registration, and email verification |
| `/profile` | [http://localhost:3000/profile](http://localhost:3000/profile) | Authenticated profile and order history |
| `/payment/[orderId]` | `http://localhost:3000/payment/order-uuid` | Authenticated payment interstitial |
| `/payment/return?orderId=[orderId]` | `http://localhost:3000/payment/return?orderId=order-uuid` | Manual payment confirmation return page |
| `/about` | [http://localhost:3000/about](http://localhost:3000/about) | Brand information |
| `/contact` | [http://localhost:3000/contact](http://localhost:3000/contact) | Contact page |
| `/privacy` | [http://localhost:3000/privacy](http://localhost:3000/privacy) | Privacy page |

Supported collection sort values are `featured`, `price-asc`, `price-desc`, and `newest`.

## Cart and Checkout Flow

1. Guests can add products to a cart, which persists in `localStorage` under `velour-cart`.
2. After sign-in, an empty remote cart receives the current guest cart. Future changes are written to the user's InsForge `carts` rows.
3. Checkout requires an authenticated account and a non-empty cart.
4. Orders use free shipping at `$75` or more; otherwise a flat `$8` shipping charge is applied.
5. Placing an order inserts an unpaid, pending row into `orders`, clears the cart, and opens `/payment/[orderId]`.
6. The payment return page marks the user's order as `paid` and `confirmed`.
7. The customer can track the order from `/profile`.

### Payment Safety Notice

The included payment flow is for demonstration purposes. PayPal.Me does not provide the server-verified callback used by this implementation, and the return page allows the authenticated order owner to mark an order as paid. Before accepting real payments, replace this with a server-side PayPal Checkout integration that creates orders securely, verifies captures/webhooks, and updates payment status with privileged server code.

## Product Import Workflow

The repository includes a local CSV/image processor for preparing product assets and typed product data.

1. Copy the template if you are starting from scratch.

   ```bash
   cp incoming/listings-template.csv incoming/listings.csv
   ```

2. Add one product per row to `incoming/listings.csv`.
3. Place referenced product photos in `incoming/images/`.
4. Run the importer.

   ```bash
   npm run import-listings
   ```

The importer:

- Validates required fields and category values
- Generates collision-safe product IDs from names
- Uses macOS `sips` to convert images to JPEG with a maximum dimension of 1400 pixels
- Writes optimized files to `public/images/products/`
- Uses `public/images/placeholder.svg` when a required image is missing
- Regenerates `lib/generated-products.ts`

See `incoming/README.md` for the full CSV column reference.

Important: `npm run import-listings` prepares local files only. The live storefront currently queries the InsForge `products` table, so import or insert the generated product records into InsForge as a separate backend step.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run import-listings` | Validate CSV listings and regenerate local product assets/data |

## Project Structure

```text
app/
  about/                 Brand page
  cart/                  Shopping cart
  checkout/              Authenticated shipping and order creation
  contact/               Contact page
  login/                 Sign-in, sign-up, and email verification
  men/                    Men's listing page
  payment/               Payment interstitial and return flow
  privacy/               Privacy page
  product/[id]/           Dynamic product detail page
  profile/                Account and order history
  search/                 Search results
  women/                  Women's listing page
  globals.css             Global design system and responsive styles
  layout.tsx              Root providers, navigation, footer, and metadata
  page.tsx                Homepage
components/               Shared storefront and interactive components
incoming/                 Product CSV, image drop folder, and import guide
lib/
  api.ts                  InsForge product query service
  auth.tsx                Authentication context
  data.ts                 Local catalogue metadata and subcategory source
  generated-products.ts   Generated output from the listing importer
  insforge.ts             Shared InsForge SDK client
  store.tsx               Local cart state and authenticated remote sync
  types.ts                Shared product types
migrations/               InsForge SQL schema and RLS migrations
prompts/                  Original staged build prompts
public/                   Static product images, hero media, and placeholders
scripts/import-listings.mjs
                          CSV validation and image processing script
```

## Deployment

### InsForge Hosting

Build locally first:

```bash
npm run lint
npm run build
```

Configure persistent deployment environment variables for the linked project:

```bash
npx -y @insforge/cli deployments env set NEXT_PUBLIC_INSFORGE_URL https://your-project.region.insforge.app
npx -y @insforge/cli deployments env set NEXT_PUBLIC_INSFORGE_ANON_KEY your-anon-key
npx -y @insforge/cli deployments env set NEXT_PUBLIC_PAYPAL_ME_URL https://paypal.me/your-handle
npx -y @insforge/cli deployments env list
```

Then deploy the project source directory:

```bash
npx -y @insforge/cli deployments deploy .
```

The deployment command returns the live application URL. Do not deploy `.next/`; deploy the source root so the hosting platform can build it with the configured environment variables.

### Other Next.js Hosts

For Vercel or another Next.js-compatible provider:

1. Import the repository.
2. Add every required environment variable in the provider dashboard.
3. Use `npm run build` as the build command.
4. Deploy and use the assigned production URL as the application base URL.

## Verification Checklist

After setup or deployment, verify the following:

- `npm run lint` succeeds
- `npm run build` succeeds
- Home, women, men, search, and product pages load database products
- A new user receives and can submit an email verification code
- Sign-in and sign-out work
- A guest cart persists after a refresh
- A signed-in cart appears after signing in on another session
- Checkout creates a pending and unpaid order
- The payment return page changes it to confirmed and paid
- `/profile` displays only the signed-in user's orders
- Another account cannot read or modify the first user's cart or orders

## Troubleshooting

### Collection pages are empty

Confirm that `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY` are correct, migrations were applied, and the `products` table contains rows. Browser console errors from `getProducts` usually include the backend error message.

### Product images fail to render

Add the image host to `images.remotePatterns` in `next.config.ts`, then restart the development server or redeploy. Local files should be placed below `public/` and referenced from the public root, such as `/images/products/item-1.jpg`.

### Registration does not send a code

Check the project's InsForge authentication verification and email configuration. Also verify that the browser is using the intended InsForge project URL and anonymous key.

### Cart does not synchronize

Remote cart synchronization only runs for authenticated users. Confirm that the core migration and RLS policies are applied. The guest cart remains available locally even if a remote write fails.

### Build works locally but deployment fails

Run `npx -y @insforge/cli deployments env list` and confirm all required variables exist in the deployment environment. Local `.env.local` files are intentionally excluded from deployment uploads.

### Listing import fails on Linux or Windows

The image optimizer calls the macOS-only `sips` command. Run the importer on macOS or replace `optimizeImage()` in `scripts/import-listings.mjs` with a cross-platform image processor such as Sharp.

## External Services and URLs

- Tutorial: [https://youtu.be/qLr-wwwNB4o](https://youtu.be/qLr-wwwNB4o)
- Kimi: [https://platform.kimi.ai?track_id=track-1a3e07d8701646e1b04b9a4b690c921c](https://platform.kimi.ai?track_id=track-1a3e07d8701646e1b04b9a4b690c921c)
- InsForge signup/project link: [https://go.insforge.dev/aiwithhassanr1](https://go.insforge.dev/aiwithhassanr1)
- Original InsForge API base: [https://565htiv4.eu-central.insforge.app](https://565htiv4.eu-central.insforge.app)
- Local application: [http://localhost:3000](http://localhost:3000)
