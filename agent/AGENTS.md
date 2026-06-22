# CodeTrack — Project Repository Guide

> **Platform belajar coding online** — course catalog, articles, user dashboard (streak & progress tracking), and admin panel.
> Last updated: 2026-06-21

---

## 1. Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 5+ |
| Build Tool | Vite | 6+ |
| Styling | Tailwind CSS | v4 |
| UI Primitives | shadcn/ui (base-nova) | latest |
| Router | React Router | v7 |
| Client State | Zustand (persisted) | latest |
| Charts | Recharts | 2.x |
| Icons | Lucide React | latest |
| Animation | Motion (framer-motion) | latest |
| Typography | Geist Variable | via `@fontsource-variable/geist` |
| Forms | react-hook-form + zod | latest |

---

## 2. Development Commands

```sh
npm run dev        # Vite dev server (hot reload)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint scan
npm run preview    # Preview production build locally
```

---

## 3. Module Resolution

| Alias | Maps to |
|---|---|
| `@/` | `src/` |

Configured in `tsconfig.app.json` and `vite.config.ts`.

---

## 4. Architecture — Clean Architecture (3-Layer)

```
src/
├── core/                          # DOMAIN layer — pure TypeScript, zero dependencies
│   ├── domain/
│   │   ├── entities/              # Data models: User, Course, Article, Transaction, Dashboard
│   │   ├── repositories/          # Abstract interfaces: IAuthRepository, ICourseRepository, ...
│   │   └── di.ts                  # Dependency injection container — injectRepositories()
│   └── utils/                     # Pure utility functions: formatRupiah, getLevelColor, ...
│
├── data/                          # DATA layer — repository implementations
│   ├── repositories/              # MockCourseRepository, MockAuthRepository, ...
│   └── sources/
│       └── mock/                  # Static JSON files (users, courses, articles, ...)
│
├── features/                      # PRESENTATION layer — React components & hooks
│   ├── auth/                      #   pages/  components/  hooks/  store/
│   ├── landing/                   #   pages/  components/
│   ├── articles/                  #   pages/  components/  hooks/
│   ├── courses/                   #   pages/  components/
│   ├── commerce/                  #   pages/  components/  store/
│   ├── user-dashboard/            #   pages/  components/
│   └── admin/                     #   pages/  components/
│
├── shared/                        # Cross-cutting concerns
│   ├── components/
│   │   ├── layout/                # PublicLayout, UserLayout, AdminLayout, Navbar, Footer, ProtectedRoute
│   │   ├── ui/                    # shadcn/ui primitives (Button, Card, Badge, ...)
│   │   └── common/                # CourseCard, StatCard, DataTable, EmptyState, ...
│   ├── types/                     # Re-exports from core/domain/entities/
│   └── utils/                     # Re-exports from core/utils/
│
└── app/                           # Application shell
    └── router.tsx                 # Route definitions
```

### Dependency Rule

```
features/ (React)  →  core/domain/ (interfaces)  ←  data/ (implementations)
```

- Feature hooks call `repos.*` from `core/domain/di.ts` — never import JSON directly.
- Switching from mock to real API requires **one line change** in `main.tsx`.
- Entities and utilities live in `core/` — `shared/` only re-exports.

---

## 5. State Management Strategy

```
Zustand (persisted to localStorage):
├── authStore  → user, role, isAuthenticated, login(), logout()
└── cartStore  → items[], total, add(), remove(), clear()

React local state (component-scoped):
└── filter, search, pagination, form inputs, UI toggles
```

---

## 6. Route Map

| Route | Layout | Page | Access |
|---|---|---|---|
| `/` | PublicLayout | LandingPage | Public |
| `/courses` | PublicLayout | CourseCatalogPage | Public |
| `/courses/:slug` | PublicLayout | CourseDetailPage | Public |
| `/articles` | PublicLayout | ArticlesPage | Public |
| `/articles/:slug` | PublicLayout | ArticleDetailPage | Public |
| `/auth/login` | — | LoginPage | Public |
| `/auth/register` | — | RegisterPage | Public |
| `/dashboard` | ProtectedRoute(user) + UserLayout | UserDashboardPage | Authenticated user |
| `/dashboard/cart` | " | CartPage | " |
| `/dashboard/checkout` | " | CheckoutPage | " |
| `/dashboard/history` | " | TransactionHistoryPage | " |
| `/admin` | ProtectedRoute(admin) + AdminLayout | AdminDashboardPage | Admin |
| `/admin/articles` | " | ArticleManagementPage | Admin |
| `/admin/courses` | " | CourseManagementPage | Admin |
| `/admin/users` | " | UserManagementPage | Admin |
| `/admin/transactions` | " | TransactionManagementPage | Admin |
| `*` | — | NotFoundPage | Public |

### Redirect Rules (implemented in `ProtectedRoute.tsx`)
- Unauthenticated → `/auth/login`
- User accessing `/admin/*` → `/dashboard`
- Admin accessing `/dashboard/*` → `/admin`

---

## 7. Demo Credentials (No Backend)

| Role | Email | Password |
|---|---|---|
| User | `user@codetrack.id` | `user123` |
| Admin | `admin@codetrack.id` | `admin123` |

Hardcoded in `LoginPage.tsx` for demo purposes.

---

## 8. Styling Conventions

| Concern | Standard |
|---|---|
| Framework | Tailwind CSS v4 (`@import "tailwindcss"` in `index.css`) |
| Color System | Design tokens — see `agent/design-token.md` |
| Primary Color | `indigo-600` (`#4f39f6`) |
| Page Background | `bg-gray-50` / `bg-muted` |
| Typography | Geist Variable via `@fontsource-variable/geist` |
| Hover Transitions | `transition-colors` on interactive elements |
| Focus Rings | `focus-visible:ring-2 focus-visible:ring-[color] outline-none` on all interactive elements |
| Disabled State | `opacity-50 cursor-not-allowed pointer-events-none` |

---

## 9. Conventions

| Concern | Standard |
|---|---|
| TypeScript | `verbatimModuleSyntax` enabled → use `import type` for type-only imports |
| Lint | `noUnusedLocals` and `noUnusedParameters` enabled |
| Image Loading | Use `loading="lazy"` on all `<img>` tags |
| Image Fallback | Use `<ImageWithFallback />` which displays an `ImageOff` placeholder on error |
| Text Overflow | Use `truncate` or `line-clamp-N` for dynamic text content |
| Layout Spacing | Use `gap-*` with Flex/Grid — never manual margin on sibling elements |
| Currency | Always format with `formatRupiah()` from `@/shared/utils` |
| Forms | `react-hook-form` + `zod` for all forms with validation |
| Network Simulation | Must use realistic delays (min 800ms, max 3000ms) with 25% failure rate |
| Async Pattern | Every data fetch must handle 3 states: `isLoading`, `error`, `data` |
| shadcn/ui | Add new primitives via `npx shadcn add [component]` |

---

## 10. Reference Files (in `agent/`)

| File | Purpose |
|---|---|
| `design-token.md` | Color palette, typography scale, spacing, component patterns, interaction states |
| `data-schema.md` | TypeScript types, mock data contracts, chaos-testing data |
| `pages.md` | Route structure, page content requirements, navigation flows |
| `components.md` | Component inventory — existing vs. planned, status tracking |

> Read these files **before** working on any task that touches the relevant concern.
