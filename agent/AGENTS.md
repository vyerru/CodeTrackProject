# CodeTrack — Agent Instructions

Platform belajar coding online dengan fitur course catalog, artikel, user dashboard (streak & progress), dan admin panel.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 5+ |
| Build Tool | Vite | 6+ |
| Styling | Tailwind CSS | v4 |
| Components | shadcn/ui (base-nova) | latest |
| Router | React Router | v7 |
| State | Zustand (persisted) | latest |
| Charts | Recharts | 2.x |
| Icons | Lucide React | latest |
| Animation | Motion (Framer) | latest |
| Font | Geist Variable | via @fontsource-variable/geist |

---

## Commands

```sh
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # vite preview
```

---

## Path Alias

`@/` → `src/` (dikonfigurasi di `tsconfig.app.json` dan `vite.config.ts`)

---

## Architecture

**Feature-based layout:**
```
src/
├── app/                          # Router, App entry
├── features/
│   ├── auth/                     # Login, Register, authStore
│   ├── landing/                  # Landing page sections
│   ├── articles/                 # Arsip & Detail Artikel
│   ├── courses/                  # Katalog & Detail Course
│   ├── commerce/                 # Cart, Checkout, History
│   ├── user-dashboard/           # User Dashboard
│   └── admin/                    # Admin Dashboard & semua Kelola* pages
├── shared/
│   ├── components/
│   │   ├── layout/               # PublicLayout, UserLayout, AdminLayout, ProtectedRoute, Navbar, Footer
│   │   ├── ui/                   # shadcn components
│   │   └── common/               # CourseCard, StatCard, DataTable, dll
│   ├── hooks/                    # useLocalStorage, useDebounce, dll
│   ├── types/                    # Semua TypeScript interfaces
│   └── utils/                    # formatRupiah, getLevelColor, dll
└── data/                         # Mock JSON files
```

Setiap feature folder berisi: `components/`, `pages/`, `hooks/`, `store/` (jika ada).

---

## State Management

```
Zustand (persisted ke localStorage):
├── authStore  → user, role, isAuthenticated, login(), logout()
└── cartStore  → items[], total, add(), remove(), clear()

React local state:
└── filter, search, pagination, form inputs, UI toggles
```

---

## Routing

```
/                     PublicLayout → LandingPage
/courses              PublicLayout → CourseCatalogPage
/courses/:slug        PublicLayout → CourseDetailPage
/articles             PublicLayout → ArticlesPage
/articles/:slug       PublicLayout → ArticleDetailPage
/auth/login           (no layout)  → LoginPage
/auth/register        (no layout)  → RegisterPage
/dashboard            ProtectedRoute(user) + UserLayout → UserDashboardPage
/dashboard/cart       ProtectedRoute(user) + UserLayout → CartPage
/dashboard/checkout   ProtectedRoute(user) + UserLayout → CheckoutPage
/dashboard/history    ProtectedRoute(user) + UserLayout → TransactionHistoryPage
/admin                ProtectedRoute(admin) + AdminLayout → AdminDashboardPage
/admin/articles       ProtectedRoute(admin) + AdminLayout → ArticleManagementPage
/admin/courses        ProtectedRoute(admin) + AdminLayout → CourseManagementPage
/admin/users          ProtectedRoute(admin) + AdminLayout → UserManagementPage
/admin/transactions   ProtectedRoute(admin) + AdminLayout → TransactionManagementPage
```

Redirect rules:
- Belum login → `/auth/login`
- User akses `/admin` → `/dashboard`
- Admin akses `/dashboard` → `/admin`

---

## Demo Auth Credentials

```
User:  email: user@codetrack.id   | password: user123   | role: user
Admin: email: admin@codetrack.id  | password: admin123  | role: admin
```

Hardcode di `LoginPage.tsx` untuk demo — tidak ada backend.

---

## CSS & Styling

- Tailwind v4 dengan `@import "tailwindcss"` di `src/index.css` (tidak ada `tailwind.config.js`)
- CSS variables di `src/index.css` — lihat `design-tokens.md` untuk nilai lengkap
- Primary color: `#4f39f6`
- Background page: `#F9FAFB` (gray-50)
- Font: Geist Variable

---

## Conventions

- **TypeScript**: `verbatimModuleSyntax` aktif → gunakan `import type` untuk type-only imports
- **Lint**: `noUnusedLocals` dan `noUnusedParameters` aktif
- **Forms**: react-hook-form + zod untuk semua form dengan validasi
- **Images**: gunakan URL dari `unsplash.com` atau `i.pravatar.cc` untuk mock data
- **Currency**: selalu format dengan `formatRupiah()` dari `@/shared/utils`
- **shadcn**: tambah komponen baru via `npx shadcn add [component]`

---

## Reference Files

Baca file-file ini sebelum mengerjakan task yang relevan:

| File | Baca untuk |
|---|---|
| `design-tokens.md` | Warna, typography, spacing, component patterns |
| `data-schema.md` | TypeScript types, struktur mock data, utility functions |
| `pages.md` | Route structure, konten per halaman, navigasi |
| `components.md` | Daftar komponen yang sudah ada vs belum (cek sebelum buat baru) |

---

## Important Notes

- Ini adalah **frontend-only project** — tidak ada backend, tidak ada API call nyata
- Semua data dari file JSON di `src/data/` — query via TanStack Query dengan artificial delay
- Jangan install atau gunakan `@mui/material` — sudah dihapus, gunakan shadcn/ui + Tailwind
- Jangan gunakan `localStorage` langsung — gunakan Zustand persist middleware
- Lazy load semua route dengan `React.lazy()` + `Suspense`