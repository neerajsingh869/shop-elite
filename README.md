# ShopElite 🛍️

A full-stack e-commerce web application featuring **AI-powered natural language search**, production-grade JWT authentication with Google OAuth, custom virtualized rendering, and a fully typed React + Express codebase — built as a portfolio-grade project demonstrating real-world engineering decisions at every layer.

**Live:** https://shopelite-ui.vercel.app &nbsp;|&nbsp; **API:** https://shop-elite-api.onrender.com

> ⚠️ Backend runs on Render's free tier. The first request after a period of inactivity may take ~30 seconds to wake up.

---

## ✨ What Makes This Interesting

### 🤖 LLM-Powered Natural Language Search

Type the way you think. ShopElite's search understands natural language and translates it into structured filters — no rigid keyword matching required.

```
"cheap apple phones under 1000 dollars"
→ { keyword: "phone", brand: "Apple", maxPrice: 1000, sortBy: "price_asc" }

"highly rated beauty products under 50"
→ { keyword: "beauty", category: "beauty", maxPrice: 50, sortBy: "rating_desc" }

"in stock samsung phones"
→ { keyword: "phone", brand: "Samsung", availabilityStatus: "In Stock" }
```

- Powered by **Groq SDK** (blazing-fast LLM inference)
- Extracted filters displayed as tags so users see exactly what the model interpreted
- **Graceful degradation** — if the LLM call fails, the app silently falls back to keyword-only search with a friendly notice. The product experience never breaks.
- **Cursor-based infinite scroll** — search results paginate on demand without losing position
- **Debounced requests (300ms)** with `AbortController` to cancel in-flight requests on each keystroke
- **In-memory metadata cache** — categories, brands, and availability statuses are fetched once and cached on the server. Every LLM search call gets fresh context without a DB round-trip.
- **`Ctrl+K` / `Cmd+K`** keyboard shortcut to open the search modal from anywhere in the app

### 🔐 Production-Grade JWT Authentication

A lot of projects stop at "store the JWT in localStorage." This one goes further:

- **Dual-token architecture** — short-lived access tokens (15 min) for stateless request verification + long-lived refresh tokens (7 days) for session continuity
- **Refresh token rotation** — every refresh issues a new pair of tokens and revokes the old one; tokens are single-use
- **Token reuse detection** — if a previously rotated token is presented again (a sign of theft), *all* sessions for that user are immediately revoked
- **Tokens stored as SHA-256 hashes** — the database never holds raw tokens; a full DB breach exposes nothing usable
- **Google OAuth** — accounts created via Google are automatically linked if an email-matching record already exists
- **httpOnly cookies** — refresh tokens never touch JavaScript; immune to XSS attacks
- **Silent refresh via Axios interceptors** — when an access token expires, the interceptor catches the 401, silently refreshes in the background, and retries the original request. Users never see a logout.
- **Concurrent request queue** — if multiple requests expire simultaneously, only one refresh call is made. All others wait in a queue and are retried once the new token arrives.

### ⚡ Custom Virtualized Grid

The All Products page renders hundreds of product cards using a **from-scratch virtualization implementation** — no react-window or react-virtual dependency.

- Calculates visible rows based on scroll position, container height, and measured row height
- Uses `ResizeObserver` to measure actual rendered row height dynamically
- Renders only the items in the viewport plus a small overscan buffer
- Handles dynamic column counts across breakpoints

---

## 🗂️ Project Structure

This is a **pnpm monorepo** with a clear client/server split:

```
shop-elite/
├── client/                         # React frontend (Vite)
│   └── src/
│       ├── features/
│       │   ├── auth/               # Auth slice, thunks, selectors, hooks, pages
│       │   │   ├── authSlice.ts    # Redux state shape + reducers
│       │   │   ├── authThunks.ts   # Async operations (login, logout, refresh)
│       │   │   ├── authSelectors.ts
│       │   │   ├── hooks.ts        # useAuth, useInitAuth
│       │   │   ├── api.ts
│       │   │   ├── LoginPage.tsx
│       │   │   └── RegisterPage.tsx
│       │   └── products/
│       │       └── product.types.ts
│       ├── pages/
│       │   ├── HomePage/           # Category grid
│       │   ├── ProductListingPage/ # Filtered product browse
│       │   ├── ProductDetailPage/  # Full product view + reviews
│       │   ├── AllProductsPage/    # Virtualized grid of all products
│       │   └── NotFoundPage/
│       ├── routes/                 # React Router config (lazy-loaded pages)
│       ├── store/                  # Redux store + typed hooks
│       └── shared/
│           ├── components/
│           │   ├── Header/         # Auth-aware header with user menu
│           │   ├── SearchBar/      # AI search modal + useSearch hook
│           │   ├── VirtualGrid/    # Custom virtualization implementation
│           │   ├── ProtectedRoute/ # Auth guard component
│           │   ├── ErrorBoundary/
│           │   └── ui/             # Reusable primitives (Button, Star, etc.)
│           ├── hooks/
│           │   ├── useFetch.ts     # Generic data fetching with AbortController
│           │   └── useScrollToTop.ts
│           ├── lib/
│           │   └── axios.ts        # Axios instance + request/response interceptors
│           ├── constants/          # API URL builders, route constants
│           ├── types/              # Shared API response types
│           └── utils/              # debounce, slug helpers, category name formatter
│
└── server/                         # Express backend
    └── src/
        ├── features/
        │   ├── auth/               # controller, service, routes
        │   └── products/           # controller, service, LLM layer, routes, types
        ├── middlewares/            # JWT authentication guard
        ├── utils/                  # JWT sign/verify, bcrypt, cookie helpers
        ├── config/                 # Env validation with Zod
        └── lib/                    # Prisma client singleton
```

The folder structure follows a **feature-based convention** — every feature owns its controller, service, and routes in one place. Shared utilities live in `shared/`.

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.9 | End-to-end type safety |
| Vite 7 | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router v7 | Client-side routing with lazy-loaded pages |
| Redux Toolkit | Global auth state (slice, thunks, selectors) |
| React Hook Form + Zod | Form handling with schema validation |
| Axios | HTTP client with request/response interceptors |
| @react-oauth/google | Google OAuth popup flow |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server framework |
| TypeScript 5.9 | End-to-end type safety |
| Prisma 7 + PostgreSQL | ORM and relational database |
| Groq SDK | LLM inference for natural language filter extraction |
| JSON Web Tokens | Access + refresh token auth |
| bcryptjs | Password hashing (12 salt rounds) |
| Zod | Request body + env variable validation |
| Helmet | Security headers |
| express-rate-limit | Rate limiting on auth endpoints |
| cookie-parser | httpOnly cookie parsing |

---

## 🌐 Pages & Features

### Home Page — Category Browse
- Responsive category grid fetched from the backend
- Each card links to its filtered product listing
- Skeleton loading state for every card

### Product Listing Page — Browse by Category
- Sidebar filter panel with:
  - Price range (min/max)
  - Minimum rating
  - Minimum discount
  - Brand multi-select (dynamic per category)
  - In-stock toggle
- All filters applied server-side via query params
- **Filters persisted in URL** — shareable and survives page refresh
- Dynamic product count updates as filters change

### Product Detail Page — Deep Product View
- Image gallery with multiple product images
- Full metadata: SKU, weight, dimensions, warranty, shipping info, return policy
- Reviews section with star ratings and reviewer info
- Related tags display
- Dedicated error, not-found, and skeleton states

### All Products Page — Virtualized Browse
- Renders the full product catalog using a **custom virtualized grid**
- Only visible rows are in the DOM — smooth performance regardless of catalog size
- Pagination support via URL search params

### Search Modal — AI Search
- Triggered by the search icon or `Ctrl+K` / `Cmd+K`
- Locks body scroll while open; closes on backdrop click or Escape
- LLM-extracted filter tags shown above results
- Cursor-based infinite scroll — loads more results on demand
- Skeleton loading, empty state, and error states all handled
- Debounced (300ms) with in-flight request cancellation

### Login / Register
- Email + password with client-side Zod validation
- Password strength meter with requirement checklist on register
- Google OAuth via `@react-oauth/google`
- Tab switcher to toggle between Sign In and Create Account

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | — | Create a new account |
| `POST` | `/login` | — | Email/password login |
| `POST` | `/google` | — | Google OAuth login/register |
| `POST` | `/refresh` | Cookie | Rotate refresh token |
| `POST` | `/logout` | Cookie | Revoke refresh token |
| `GET` | `/me` | Bearer | Get current user |

### Products — `/api/products`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | All categories with formatted names |
| `GET` | `/search` | Filter products with offset pagination |
| `GET` | `/:id` | Single product with reviews |
| `GET` | `/category-metadata` | Brands + price range for a category |
| `POST` | `/llm-search` | Natural language search with cursor pagination |

---

## ⚙️ Architecture Decisions Worth Noting

**Silent token refresh with concurrent request queue** — When multiple API requests expire simultaneously, only one refresh call fires. All other requests wait in a queue and are retried with the new token. No duplicate refresh calls, no race conditions.

**`useInitAuth` for session restoration** — On every page load, the app calls `/auth/refresh` silently. If a valid httpOnly cookie exists, the session is restored without the user ever seeing a login screen. `initStatus` in Redux prevents protected routes from flashing the login page during this check.

**Custom virtualization without a library** — `VirtualGrid` calculates visible items from first principles using `ResizeObserver` for dynamic row height measurement. No external dependency.

**Cursor-based pagination for search** — LLM search uses a cursor (last product ID) rather than offset pagination. This avoids the "skip N rows" performance problem and produces stable results even when the underlying data changes.

**URL-persisted filters** — Product listing filters live in URL search params, not component state. This makes filter state bookmarkable, shareable, and browser-back-button safe.

**Skeleton loading everywhere** — Every data-fetching component has a dedicated skeleton (`*Skeleton.tsx`). Layout shift is eliminated and the loading experience feels intentional.

**Custom `useFetch` hook** — A reusable data-fetching hook using the native `fetch` API with `AbortController` cleanup and typed generic returns. Resets state on URL change to prevent stale data flash.

**In-memory product metadata cache** — Categories, brands, and availability statuses are fetched once from the DB and cached in server memory. Every LLM search call reads from the cache instead of hitting the DB.

**Code-split routing** — All pages are `React.lazy()` wrapped inside a `<Suspense>` boundary. Each page is a separate JS chunk downloaded only when visited.

**Monorepo with pnpm workspaces** — `client` and `server` are independent packages sharing one lockfile. A single `pnpm dev` from root starts both.

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
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique   // raw token is never stored
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  userAgent String?
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([userId])
}

model Product {
  id                   Int
  title                String
  description          String
  category             String
  price                Decimal
  discountPercentage   Decimal
  rating               Float
  stock                Int
  tags                 String[]
  brand                String?
  sku                  String    @unique
  weight               Float
  dimensions           Json
  warrantyInformation  String
  shippingInformation  String
  availabilityStatus   String
  returnPolicy         String
  minimumOrderQuantity Int
  thumbnail            String
  images               String[]
  reviews              Review[]
}

model Review {
  id            Int      @id @default(autoincrement())
  rating        Int
  comment       String
  date          DateTime
  reviewerName  String
  reviewerEmail String
  productId     Int
  product       Product  @relation(fields: [productId], references: [id])
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL instance (or [Neon](https://neon.tech) free tier)

### 1. Clone & Install

```bash
git clone https://github.com/neerajsingh869/shop-elite.git
cd shop-elite
pnpm install
```

### 2. Configure Environment Variables

**Server** — create `server/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/shopelite"
ACCESS_TOKEN_SECRET="<64-char random hex>"
REFRESH_TOKEN_SECRET="<different 64-char random hex>"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
GROQ_API_KEY="your-groq-api-key"
CLIENT_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Client** — create `client/.env.local`:

```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 3. Set Up the Database

```bash
cd server
npx prisma migrate dev   # Apply migrations
pnpm seed                # Seed product data from DummyJSON API (~194 products)
```

### 4. Run

```bash
# From project root — starts both client and server
pnpm dev
```

Client → `http://localhost:5173` · Server → `http://localhost:3000`

---

## 🗺️ What's Next

- [ ] Cart — frontend (Redux) + backend API + optimistic UI
- [ ] Checkout flow — address, order summary, payment
- [ ] Razorpay payment integration
- [ ] Orders — backend + frontend history view
- [ ] Profile page — update name, avatar, saved addresses
- [ ] Search results page `/search` with URL-persisted query