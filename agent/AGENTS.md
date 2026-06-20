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
/                     PublicLayout (Navbar + Outlet + Footer)     → LandingPage
/courses              PublicLayout                                 → CourseCatalogPage
/courses/:slug        PublicLayout                                 → CourseDetailPage
/articles             PublicLayout                                 → ArticlesPage
/articles/:slug       PublicLayout                                 → ArticleDetailPage
/auth/login           (no layout)                                  → LoginPage
/auth/register        (no layout)                                  → RegisterPage
/dashboard            ProtectedRoute(user) + UserLayout (Navbar + Outlet) → UserDashboardPage
/dashboard/cart       "                                             → CartPage
/dashboard/checkout   "                                             → CheckoutPage
/dashboard/history    "                                             → TransactionHistoryPage
/admin                ProtectedRoute(admin) + AdminLayout (Topbar + Sidebar + Outlet) → AdminDashboardPage
/admin/articles       "                                             → ArticleManagementPage
/admin/courses        "                                             → CourseManagementPage
/admin/users          "                                             → UserManagementPage
/admin/transactions   "                                             → TransactionManagementPage
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
- Semua warna menggunakan Tailwind utility classes langsung (`bg-indigo-600`, `text-gray-900`, dll) — lihat `design-tokens.md` untuk mapping lengkap
- Primary color: `indigo-600` (`#4f39f6`)
- Background page: `bg-gray-50` (`#F9FAFB`)
- Font: Geist Variable — via `@fontsource-variable/geist`

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

## Important Rules & Flow Constraints (WAJIB DIPATUHI)

1. **Simulasi Jaringan Ekstrem (Flow):** Simulator jaringan HUKUMNYA HARAM disetel ke 0. Konfigurasi di `main.tsx` wajib: `setNetworkConfig({ minDelay: 800, maxDelay: 3000, failureRate: 0.25 })`.
2. **Wajib `useAsync`:** Semua pengambilan data harus melewati alat asinkron dan wajib mengelola 3 state mutlak: `isLoading`, `error`, dan `data`.
3. **Kewajiban Zero-Dead-End (Flow):** - Jika data kosong (`[]`), WAJIB render `EmptyState` dengan tombol CTA kembali.
   - Dilarang membiarkan layar *freeze* saat transisi rute; WAJIB gunakan `Suspense` fallback atau kerangka (*skeleton*).
4. **Definisi "Disabled State" (Flow):** Semua form dan tombol aksi WAJIB dimatikan (`disabled={isLoading}`) saat permintaan jaringan berjalan. Dilarang keras memungkinkan *double-click* pada tombol submit.