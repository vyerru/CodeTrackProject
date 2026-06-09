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

**Clean Architecture — 3 layer:**

```
src/
├── core/                          # Layer DOMAIN — pure TS, zero dependencies
│   ├── domain/
│   │   ├── entities/              # Interfaces: User, Course, Article, Transaction, Dashboard
│   │   ├── repositories/          # Abstrak: ICourseRepository, IAuthRepository, dll
│   │   └── di.ts                  # Dependency injection — injectRepositories() + repos getters
│   └── utils/                     # Pure functions: formatRupiah, getLevelColor, dll
│
├── data/                          # Layer DATA — implementasi repository
│   ├── repositories/              # MockCourseRepository, MockAuthRepository, dll
│   └── sources/
│       └── mock/                  # File JSON statis (users, courses, articles, dll)
│
├── features/                      # Layer PRESENTATION — React components & hooks
│   ├── auth/
│   ├── landing/
│   ├── articles/
│   ├── courses/
│   ├── commerce/
│   ├── user-dashboard/
│   └── admin/
├── shared/
│   ├── components/
│   │   ├── layout/               # PublicLayout, UserLayout, AdminLayout, ProtectedRoute, Navbar, Footer
│   │   ├── ui/                   # shadcn components
│   │   └── common/               # CourseCard, StatCard, DataTable, dll
│   ├── types/                    # Re-export dari core/domain/entities/
│   └── utils/                    # Re-export dari core/utils/
└── app/                          # Router, App entry
```

Setiap feature folder berisi: `components/`, `pages/`, `hooks/`, `store/` (jika ada).

**Dependency Rule:**
```
features/ (React)  →  core/domain/ (interfaces)  ←  data/ (implementations)
```
- Hooks panggil `repos.*` dari `core/domain/di.ts` — jangan import JSON langsung
- Repository diganti 1 baris di `main.tsx` untuk beralih dari mock ke API
- Entities & utils di `core/` — import dari situ (shared/ cuma re-export)

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
- **Data API (wajib):** jangan pernah import file JSON langsung di hook/component. Gunakan `repos.*` dari `core/domain/di.ts` — contoh: `repos.course.findAll()`, `repos.auth.login()`, `repos.dashboard.getDashboardData()`
- Semua mock repository ada di `data/repositories/` dengan artificial delay (300-800ms)
- **Migrasi ke backend nanti:** ubah instansiasi di `main.tsx` — ganti `new MockXxxRepository()` → `new ApiXxxRepository()`, hooks tidak perlu diotak-atik
- Jangan install atau gunakan `@mui/material` — sudah dihapus, gunakan shadcn/ui + Tailwind
- Jangan gunakan `localStorage` langsung — gunakan Zustand persist middleware
- Lazy load semua route dengan `React.lazy()` + `Suspense`