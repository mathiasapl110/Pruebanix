# NIX GLOBAL TRADE

## Overview

Full-stack iPhone reseller website for NIX GLOBAL TRADE (Peru). Premium dark/gold design with complete e-commerce features including user auth, order management, and real-time order tracking.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/nix-global-trade)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (bcryptjs + jsonwebtoken)
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (for API), Vite (for frontend)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── nix-global-trade/   # React frontend (previewPath: /)
│   └── api-server/         # Express API server (previewPath: /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema + DB connection
├── vercel.json             # Vercel SPA config (framework: vite, rewrite all to /index.html)
└── pnpm-workspace.yaml
```

## Features

- **Home page**: Hero, About, Catalog (all iPhones), Gallery, Testimonials, Contact, Footer
- **Authentication**: Register/Login with JWT (stored in localStorage)
- **Order form**: Customers fill out name, DNI, phone, eBay tracking, product selection
- **My Orders**: Customers see their own orders with status badges
- **Order Tracking**: Step-by-step visual timeline (7 stages from Pedido Recibido to Entregado)
- **Admin panel**: View all orders, update tracking status step by step

## Database Tables

- `users` — customer accounts (isAdmin flag for admin access)
- `products` — iPhone catalog (15 products pre-seeded)
- `orders` — customer orders with status
- `tracking_steps` — per-order step-by-step tracking timeline
- `reviews` — testimonials (4 pre-seeded)

## API Routes

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — login
- `GET /api/auth/me` — get current user
- `POST /api/auth/logout` — logout
- `GET /api/products` — product catalog
- `POST /api/orders` — create order (auth required)
- `GET /api/orders` — my orders (auth required)
- `GET /api/orders/all` — all orders (admin only)
- `GET /api/orders/:id` — order + tracking steps
- `PATCH /api/orders/:id/tracking` — update tracking status (admin only)
- `GET /api/reviews` — testimonials

## Admin Access

To make a user an admin, update the database directly:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

## Vercel Deployment

The `vercel.json` at the root is configured for SPA deployment:
- framework: "vite"
- outputDirectory: "dist/public"
- Rewrites all routes to /index.html for client-side routing
