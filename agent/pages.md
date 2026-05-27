# Pages & Routes — CodeTrack

---

## Route Structure

### Public Routes — `PublicLayout` (Navbar + Footer)
| Route | Component | File |
|---|---|---|
| `/` | LandingPage | `features/landing/pages/LandingPage.tsx` |
| `/courses` | CourseCatalogPage | `features/courses/pages/CourseCatalogPage.tsx` |
| `/courses/:slug` | CourseDetailPage | `features/courses/pages/CourseDetailPage.tsx` |
| `/articles` | ArticlesPage | `features/articles/pages/ArticlesPage.tsx` |
| `/articles/:slug` | ArticleDetailPage | `features/articles/pages/ArticleDetailPage.tsx` |

### Auth Routes — No layout (full page)
| Route | Component | File |
|---|---|---|
| `/auth/login` | LoginPage | `features/auth/pages/LoginPage.tsx` |
| `/auth/register` | RegisterPage | `features/auth/pages/RegisterPage.tsx` |

### User Routes — `ProtectedRoute (role: user)` + `UserLayout`
| Route | Component | File |
|---|---|---|
| `/dashboard` | UserDashboardPage | `features/user-dashboard/pages/UserDashboardPage.tsx` |
| `/dashboard/cart` | CartPage | `features/commerce/pages/CartPage.tsx` |
| `/dashboard/checkout` | CheckoutPage | `features/commerce/pages/CheckoutPage.tsx` |
| `/dashboard/history` | TransactionHistoryPage | `features/commerce/pages/TransactionHistoryPage.tsx` |

### Admin Routes — `ProtectedRoute (role: admin)` + `AdminLayout`
| Route | Component | File |
|---|---|---|
| `/admin` | AdminDashboardPage | `features/admin/pages/AdminDashboardPage.tsx` |
| `/admin/articles` | ArticleManagementPage | `features/admin/pages/ArticleManagementPage.tsx` |
| `/admin/courses` | CourseManagementPage | `features/admin/pages/CourseManagementPage.tsx` |
| `/admin/users` | UserManagementPage | `features/admin/pages/UserManagementPage.tsx` |
| `/admin/transactions` | TransactionManagementPage | `features/admin/pages/TransactionManagementPage.tsx` |

---

## Layouts

### PublicLayout
- File: `shared/components/layout/PublicLayout.tsx`
- Berisi: `<Navbar />` + `<Outlet />` + `<Footer />`
- Dipakai: semua halaman publik

### UserLayout
- File: `shared/components/layout/UserLayout.tsx`
- Berisi: `<Outlet />` saja (navbar sudah ada di dalam UserDashboardPage)
- Dipakai: semua halaman user yang sudah login

### AdminLayout
- File: `shared/components/layout/AdminLayout.tsx`
- Berisi: `<Outlet />` saja (topbar & sidebar ada di dalam AdminDashboardPage)
- Dipakai: semua halaman admin

### AuthLayout
- Tidak ada layout wrapper — halaman login/register full page mandiri

---

## Redirect Rules (ProtectedRoute)

```
Belum login         → redirect ke /auth/login
Login sebagai user  → akses /admin → redirect ke /dashboard
Login sebagai admin → akses /dashboard → redirect ke /admin
```

---

## Halaman — Detail Konten

### 1. Landing Page (`/`)
Sections berurutan:
1. **Navbar** — Logo, menu: Courses | Artikel | Komunitas | Pricing, Cart icon + Login + Start Free Trial
2. **Hero** — 2 kolom: teks kiri (heading, subtext, 2 CTA button, stats row) + gambar kanan
3. **Features** — "Kenapa CodeTrack Berbeda?" — 3 card: Sistem Produktivitas | GitHub Integration | Komunitas Supportive
4. **Testimonials** — Carousel 1 card: bintang, quote, foto + nama + jabatan
5. **Course Populer** — Grid 3 kolom, 3 CourseCard
6. **CTA Banner** — Gradient indigo-purple, heading, tombol "Daftar Sekarang"
7. **Footer** — 4 kolom dark: brand | Produk | Perusahaan | Social Media

### 2. Katalog Course (`/courses`)
- Banner promo (dismissible)
- Heading + search bar
- Stats row: 150+ Courses | 10,000+ Students | 95% Completion Rate
- Filter tabs: Semua | Web Dev | Mobile | Data Science | Backend | dll
- Sort dropdown + toggle grid/list view
- Sidebar filter: Level | Harga | Durasi | Rating | Fitur
- Grid 3 kolom CourseCard dengan pagination "Load More"

### 3. Detail Course (`/courses/:slug`)
- Breadcrumb
- 2 kolom: konten kiri (judul, deskripsi, kurikulum) + sticky card kanan (harga, CTA beli/enroll, info course)
- Badge level + kategori
- Info: rating, students, durasi, instruktur
- Tombol: "Lihat Detail" → navigasi ke halaman ini | "Mulai Gratis" untuk course free

### 4. Arsip Artikel (`/articles`)
- Header: Arsip Artikel
- Grid artikel dengan thumbnail, judul, excerpt, author, tanggal, read time
- Filter kategori

### 5. Detail Artikel (`/articles/:slug`)
- Header artikel: judul, author, tanggal, read time, thumbnail
- Konten artikel
- Sidebar: artikel terkait

### 6. Login (`/auth/login`)
- Full page centered
- Card: Email + Password input, tombol Login, link ke Register
- Social login: Google + GitHub
- Demo credentials hint (untuk keperluan presentasi)

### 7. Register (`/auth/register`)
- Full page centered (gradient background)
- Card: Full Name + Email + Register as (Student/Instructor) + Password + Confirm Password
- Checkbox terms & conditions
- Tombol Create Account
- Social login: Google + GitHub

### 8. User Dashboard (`/dashboard`)
- Navbar user (Logo, menu, notif, avatar dropdown)
- Welcome header gradient indigo-purple + streak pill
- Quick stats: 4 card (Courses Enrolled | Learning Time | Certificates | Streak)
- 2 kolom [65%|35%]:
  - Kiri: Continue Learning + In Progress list + Recommended (2x2 grid) + Streak Calendar + Recent Activity
  - Kanan: Monthly Goals card (gradient) + Upcoming Deadlines + Achievements + Community + Quick Actions

### 9. Keranjang (`/dashboard/cart`)
- List item keranjang: thumbnail, judul, instruktur, harga
- Tombol hapus per item
- Summary: subtotal, diskon, total
- Tombol Checkout

### 10. Pembayaran (`/dashboard/checkout`)
- Form detail pembayaran
- Pilihan metode: Transfer | Kartu Kredit | E-Wallet
- Order summary
- Tombol Bayar Sekarang

### 11. History Transaksi (`/dashboard/history`)
- Tabel transaksi: Invoice | Course | Tanggal | Jumlah | Status
- Filter status
- Pagination

### 12. Admin Dashboard (`/admin`)
- Topbar navy `#312E81`: Logo + Search + Bell + Avatar
- Sidebar fixed: Menu sections (Main | Content Management | User Management | Commerce | Settings)
- Header: Welcome + date + filter (Today/Week/Month/Year) + action buttons
- KPI cards 5 kolom (Revenue | Users | Courses | Students | Health)
- 2 kolom [65%|35%]: Revenue chart + Top Courses table | Recent Activity + Pending Reviews + Goals + Quick Actions
- 3 kolom: secondary metrics (Conversion | Avg Transaction | Completion | Rating | Tickets | Refund)
- 2 kolom: Latest Transactions + Newest Users
- 3 kolom: Traffic Sources (pie) + User Devices (progress) + Top Locations (progress)
- Alert bars (success | warning | info)

### 13. Kelola Artikel (`/admin/articles`)
- Topbar + Sidebar (sama dengan admin dashboard)
- Tabel artikel: judul, kategori, author, tanggal, status, actions
- Tombol tambah artikel
- Filter + search

### 14. Kelola Produk (`/admin/courses`)
- Topbar + Sidebar
- Tabel course: judul, kategori, instruktur, students, harga, status, actions
- Tombol tambah course
- Filter + search

### 15. Kelola Pengguna (`/admin/users`)
- Topbar + Sidebar
- Tabel user: avatar, nama, email, role, tanggal daftar, status, actions
- Filter role + search

### 16. Kelola Transaksi (`/admin/transactions`)
- Topbar + Sidebar
- Tabel transaksi: invoice, customer, course, jumlah, status, tanggal, actions
- Filter status + date range + search
- Export button

---

## Navigasi Antar Halaman

```
Landing → Courses          : klik "Lihat Course" atau menu Courses
Landing → Login            : klik tombol Login di navbar
Landing → Register         : klik "Mulai Gratis 7 Hari" atau "Start Free Trial"
Login   → Dashboard        : setelah login sukses (role: user)
Login   → Admin            : setelah login sukses (role: admin)
Register → Login           : klik "Sign in"
Courses → Course Detail    : klik "Lihat Detail" pada CourseCard
Course Detail → Cart       : klik "Beli Sekarang"
Cart → Checkout            : klik "Checkout"
Checkout → History         : setelah bayar sukses
Dashboard → Courses        : klik "Browse Courses" atau "Continue Learning"
Admin sidebar → sub pages  : klik menu item di sidebar
```