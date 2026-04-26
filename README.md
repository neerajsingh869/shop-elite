# ShopElite 🛍️

A full-stack e-commerce web application featuring **AI-powered natural language search**, a secure JWT authentication system with Google OAuth, and a polished, fully typed React frontend — built as a portfolio-grade project to demonstrate real-world engineering decisions.

---

## ✨ What Makes This Interesting

### 🤖 LLM-Powered Search

Type the way you think. ShopElite's search bar understands natural language and translates it into structured filters behind the scenes — no rigid keyword matching required.

```
"cheap apple phones under 1000 dollars"
→ { keyword: "phone", brand: "Apple", maxPrice: 1000, sortBy: "price_asc" }

"highly rated beauty products under 50"
→ { keyword: "beauty", category: "beauty", maxPrice: 50, sortBy: "rating_desc" }

"in stock samsung phones"
→ { keyword: "phone", brand: "Samsung", availabilityStatus: "In Stock" }
```

- Powered by **Groq SDK** (OpenAI-compatible API)
- Extracted filters are displayed as tags in the UI so users understand exactly what the model interpreted
- Graceful degradation: if the LLM call fails for any reason, the app silently falls back to keyword-only search and surfaces a friendly notice
- Debounced requests (300ms) with `AbortController` to cancel in-flight requests on each keystroke

### 🔐 Production-Grade Authentication

A lot of projects stop at "store the JWT in localStorage." This one goes further:

- **Refresh token rotation** — every refresh issues a new pair of tokens and revokes the old one
- **Token reuse detection** — if a refresh token is used after already being rotated (a sign of theft), _all_ sessions for that user are immediately revoked
- **Refresh tokens stored as hashes** — the database never stores raw tokens; even a full DB leak exposes nothing usable
- **Google OAuth** — accounts created via Google are automatically linked if an email-matching record already exists
- **HTTP-only cookies** — tokens never touch JavaScript on the client

---

## 🗂️ Project Structure

This is a **pnpm monorepo** with a clear client/server split:

```
shop-elite/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── features/           # Feature-scoped types (auth)
│       ├── pages/              # Route-level components
│       │   ├── HomePage/
│       │   ├── ProductListingPage/
│       │   ├── ProductDetailPage/
│       │   ├── LoginPage/
│       │   └── RegisterPage/
│       ├── routes/             # React Router config (lazy-loaded)
│       └── shared/
│           ├── components/     # Header, SearchBar, UI primitives
│           ├── hooks/          # useFetch, useSearch, useScrollToTop
│           ├── utils/          # debounce, slug helpers
│           └── types/          # API response types
│
└── server/                     # Express backend
    └── src/
        ├── features/
        │   ├── auth/           # controller, service, routes
        │   └── products/       # controller, service, LLM layer, routes
        ├── middlewares/        # JWT authentication guard
        ├── utils/              # JWT, bcrypt, cookie helpers
        ├── config/             # Env validation
        └── lib/                # Prisma client singleton
```

The folder structure follows a **feature-based** convention — every feature owns its controller, service, and routes in one place. Shared utilities and UI live in `shared/`.

---

## 🧰 Tech Stack

### Frontend

| Technology            | Purpose                                     |
| --------------------- | ------------------------------------------- |
| React 19              | UI framework                                |
| TypeScript 5.9        | Type safety across the entire codebase      |
| Vite 7                | Build tool and dev server                   |
| Tailwind CSS v4       | Utility-first styling                       |
| React Router v7       | Client-side routing with lazy-loaded routes |
| Redux Toolkit         | Global state management                     |
| React Hook Form + Zod | Form handling with schema validation        |
| Axios                 | HTTP client for LLM search endpoint         |
| Lucide React          | Icon library                                |

### Backend

| Technology            | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| Node.js + Express 5   | Server framework                               |
| TypeScript 5.9        | End-to-end type safety                         |
| Prisma 7 + PostgreSQL | ORM and relational database                    |
| Groq SDK              | LLM API for natural language filter extraction |
| JSON Web Tokens       | Access + refresh token auth                    |
| bcryptjs              | Password hashing                               |
| Zod                   | Request body validation                        |
| Helmet                | Security headers                               |
| express-rate-limit    | Rate limiting                                  |
| cookie-parser         | HTTP-only cookie parsing                       |

---

## 🌐 Pages & Features

### Home Page — Category Browse

- Displays all product categories in a responsive grid
- Each category card links to its product listing

### Product Listing Page — Browse by Category

- Sidebar filter panel with:
  - Price range slider
  - Minimum rating filter
  - Minimum discount filter
  - Brand multi-select
  - In-stock toggle
- All filters are applied client-side (no extra API calls)
- Dynamic product count badge updates in real-time as filters change

### Product Detail Page — Deep Product View

- Image gallery with multiple product images
- Full product metadata (SKU, weight, dimensions, warranty, shipping info, return policy)
- Reviews section with ratings and reviewer info
- Related tags display
- Dedicated error and "not found" states

### Search Modal — AI Search

- Triggered from the header's search icon
- Locks body scroll while open, closes on backdrop click or Escape
- Streamed LLM results with skeleton loading
- Extracted filter tags shown above results
- Empty state and error states handled

### Login / Register

- Email + password flows with client-side Zod validation
- Google OAuth via `@react-oauth/google`
- Form errors surfaced inline

---

## ⚙️ Architecture Decisions Worth Noting

**Skeleton loading everywhere** — Every data-fetching component has a purpose-built skeleton (`*Skeleton.tsx`). The loading experience is polished and avoids layout shift.

**Custom `useFetch` hook** — A thin, reusable data-fetching hook using the native `fetch` API with `AbortController` cleanup, reset-on-URL-change behavior, and typed generic returns.

**Custom `useSearch` hook** — Wraps the LLM search endpoint with debouncing, request cancellation, and state management so the search modal component stays purely presentational.

**In-memory metadata cache** — Product categories, brands, and availability statuses are fetched once and cached in memory on the server. This prevents a redundant DB round-trip on every LLM search request.

**Code-split routing** — All pages are `React.lazy()` wrapped and rendered inside a `<Suspense>` boundary, so each page is a separate JS chunk downloaded only when visited.

**Monorepo with pnpm workspaces** — `client` and `server` are independent packages sharing a single `pnpm-lock.yaml`. Running both dev servers from root requires a single command.

---

## 🗄️ Data Model

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  passwordHash  String?        // null for Google-only accounts
  googleId      String?        @unique
  avatarUrl     String?
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique   // raw token is never stored
  userId    String
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  userAgent String?
  ipAddress String?
}

model Product {
  id                   Int
  title                String
  category             String
  price                Decimal
  discountPercentage   Decimal
  rating               Float
  brand                String?
  tags                 String[]
  images               String[]
  reviews              Review[]
  // + full product metadata fields
}
```

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Auth   | Description                 |
| ------ | ----------- | ------ | --------------------------- |
| `POST` | `/register` | —      | Create a new account        |
| `POST` | `/login`    | —      | Email/password login        |
| `POST` | `/google`   | —      | Google OAuth login/register |
| `POST` | `/refresh`  | Cookie | Rotate refresh token        |
| `POST` | `/logout`   | Cookie | Revoke refresh token        |
| `GET`  | `/me`       | Bearer | Get current user            |

### Products — `/api/products`

| Method | Endpoint      | Description                                     |
| ------ | ------------- | ----------------------------------------------- |
| `GET`  | `/search`     | Filter products by structured query params      |
| `POST` | `/llm-search` | Natural language search (LLM filter extraction) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL instance

### 1. Clone & Install

```bash
git clone https://github.com/your-username/shop-elite.git
cd shop-elite
pnpm install
```

### 2. Configure Environment Variables

**Server** — create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shopelite"
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
GROQ_API_KEY="your-groq-api-key"
CLIENT_URL="http://localhost:5173"
PORT=3000
```

**Client** — create `client/.env`:

```env
VITE_API_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id"
```

### 3. Set Up the Database

```bash
cd server
pnpm prisma migrate dev   # Apply migrations
pnpm seed                 # Seed product data from DummyJSON API
```

### 4. Run

```bash
# From project root — starts both client and server concurrently
pnpm dev
```

Client runs at `http://localhost:5173` · Server runs at `http://localhost:3000`

---

## 🗺️ What's Next (Planned)

- [ ] Product listing page + pagination
- [ ] All products page `/products` + pagination + virtualization
- [ ] Product detail page + infinite scroll reviews
- [ ] Search modal virtualization
- [ ] Search results page `/search` + infinite scroll
- [ ] Cart — backend + frontend + Redux + optimistic UI
- [ ] Orders — backend + frontend
