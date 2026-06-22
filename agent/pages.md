# Pages & Routes — CodeTrack

> Complete route map, page content specifications, and navigation flow.
> Last updated: 2026-06-21

---

## Table of Contents

1. [Route Structure & State Contracts](#1-route-structure--state-contracts)
2. [Layout Architecture](#2-layout-architecture)
3. [Page Content Specifications](#3-page-content-specifications)
4. [Navigation Flow](#4-navigation-flow)
5. [Redirect Rules](#5-redirect-rules)

---

## 1. Route Structure & State Contracts

### 1.1 Public Routes — `PublicLayout` (Navbar + Footer)

| Route | Component | File |
|---|---|---|
| `/` | LandingPage | `features/landing/pages/LandingPage.tsx` |
| `/courses` | CourseCatalogPage | `features/courses/pages/CourseCatalogPage.tsx` |
| `/courses/:slug` | CourseDetailPage | `features/courses/pages/CourseDetailPage.tsx` |
| `/articles` | ArticlesPage | `features/articles/pages/ArticlesPage.tsx` |
| `/articles/:slug` | ArticleDetailPage | `features/articles/pages/ArticleDetailPage.tsx` |

**State contracts:**
- **List pages** (`/courses`, `/articles`): Must render `PageSkeleton` or specific skeletons during fetch. On fetch failure: **must** display `ErrorState` with a "Coba Lagi" (retry) button — never a white screen.
- **Detail pages** (`/:slug`): Must handle 404 explicitly when `slug` is not found in the repository. Display a "Konten Tidak Ditemukan" illustration with a "Kembali ke Katalog" button.

### 1.2 Auth Routes — No Layout (Full Page)

| Route | Component | File |
|---|---|---|
| `/auth/login` | LoginPage | `features/auth/pages/LoginPage.tsx` |
| `/auth/register` | RegisterPage | `features/auth/pages/RegisterPage.tsx` |

**State contracts:**
- **Double-submit prevention:** All inputs and submit buttons **must** be `disabled={isLoading}` while the auth promise is pending.
- **Feedback:** Network failure or wrong credentials **must** show an inline error message (red text or toast). Navigation to `/dashboard` **must only** occur after the auth promise resolves successfully.
- **Loading state:** Submit button shows a spinner icon + text change ("Signing in...") while loading.

### 1.3 User Routes — `ProtectedRoute(role: user)` + `UserLayout`

| Route | Component | File |
|---|---|---|
| `/dashboard` | UserDashboardPage | `features/user-dashboard/pages/UserDashboardPage.tsx` |
| `/dashboard/cart` | CartPage | `features/commerce/pages/CartPage.tsx` |
| `/dashboard/checkout` | CheckoutPage | `features/commerce/pages/CheckoutPage.tsx` |
| `/dashboard/history` | TransactionHistoryPage | `features/commerce/pages/TransactionHistoryPage.tsx` |

**State contracts:**
- **Empty states:** If the cart is empty or transaction history is zero, **must** render `EmptyState` with a CTA to browse courses. Never render an empty table or empty list.
- **Checkout safety:** Do **not** redirect to `/dashboard/history` before `repos.transaction.create()` returns a success status. On payment failure, display the error in-place — don't redirect.

### 1.4 Admin Routes — `ProtectedRoute(role: admin)` + `AdminLayout`

| Route | Component | File |
|---|---|---|
| `/admin` | AdminDashboardPage | `features/admin/pages/AdminDashboardPage.tsx` |
| `/admin/articles` | ArticleManagementPage | `features/admin/pages/ArticleManagementPage.tsx` |
| `/admin/courses` | CourseManagementPage | `features/admin/pages/CourseManagementPage.tsx` |
| `/admin/users` | UserManagementPage | `features/admin/pages/UserManagementPage.tsx` |
| `/admin/transactions` | TransactionManagementPage | `features/admin/pages/TransactionManagementPage.tsx` |

**State contracts:**
- **DataTable loading:** All admin tables must have internal loading states. When an admin action is performed (e.g., "Delete User"), only the affected row enters a loading/disabled state — the full page **must not** refresh.
- **Lazy loading:** All admin pages use `React.lazy` with `<Suspense fallback={<PageSkeleton />}>`.

### 1.5 System Routes

| Route | Component | Description |
|---|---|---|
| `*` (catch-all) | `NotFoundPage` | Elegant 404 page with a "Kembali ke Beranda" navigation button. |

---

## 2. Layout Architecture

### PublicLayout
```
Path:    src/shared/components/layout/PublicLayout.tsx
Render:  <Navbar /> + <Outlet /> + <Footer />
Used:    All public pages
```

### UserLayout
```
Path:    src/shared/components/layout/UserLayout.tsx
Render:  <Navbar /> + <Outlet />
Used:    All authenticated user pages (Dashboard, Cart, Checkout, History)
Note:    Navbar persists across all user routes for consistent navigation.
         Transition animation on route change (framer-motion).
```

### AdminLayout
```
Path:    src/shared/components/layout/AdminLayout.tsx
Render:  <AdminTopbar /> + <AdminSidebar /> + <Outlet />
Used:    All admin pages
Note:    Topbar & Sidebar persist across all admin routes.
         Sidebar collapses on mobile with overlay + hamburger toggle.
         Transition animation on route change (framer-motion).
```

### Auth Routes
```
No layout wrapper — full-page standalone views.
Background: linear-gradient(117deg, #eef2ff 0%, #ffffff 50%, #faf5ff 100%)
```

---

## 3. Page Content Specifications

### 3.1 Landing Page (`/`)
Sections in order:
1. **Navbar** — Logo + menu (Courses \| Artikel) + Login + Start Free Trial
2. **Hero** — 2 columns: heading/subtext/CTAs/stats (left) + image (right)
3. **Features** — "Kenapa CodeTrack Berbeda?" — 3 cards
4. **Testimonials** — Carousel with star rating + quote + avatar/name/role
5. **Popular Courses** — 3-column grid of `CourseCard`
6. **CTA Banner** — Indigo-purple gradient with "Daftar Sekarang" button
7. **Footer** — 4-column: brand \| Produk \| Perusahaan \| Social Media

### 3.2 Course Catalog (`/courses`)
- Promo banner (dismissible)
- Heading + search bar
- Stats row: 150+ Courses \| 10,000+ Students \| 95% Completion Rate
- Category filter tabs
- Sort dropdown + grid/list view toggle
- Sidebar filters: Level \| Harga \| Durasi \| Rating \| Fitur
- 3-column grid of `CourseCard` with "Load More" pagination

### 3.3 Course Detail (`/courses/:slug`)
- Breadcrumb navigation
- 2-column layout: content (left) + sticky info card (right)
- Badges: category + level
- Course info: rating, students, duration, instructor
- CTA: "Beli Sekarang" (paid) / "Mulai Gratis" (free)

### 3.4 Article Archive (`/articles`)
- Header: "Arsip Artikel"
- Grid of article cards with thumbnail, title, excerpt, author, date, read time
- Category filter

### 3.5 Article Detail (`/articles/:slug`)
- Header: title, author, date, read time, thumbnail
- Article content
- Sidebar: related articles

### 3.6 Login (`/auth/login`)
- Full-page centred card on gradient background
- Fields: Email + Password (with show/hide toggle)
- Buttons: Sign In (primary) + Google/GitHub (social)
- Link: "Don't have an account? Sign up"
- Demo credentials hint for presentation

### 3.7 Register (`/auth/register`)
- Full-page centred card on gradient background
- Fields: Full Name + Email + Role (Student/Instructor) + Password + Confirm Password
- Checkbox: Terms & Conditions
- Buttons: Create Account (primary) + Google/GitHub (social)

### 3.8 User Dashboard (`/dashboard`)
- Navbar (persistent)
- Welcome header: gradient indigo-purple + streak pill
- Quick stats: 4 cards (Courses Enrolled \| Learning Time \| Certificates \| Streak)
- 2-column layout [65% \| 35%]:
  - **Left:** Continue Learning + In Progress + Recommended (2×2 grid) + Streak Calendar + Recent Activity
  - **Right:** Monthly Goals (gradient card) + Upcoming Deadlines + Achievements + Community + Quick Actions

### 3.9 Cart (`/dashboard/cart`)
- List: thumbnail, course title, instructor, price per item
- Delete button per item
- Summary: subtotal, discount, total
- CTA: "Checkout" (disabled when cart is empty)

### 3.10 Checkout (`/dashboard/checkout`)
- Payment detail form
- Payment method selector: Transfer \| Kartu Kredit \| E-Wallet
- Order summary
- CTA: "Bayar Sekarang" (with loading state)

### 3.11 Transaction History (`/dashboard/history`)
- Table: Invoice \| Course \| Date \| Amount \| Status
- Status filter
- Pagination

### 3.12 Admin Dashboard (`/admin`)
- Topbar (dark): Logo + Search + Bell + Avatar
- Sidebar: fixed, section-grouped navigation
- Header: welcome + date + filter (Today/Week/Month/Year) + action buttons
- KPI cards: 5-column (Revenue \| Users \| Courses \| Students \| Health)
- 2-column [65% \| 35%]: Revenue chart + Top Courses \| Activity + Reviews + Goals + Quick Actions
- 3-column secondary: Conversion \| Avg Transaction \| Completion \| Rating \| Tickets \| Refund
- 2-column: Latest Transactions + Newest Users
- 3-column: Traffic Sources (pie) + Devices (progress) + Locations (progress)
- Alert bars (success \| warning \| info)

### 3.13 Article Management (`/admin/articles`)
- Table: title, category, author, date, status, actions
- "Tambah Artikel" button
- Filter + search

### 3.14 Course Management (`/admin/courses`)
- Table: title, category, instructor, students, price, status, actions
- "Tambah Course" button
- Filter + search

### 3.15 User Management (`/admin/users`)
- Table: avatar, name, email, role, registration date, status, actions
- Filter by role + search

### 3.16 Transaction Management (`/admin/transactions`)
- Table: invoice, customer, course, amount, status, date, actions
- Filter: status + date range + search
- Export button

---

## 4. Navigation Flow

```
Landing ──→ Courses          : klik "Lihat Course" atau menu Courses
Landing ──→ Login            : klik "Login" di navbar
Landing ──→ Register         : klik "Mulai Gratis 7 Hari" / "Start Free Trial"
Login   ──→ Dashboard        : [ASYNC] setelah login sukses (role: user)
Login   ──→ Admin            : [ASYNC] setelah login sukses (role: admin)
Register → Login             : [ASYNC] setelah registrasi sukses
Courses ──→ Course Detail    : klik "Lihat Detail" pada CourseCard
Course Detail → Cart         : klik "Beli Sekarang" / "Tambah ke Keranjang"
Cart ────→ Checkout           : klik "Checkout" (hanya jika item > 0)
Checkout → History           : [ASYNC] setelah pembayaran berhasil diverifikasi
Dashboard → Courses          : klik "Browse Courses" / "Continue Learning"
Admin sidebar → sub-pages    : klik menu pada AdminSidebar
```

> **Rule:** Navigasi yang bergantung pada hasil operasi asinkron (login, registrasi, checkout) hanya boleh berpindah halaman **setelah** Promise sukses.

---

## 5. Redirect Rules

Implemented in `ProtectedRoute.tsx`:

| User State | Accesses | Redirect To |
|---|---|---|
| Not logged in | Any protected route | `/auth/login` |
| Logged in as `user` | `/admin/*` | `/dashboard` |
| Logged in as `admin` | `/dashboard/*` | `/admin` |
