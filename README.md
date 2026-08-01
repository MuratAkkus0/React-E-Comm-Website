# E-Shop — a full-stack e-commerce application

A complete, self-contained e-commerce application: a real Express/PostgreSQL
backend with authentication, a persistent cart, orders with a proper state
machine, reviews, and an admin area — paired with a React frontend. Nothing
in this repository depends on a third-party demo API.

This project was built as a portfolio piece, so the priorities are the ones
that separate a real e-commerce backend from a demo: correct money handling,
race-safe stock, an explicit order lifecycle, and authorization that is
actually enforced server-side.

## What it is

- Product catalog with categories, full-text search, price filtering,
  sorting and **server-side** pagination.
- Email/password auth with short-lived JWT access tokens and rotating
  httpOnly refresh tokens.
- A cart that lives in the database once you're signed in, and in
  `localStorage` while you're anonymous — the two are merged the moment you
  log in.
- Checkout that recomputes the total from the database, decrements stock
  inside a transaction, and never trusts anything the client sent.
- A five-state order lifecycle (`PENDING → PAID → SHIPPED → DELIVERED`, plus
  `CANCELLED`) enforced in the service layer, not just the UI.
- Product reviews restricted to buyers who actually paid for the product,
  one review per user per product.
- An admin area for product/category/stock management and order fulfillment.
- A small, documented design system (palette, type scale, spacing, focus
  states, skeleton/empty/error states) instead of ad-hoc CSS.

## Architecture

A pnpm workspace monorepo:

```
apps/web/         React 18 + Vite 6 + Redux Toolkit (RTK Query) frontend
apps/api/         Express 5 + TypeScript + Prisma + PostgreSQL backend
packages/shared/  zod schemas + inferred TS types, imported by BOTH apps
```

`packages/shared` is the important part: every request body the API
validates with zod is the *same* schema the frontend uses to validate a form
before it ever sends the request. There is exactly one definition of "what a
valid registration/product/review looks like" in this codebase.

### Backend module layout

The API is organized by **feature module**, not by technical layer:

```
apps/api/src/
  modules/<feature>/
    <feature>.routes.ts       HTTP wiring only — no business logic
    <feature>.controller.ts   req/res translation only — no business logic
    <feature>.service.ts      business logic — the real value lives here
    <feature>.repository.ts   Prisma access, nothing else
  middleware/                 auth, validation, rate limiting, error handling
  config/                     env parsing, logger
```

Modules: `auth`, `products`, `categories`, `cart`, `orders` (+ `orders/payment`,
the mock payment boundary), `reviews`, `admin`.

Hard rule followed throughout: controllers never contain business logic,
and services never see `req`/`res` — they take plain arguments and return
plain data or throw a typed `AppError`.

## Data model

```
User            id, email (unique), passwordHash, name, role (USER|ADMIN)
RefreshToken    id, userId, tokenHash (unique), expiresAt, revokedAt
Category        id, name (unique), slug (unique)
Product         id, name, slug (unique), description, priceCents, currency,
                 stock, isActive, ratingAvg, ratingCount, categoryId
CartItem        id, userId, productId, quantity   — unique (userId, productId)
Order           id, userId, status, totalCents, currency, shippingAddress,
                 paymentRef
OrderItem       id, orderId, productId, productName, unitPriceCents, quantity
                 (name/price are snapshots — an order never changes retroactively
                 if the product's name or price changes later)
Review          id, userId, productId, rating, comment
                 — unique (userId, productId)
```

See `apps/api/prisma/schema.prisma` for the full schema with indexes.

**Note on the generated Prisma client**: the schema customizes the
generator `output` to `apps/api/src/generated/prisma` (kept out of
`node_modules`, mirroring the reference project this backend's Prisma/JWT
setup was modeled on). Because that output lives outside `node_modules`,
its own runtime dependency, `@prisma/client-runtime-utils`, is not
reachable through Node's normal upward `node_modules` search — it is
therefore listed as an explicit direct dependency of `@ecomm/api` so pnpm
symlinks it where Node can find it. If you ever see `Cannot find module
'@prisma/client-runtime-utils'` after touching the Prisma generator config,
this is why.

## Money — always integer minor units, never a float

Every price is stored as `priceCents: Int` (an integer number of minor
currency units, e.g. cents) plus an explicit `currency` string. There is no
`Float`/`Decimal` price field anywhere in the schema. All arithmetic
(line totals, order totals, revenue aggregation) happens as integer
arithmetic in the database or in the service layer — never in the client,
and never as floating point.

The client never computes a total the server trusts. `POST /api/orders`
(checkout) takes **no price or total field at all** — only a shipping
address. The service reloads the caller's cart from the database, reads the
*current* `priceCents` of every product, and computes the total itself. If
you resend a stale request with a stale price in the payload, it's ignored;
there's nowhere in the request to even put one.

## Stock — race-safe by construction

Requirement: two customers racing for the last unit of a product must never
both succeed.

Each stock decrement at checkout is a single conditional SQL `UPDATE`:

```sql
UPDATE "Product" SET stock = stock - :quantity
WHERE id = :productId AND stock >= :quantity
```

(`products.repository.ts#applyStockDelta`, run inside `orders.service.ts#checkout`'s
Prisma transaction.) PostgreSQL takes a row lock on the first UPDATE that
reaches it; a second concurrent UPDATE for the same product blocks until the
first commits, then re-evaluates its own `WHERE` clause against the
now-updated row. If stock has run out, the affected row count is `0` and the
service throws a `409 Conflict` and rolls back that order — no oversell, no
`SERIALIZABLE` isolation level required, no polling/retry loop papering over
a race.

This is exercised by an integration test that fires two real concurrent
checkout requests at a product with `stock = 1` and asserts exactly one
succeeds and the final stock is `0`:
`apps/api/tests/orders.oversell.test.ts`.

## Order lifecycle

```
PENDING -> PAID -> SHIPPED -> DELIVERED
   |         |
   +--> CANCELLED <--+
```

The allowed-transitions table lives in `orders.service.ts` and is checked on
every transition regardless of which route triggered it:

- `POST /api/orders` (checkout) creates a `PENDING` order and decrements
  stock, in one transaction.
- `POST /api/orders/:id/pay` (owner only) runs the mock payment step and
  moves `PENDING -> PAID`.
- `PATCH /api/orders/:id/cancel` (owner or admin) moves `PENDING`/`PAID ->
  CANCELLED` and **restocks** every line.
- `PATCH /api/orders/:id/status` (admin only) moves `PAID -> SHIPPED` or
  `SHIPPED -> DELIVERED`.

Any other transition (e.g. `PAID -> DELIVERED` directly, or anything once a
order is `CANCELLED`/`DELIVERED`) is rejected with `409 Conflict` by the
service — this is enforced independently of the UI, and independently of
which endpoint is called.

## Authorization

- `GET /api/orders/:id` and the cancel/pay endpoints load the order, then
  check `order.userId === requester.id || requester.role === 'ADMIN'`. A
  request for someone else's order returns **404**, not 403 — this avoids
  confirming to an attacker that a given order id even exists.
- Admin-only routes (product/category CRUD, stock adjustment, order status
  transitions, `/api/admin/*`) are guarded by a `requireAdmin` middleware
  that runs after `requireAuth`.
- This is proved with tests, not just asserted: `apps/api/tests/orders.authorization.test.ts`
  registers two users, has one place an order, and asserts the other gets
  404 on read and on cancel, and that an unauthenticated request gets 401.

## Payment — clearly mocked, one file away from real

Payments are **not** integrated with a real provider. `POST
/api/orders/:id/pay` runs `MockPaymentProvider#charge()`
(`apps/api/src/modules/orders/payment/mock-payment.provider.ts`), which
always succeeds immediately and never makes a network call.

The order service only ever talks to the `PaymentProvider` interface
(`payment.provider.ts`), resolved through a single export in
`payment/index.ts`:

```ts
export const paymentProvider: PaymentProvider = new MockPaymentProvider();
```

Swapping in a real provider (e.g. Stripe PaymentIntents) means writing one
new class that implements `PaymentProvider` and changing that one line —
the rest of the codebase (routes, controller, service, tests) is unaffected.

## Design system

Documented in `apps/web/src/styles/tokens.css` as CSS custom properties, and
mirrored in `packages/shared/src/design-tokens.ts` for the one thing the
server also needs to agree on: product placeholder colors.

- **Palette**: a small brand palette (deep green/orange/blue/plum/etc.) with
  a dark "ink" neutral scale for text and borders. Primary buttons use
  `--color-brand-600` (not the brighter `-500`) specifically because it
  passes WCAG AA contrast (≈6:1) for white text, verified by hand — `-500`
  alone would not.
- **Type scale**: a documented `--font-size-xs` … `--font-size-2xl` scale,
  used everywhere instead of ad-hoc `rem` values.
- **Spacing**: a 4px-based `--space-1` … `--space-8` scale.
- **Focus states**: a single `:focus-visible` rule gives every interactive
  element a visible 3px outline — never suppressed.
- **Loading/empty/error states**: shared `Skeleton`, `EmptyState`, `ErrorState`
  and `Spinner` components (`apps/web/src/components/ui/`) are used on every
  data-fetching page instead of a spinner-or-nothing pattern.
- **Product imagery**: there is no photography and no broken `<img>` tags.
  Every product is rendered as a small SVG: a palette color deterministically
  hashed from the product's slug (`pickPlaceholderColor`, shared by both
  apps) with the product's initial on top. Same product → same image, every
  time, everywhere it's shown.
- **Responsive**: the catalog grid, header, cart, checkout and admin tables
  all have explicit breakpoints down to small mobile widths.

## Local setup

Requirements: Node ≥ 20, pnpm, and either a local PostgreSQL instance or
Docker.

```bash
pnpm install                     # installs all workspaces, builds packages/shared
cp apps/api/.env.example apps/api/.env   # edit DATABASE_URL if not using the default

# start Postgres only, via docker compose (host port 5434 -> container 5432)
docker compose up -d db

cd apps/api
pnpm db:migrate                 # applies prisma/migrations
pnpm db:seed                    # realistic catalog + an admin and a demo user

pnpm dev                        # API on http://localhost:9000

# in another terminal
cd apps/web
pnpm dev                        # web on http://localhost:5173, proxies /api to the API
```

Seeded accounts (see `apps/api/prisma/seed.ts`):

| Role  | Email               | Password     |
| ----- | ------------------- | ------------ |
| Admin | admin@example.com    | Admin1234!   |
| User  | demo@example.com     | Demo1234!    |

### Everything in Docker

```bash
docker compose up --build
```

This starts Postgres, runs `prisma migrate deploy` and boots the API on
`:9000`, and builds/serves the web app behind nginx on `:8080` (nginx proxies
`/api/*` to the API container, so the browser only ever talks to one
origin). Seed manually once the containers are up:

```bash
docker compose exec api pnpm exec tsx prisma/seed.ts
```

## Environment variables

`apps/api/.env` (see `apps/api/.env.example`):

| Variable                 | Purpose                                              |
| ------------------------ | ----------------------------------------------------- |
| `PORT`                   | API port (default `9000`)                             |
| `DATABASE_URL`           | PostgreSQL connection string                          |
| `ACCESS_TOKEN_SECRET`    | HMAC secret for short-lived JWT access tokens          |
| `ACCESS_TOKEN_TTL`       | e.g. `15m`                                             |
| `REFRESH_TOKEN_TTL_DAYS` | e.g. `7`                                               |
| `CORS_ORIGIN`            | Comma-separated allowed origins (only relevant if the web app is *not* proxied through the same origin) |

Auth model: the access token is a signed JWT (`sub`, `role`), sent as
`Authorization: Bearer <token>` and kept in memory (Redux) on the client —
never in `localStorage`. The refresh token is an opaque random string, sent
as an httpOnly, `SameSite=Lax`, path-scoped (`/api/auth`) cookie; only its
SHA-256 hash is stored in the database (`RefreshToken.tokenHash`), so a
leaked DB dump cannot be replayed. Refresh tokens rotate on every use.

## API reference

All routes are prefixed with `/api`. Auth: `Authorization: Bearer <accessToken>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | Create an account |
| POST | `/auth/login` | — | Log in |
| POST | `/auth/refresh` | refresh cookie | Rotate refresh token, issue new access token |
| POST | `/auth/logout` | refresh cookie | Revoke the refresh token |
| GET | `/auth/me` | user | Current profile |
| GET | `/categories` | — | List categories |
| POST/PATCH/DELETE | `/categories[/:id]` | admin | Category CRUD |
| GET | `/products` | — | Search/filter/sort/paginate |
| GET | `/products/:idOrSlug` | — | Product detail |
| POST/PATCH/DELETE | `/products[/:id]` | admin | Product CRUD |
| PATCH | `/products/:id/stock` | admin | Adjust stock by a signed delta |
| GET | `/products/:id/reviews` | — | List reviews |
| POST | `/products/:id/reviews` | user (must have paid for the product) | Create a review |
| GET | `/cart` | user | Get persistent cart |
| POST | `/cart/items` | user | Add an item |
| PATCH | `/cart/items/:productId` | user | Set quantity (0 removes) |
| DELETE | `/cart/items/:productId` | user | Remove an item |
| DELETE | `/cart` | user | Clear cart |
| POST | `/cart/merge` | user | Merge a guest cart in on login |
| POST | `/orders` | user | Checkout: recomputes total, decrements stock |
| GET | `/orders` | user | List own orders |
| GET | `/orders/:id` | user (owner) or admin | Order detail |
| POST | `/orders/:id/pay` | user (owner) | Mock payment, `PENDING -> PAID` |
| PATCH | `/orders/:id/cancel` | user (owner) or admin | `-> CANCELLED`, restocks |
| PATCH | `/orders/:id/status` | admin | `PAID -> SHIPPED -> DELIVERED` |
| GET | `/admin/stats` | admin | Revenue, order counts, low-stock products |
| GET | `/admin/orders` | admin | All orders, filterable by status |

## Running the tests

```bash
docker compose up -d db          # a reachable Postgres is required
cd apps/api
pnpm db:migrate                  # migrations must be applied first
pnpm test
```

This runs, among others:

- `tests/orders.oversell.test.ts` — the concurrent-checkout oversell test.
- `tests/orders.authorization.test.ts` — cross-user order access (404/401),
  owner access (200).
- `tests/reviews.test.ts` — review gating (must have paid for the product,
  one review per user per product).

Real output from the last run in this environment:

```
 ✓ tests/reviews.test.ts (2 tests) 586ms
 ✓ tests/orders.oversell.test.ts (1 test) 577ms
 ✓ tests/orders.authorization.test.ts (4 tests) 599ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
```

## Other scripts

```bash
pnpm -r run typecheck    # shared + api (the web app is plain JS by convention, matching the original codebase)
pnpm -r run lint         # all three packages
pnpm run build           # shared -> api -> web, in dependency order
```

## What's intentionally out of scope

- Real payment processing (see "Payment" above — this is a deliberate,
  documented boundary, not an oversight).
- Email delivery (password reset, order confirmation emails).
- Automated frontend tests (the original codebase had none; backend tests
  cover the correctness-critical paths — money, stock, authorization, order
  state — which is where a demo e-commerce app most commonly gets things
  wrong).
