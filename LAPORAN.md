# LAPORAN PROYEK — CodeTrack

**Platform Belajar Coding Online**

---

**Disusun oleh:**

[Nama Lengkap] — [NIM]
[Nama Lengkap] — [NIM]
[Nama Lengkap] — [NIM]

**Program Studi:** [Prodi]
**Fakultas:** [Fakultas]
**Universitas:** [Universitas]

**Mata Kuliah:** Workshop UI
**Dosen Pengampu:** [Nama Dosen]

**Tahun Akademik:** [Tahun]

---

<br>

# BAB 1
## PENDAHULUAN

### Latar Belakang

Perkembangan teknologi informasi yang pesat mendorong kebutuhan akan sumber daya manusia yang kompeten di bidang pemrograman. Namun, akses terhadap materi pembelajaran coding yang terstruktur, berkualitas, dan mudah diakses masih menjadi kendala bagi banyak calon developer, terutama di Indonesia. Banyak platform pembelajaran online yang tersedia, namun seringkali harganya mahal, materi tidak terstruktur, atau tidak menyediakan fitur pelacakan progres belajar yang memadai.

CodeTrack hadir sebagai solusi platform belajar coding online yang menyediakan kursus terstruktur, artikel edukatif, dan sistem pelacakan progres belajar yang komprehensif. Platform ini dirancang untuk memenuhi kebutuhan tiga jenis pengguna: pengunjung yang mencari informasi, siswa yang ingin belajar, dan admin yang mengelola konten.

### Deskripsi Topik

CodeTrack adalah aplikasi web **front-end** yang dibangun menggunakan **React 19** dengan **TypeScript**, **Vite 8** sebagai build tool, dan **Tailwind CSS v4** untuk styling. Proyek ini mengimplementasikan arsitektur **Clean Architecture 3-layer** (Domain, Data, Presentation) dengan **Dependency Injection** pattern untuk memisahkan concern antar layer.

**Scope proyek meliputi:**

| Area | Fitur |
|---|---|
| **Public Pages** | Landing page, katalog kursus (filter/sort/search), detail kursus, arsip artikel, detail artikel |
| **Authentication** | Login, register (role: student/instructor), protected routes, redirect rules |
| **Student Dashboard** | Statistik belajar, streak calendar, kursus berlangsung, rekomendasi, goals, achievements, deadlines, aktivitas terbaru |
| **Commerce** | Keranjang belanja, checkout dengan 3 metode pembayaran, riwayat transaksi |
| **Admin Panel** | Dashboard dengan KPI, grafik revenue, CRUD artikel, CRUD kursus, CRUD pengguna, manajemen transaksi |
| **Mock Data** | 7 file JSON untuk simulasi data tanpa backend |
| **Testing** | 101 unit test — utility functions, repository CRUD, auth flow, hooks, form validation |

Dibangun dengan **mock data** (tanpa backend sungguhan) untuk memvalidasi arsitektur dan UI sebelum integrasi API nyata.

### User Story

Berikut adalah user story yang digunakan sebagai acuan pengembangan:

#### Pengunjung (Visitor)

| ID | User Story | Priority |
|---|---|---|
| US-01 | Sebagai **pengunjung**, saya ingin melihat **landing page** yang menampilkan hero, fitur, testimoni, dan kursus populer agar saya memahami nilai platform | High |
| US-02 | Sebagai **pengunjung**, saya dapat **menelusuri katalog kursus** dengan filter kategori, level, harga, durasi, dan rating | High |
| US-03 | Sebagai **pengunjung**, saya dapat melihat **detail kursus** (deskripsi, instruktur, harga, rating, kurikulum) sebelum memutuskan membeli | High |
| US-04 | Sebagai **pengunjung**, saya dapat membaca **artikel** dan melihat **detail artikel** untuk mendapatkan ilmu coding gratis | Medium |
| US-05 | Sebagai **pengunjung**, saya dapat **mendaftar akun** sebagai student atau instructor | High |
| US-06 | Sebagai **pengunjung**, saya dapat **login** untuk mengakses fitur yang dilindungi | High |

#### Student Terautentikasi

| ID | User Story | Priority |
|---|---|---|
| US-07 | Sebagai **student**, saya dapat melihat **dashboard pribadi** yang menampilkan kursus terdaftar, progres belajar, streak kalender, dan aktivitas terbaru | High |
| US-08 | Sebagai **student**, saya dapat **menambahkan kursus ke keranjang** dan mengelola item keranjang | High |
| US-09 | Sebagai **student**, saya dapat **checkout** (mengisi detail pembayaran dan memilih metode) untuk membeli kursus | High |
| US-10 | Sebagai **student**, saya dapat melihat **riwayat transaksi** dengan filter status | Medium |
| US-11 | Sebagai **student**, saya dapat melacak **streak belajar** dan melihat goals bulanan, tenggat waktu, dan achievements | Medium |
| US-12 | Sebagai **student**, saya dapat melihat **rekomendasi kursus** berdasarkan aktivitas saya | Low |

#### Admin

| ID | User Story | Priority |
|---|---|---|
| US-13 | Sebagai **admin**, saya dapat melihat **dashboard admin** dengan KPI, grafik revenue, aktivitas terbaru, dan analytics | High |
| US-14 | Sebagai **admin**, saya dapat **mengelola kursus** (CRUD lengkap) melalui form modal | High |
| US-15 | Sebagai **admin**, saya dapat **mengelola artikel** (CRUD lengkap) dengan validasi form | High |
| US-16 | Sebagai **admin**, saya dapat **mengelola pengguna** (lihat detail, suspend, hapus, edit role) | High |
| US-17 | Sebagai **admin**, saya dapat **mengelola transaksi** (lihat, update status, hapus) | Medium |

### Use Case Diagram

Berikut adalah use case diagram yang menggambarkan interaksi aktor dengan sistem:

```
                    ┌─────────────────────────────────────┐
                    │            CodeTrack                │
                    │                                     │
    ┌──────────┐    │  ┌──────────────────────────────┐   │
    │          │    │  │     Melihat Landing Page      │   │
    │          │────┼──┤     Melihat Katalog Kursus    │   │
    │          │    │  │     Melihat Detail Kursus     │   │
    │          │    │  │     Membaca Artikel           │   │
    │ Visitor  │    │  └──────────────────────────────┘   │
    │          │    │                                     │
    │          │    │  ┌──────────────────────────────┐   │
    │          │────┼──┤        Register               │   │
    └──────────┘    │  └──────────────────────────────┘   │
                    │                                     │
    ┌──────────┐    │  ┌──────────────────────────────┐   │
    │          │    │  │         Login                 │   │
    │  Student │────┼──┤   (extends: Register)         │   │
    │          │    │  └──────────────────────────────┘   │
    │          │    │                                     │
    │          │    │  ┌──────────────────────────────┐   │
    │          │────┼──┤  Melihat Dashboard Student   │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Mengelola Keranjang         │   │
    │          │────┼──┤                               │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Melakukan Checkout          │   │
    │          │────┼──┤                               │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │────┼──┤  Melihat Riwayat Transaksi   │   │
    └──────────┘    │  └──────────────────────────────┘   │
                    │                                     │
    ┌──────────┐    │  ┌──────────────────────────────┐   │
    │          │    │  │  Melihat Dashboard Admin     │   │
    │  Admin   │────┼──┤                               │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Mengelola Artikel (CRUD)    │   │
    │          │────┼──┤                               │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Mengelola Kursus (CRUD)     │   │
    │          │────┼──┤                               │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Mengelola Pengguna          │   │
    │          │────┼──┤  (CRUD + Suspend)             │   │
    │          │    │  ├──────────────────────────────┤   │
    │          │    │  │  Mengelola Transaksi         │   │
    │          │────┼──┤  (Update Status + Hapus)     │   │
    └──────────┘    │  └──────────────────────────────┘   │
                    └─────────────────────────────────────┘
```

### Use Case Specification

#### Use Case 1: Login

| Item | Deskripsi |
|---|---|
| **ID** | UC-01 |
| **Nama** | Login |
| **Aktor** | Pengunjung (Student, Instructor, Admin) |
| **Precondition** | Pengguna telah memiliki akun |
| **Postcondition** | Pengguna terautentikasi dan diarahkan ke halaman sesuai role (student → /dashboard, admin → /admin) |
| **Main Flow** | 1. Pengguna membuka halaman `/auth/login` <br> 2. Sistem menampilkan form login (email, password) <br> 3. Pengguna memasukkan email dan password <br> 4. Pengguna menekan tombol "Sign In" <br> 5. Sistem memvalidasi kredensial ke repository auth <br> 6. Sistem menyimpan data user ke `authStore` (Zustand) <br> 7. Sistem mengarahkan ke halaman sesuai role |
| **Alternative Flow** | 5a. Kredensial salah: sistem menampilkan pesan error merah <br> 5b. Gagal jaringan: sistem menampilkan pesan error dengan tombol retry <br> 6a. Saat loading: tombol "Sign In" berubah menjadi spinner "Signing in..." dan disabled |

#### Use Case 2: Checkout

| Item | Deskripsi |
|---|---|
| **ID** | UC-02 |
| **Nama** | Melakukan Checkout |
| **Aktor** | Student |
| **Precondition** | Student telah login dan memiliki minimal 1 item di keranjang |
| **Postcondition** | Transaksi berhasil dibuat, keranjang dikosongkan, student diarahkan ke riwayat transaksi |
| **Main Flow** | 1. Student membuka halaman `/dashboard/cart` <br> 2. Sistem menampilkan daftar item keranjang dan ringkasan harga <br> 3. Student menekan tombol "Checkout" <br> 4. Sistem menampilkan halaman checkout dengan form pembayaran <br> 5. Student mengisi data pembeli dan memilih metode bayar <br> 6. Student menekan tombol "Bayar Sekarang" <br> 7. Sistem memanggil `repos.transaction.create()` <br> 8. Sistem mengosongkan keranjang <br> 9. Sistem mengarahkan ke halaman riwayat transaksi |
| **Alternative Flow** | 6a. Keranjang kosong: tombol "Checkout" disabled <br> 7a. Pembayaran gagal: error ditampilkan di halaman yang sama (tidak redirect) <br> 7b. Saat loading: tombol "Bayar Sekarang" berubah menjadi spinner |

#### Use Case 3: Mengelola Artikel (CRUD)

| Item | Deskripsi |
|---|---|
| **ID** | UC-03 |
| **Nama** | Mengelola Artikel |
| **Aktor** | Admin |
| **Precondition** | Admin telah login dan berada di halaman `/admin/articles` |
| **Postcondition** | Data artikel berhasil ditambahkan/diubah/dihapus |
| **Main Flow (Tambah)** | 1. Admin menekan tombol "Tambah Artikel" <br> 2. Sistem menampilkan modal form dengan field (judul, slug, kategori, status, excerpt, thumbnail, konten, tags) <br> 3. Admin mengisi form dan menekan "Simpan" <br> 4. Sistem memvalidasi form (zod + react-hook-form) <br> 5. Sistem memanggil `repos.article.create()` <br> 6. Modal tertutup, tabel diperbarui |
| **Main Flow (Edit)** | 1. Admin menekan tombol Edit pada salah satu baris tabel <br> 2. Sistem menampilkan modal form dengan data terisi <br> 3. Admin mengubah data dan menekan "Simpan" <br> 4. Sistem memanggil `repos.article.update()` <br> 5. Modal tertutup, tabel diperbarui |
| **Main Flow (Hapus)** | 1. Admin menekan tombol Hapus pada salah satu baris tabel <br> 2. Sistem menampilkan dialog konfirmasi <br> 3. Admin menekan "Hapus" <br> 4. Sistem memanggil `repos.article.delete()` <br> 5. Dialog tertutup, tabel diperbarui |
| **Alternative Flow** | 4a. Form tidak valid: error ditampilkan per field <br> 4b. Saat simpan: tombol berubah menjadi "Menyimpan..." + spinner <br> 3a. (Hapus) Admin menekan "Batal": dialog tertutup, tidak ada perubahan |

---

<br>

# BAB 2
## DESAIN SISTEM

### Arsitektur Sistem

CodeTrack dibangun menggunakan **Clean Architecture (3-Layer)** yang memisahkan kode menjadi tiga lapisan dengan dependency rule yang ketat:

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                   │
│  src/features/  (React components, hooks, pages)    │
│  src/shared/    (Reusable UI, layout, re-exports)   │
│  src/app/       (Router, entry point)               │
│                                                     │
│         ↓ depends on (import interfaces)            │
├─────────────────────────────────────────────────────┤
│                   DOMAIN LAYER                       │
│  src/core/domain/entities/    (Type definitions)     │
│  src/core/domain/repositories/ (Abstract interfaces)│
│  src/core/domain/di.ts        (DI container)        │
│  src/core/utils/              (Pure functions)      │
│                                                     │
│         ↑ implemented by                            │
├─────────────────────────────────────────────────────┤
│                    DATA LAYER                        │
│  src/data/repositories/  (Mock implementations)     │
│  src/data/sources/mock/  (JSON data files)          │
└─────────────────────────────────────────────────────┘
```

**Prinsip utama:** Presentation layer hanya bergantung pada domain layer (interfaces). Data layer mengimplementasikan interfaces tersebut. Domain layer tidak tahu apa-apa tentang React atau implementasi data. Perpindahan dari mock ke API nyata cukup dengan mengubah satu baris di `main.tsx`.

### Dependency Injection

Proyek menggunakan **Service Locator pattern** untuk dependency injection:

```typescript
// main.tsx — Registrasi sekali di awal
injectRepositories({
  courseRepo: new MockCourseRepository(),
  authRepo: new MockAuthRepository(),
  articleRepo: new MockArticleRepository(),
  transactionRepo: new MockTransactionRepository(),
  dashboardRepo: new MockDashboardRepository(),
  adminDashboardRepo: new MockAdminDashboardRepository(),
  userRepo: new MockUserRepository(),
})

// Di komponen React — akses via global `repos`
const { data } = useAsync(() => repos.course.findAll())
```

### Teknologi yang Digunakan

| Layer | Teknologi | Versi | Fungsi |
|---|---|---|---|
| **Framework** | React | 19 | Kerangka utama aplikasi |
| **Bahasa** | TypeScript | 6 | Type safety |
| **Build Tool** | Vite | 8 | Bundling & dev server |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **UI Primitives** | shadcn/ui + Radix UI | — | Komponen aksesibel |
| **Routing** | React Router | 7 | Navigasi SPA |
| **State Management** | Zustand | 5 | Global state (persisted) |
| **Form** | react-hook-form + Zod | 7 + 4 | Validasi form |
| **Charts** | Recharts | 3 | Grafik dashboard admin |
| **Icons** | Lucide React | 1 | Icon set |
| **Animation** | Framer Motion | 12 | Transisi halaman |
| **Testing** | Vitest | 4 | Unit test |
| **Font** | Geist Variable | — | Tipografi |

### Struktur Rute (Routing)

| Rute | Layout | Komponen | Akses |
|---|---|---|---|
| `/` | PublicLayout | LandingPage | Publik |
| `/courses` | PublicLayout | CourseCatalogPage | Publik |
| `/courses/:slug` | PublicLayout | CourseDetailPage | Publik |
| `/articles` | PublicLayout | ArticlesPage | Publik |
| `/articles/:slug` | PublicLayout | ArticleDetailPage | Publik |
| `/auth/login` | — | LoginPage | Publik |
| `/auth/register` | — | RegisterPage | Publik |
| `/dashboard` | ProtectedRoute(student) + UserLayout | UserDashboardPage | Student |
| `/dashboard/cart` | ↑ | CartPage | Student |
| `/dashboard/checkout` | ↑ | CheckoutPage | Student |
| `/dashboard/history` | ↑ | TransactionHistoryPage | Student |
| `/admin` | ProtectedRoute(admin) + AdminLayout | AdminDashboardPage | Admin |
| `/admin/articles` | ↑ | ArticleManagementPage | Admin |
| `/admin/courses` | ↑ | CourseManagementPage | Admin |
| `/admin/users` | ↑ | UserManagementPage | Admin |
| `/admin/transactions` | ↑ | TransactionManagementPage | Admin |
| `*` | — | NotFoundPage | Publik |

### State Management

Dua store global menggunakan Zustand dengan persist ke localStorage:

**authStore** (key: `codetrack-auth`)
```typescript
{
  user: { id, name, email, role, avatar } | null
  isAuthenticated: boolean
  login(user): void
  logout(): void
}
```

**cartStore** (key: `codetrack-cart`)
```typescript
{
  items: CartItem[]
  total: number
  itemCount: number
  add(item): void
  remove(id): void
  clear(): void
}
```

### Wireframe

> _[Screenshot wireframe/rancangan antarmuka — silakan sisipkan gambar di sini]_

Berikut adalah gambaran struktur halaman utama:

```
Landing Page:
┌─────────────────────────────────────────────────────┐
│ [Logo]  Courses │ Artikel  │           Login │ Trial │
├─────────────────────────────────────────────────────┤
│  Hero Section: Heading + CTA + Stats                │
├─────────────────────────────────────────────────────┤
│  Features: 3 Kolom                                  │
├─────────────────────────────────────────────────────┤
│  Testimonials: Carousel                             │
├─────────────────────────────────────────────────────┤
│  Popular Courses: 3 Course Card                      │
├─────────────────────────────────────────────────────┤
│  CTA Banner + Footer                                │
└─────────────────────────────────────────────────────┘

Admin Layout:
┌─────────────┬───────────────────────────────────────┐
│             │  Topbar: Logo │ Search │ Bell │ Avatar │
│   Sidebar   ├───────────────────────────────────────┤
│             │                                       │
│  Dashboard  │         Content Area                   │
│  Artikel    │                                       │
│  Course     │   (Outlet — halaman aktif)            │
│  Pengguna   │                                       │
│  Transaksi  │                                       │
│             │                                       │
└─────────────┴───────────────────────────────────────┘
```

### Front End

#### Landing Page (`/`)

> _[Screenshot Landing Page]_

Halaman utama yang terdiri dari:
- **Navbar** — Logo + menu navigasi (Courses, Artikel) + tombol Login dan Start Free Trial
- **Hero Section** — 2 kolom: heading, subtext, CTA buttons, dan statistik (1000+ Learners, 95% Completion, dll)
- **Features Section** — 3 kartu "Kenapa CodeTrack Berbeda?" (produktivitas, integrasi GitHub, komunitas)
- **Testimonials Section** — Carousel dengan rating bintang, quote, avatar, nama, dan role
- **Popular Courses** — 3 kartu CourseCard dari data populer
- **CTA Banner** — Gradien indigo-purple dengan tombol "Daftar Sekarang"
- **Footer** — 4 kolom: brand, produk, perusahaan, social media

#### Register (`/auth/register`)

> _[Screenshot Register Page]_

Halaman full-page terpusat dengan gradient background, terdiri dari:
- Form dengan field: Nama Lengkap, Email, Role (Student/Instructor dropdown), Password, Konfirmasi Password
- Checkbox persetujuan Terms of Service
- Tombol "Create Account" dengan loading state (spinner + "Creating account...")
- Opsi login dengan Google dan GitHub (inline SVG)
- Link ke halaman Login

#### Login (`/auth/login`)

> _[Screenshot Login Page]_

Halaman full-page terpusat dengan gradient background, terdiri dari:
- Form: Email + Password (dengan show/hide toggle)
- Tombol "Sign In" dengan loading state (spinner + "Signing in...")
- Error message inline untuk kredensial salah
- Opsi login dengan Google dan GitHub
- Link ke halaman Register

#### Katalog Kursus (`/courses`)

> _[Screenshot Course Catalog]_

Halaman pencarian dan penelusuran kursus:
- **Promo Banner** — Dismissible banner "Free Trial 7 Hari"
- **Search Bar** — Pencarian berdasarkan judul atau instruktur
- **Stats Row** — 150+ Courses, 10,000+ Students, 95% Completion
- **Category Tabs** — Filter horizontal berdasarkan kategori
- **Filter Sidebar** (desktop) / **Filter Sheet** (mobile): Level, Harga, Durasi, Rating, Fitur
- **Sort Dropdown** — Terpopuler, Terbaru, Harga Terendah, Rating Tertinggi
- **Grid/List Toggle** — Ubah tampilan grid/list
- **Load More** — Paginasi 6 item per klik

#### Detail Kursus (`/courses/:slug`)

> _[Screenshot Course Detail]_

Halaman detail kursus:
- **Breadcrumb** — Navigasi hierarki
- **Layout 2 Kolom** — Konten (kiri) + Sticky info card (kanan)
- **Badges** — Kategori + Level
- **Course Info** — Rating, jumlah student, durasi, instruktur dengan avatar
- **CTA** — "Beli Sekarang" (berbayar) / "Mulai Gratis" (gratis) — menambah ke keranjang
- **Kurikulum** — Daftar materi kursus

#### Arsip Artikel (`/articles`)

> _[Screenshot Articles Page]_

Halaman artikel dengan:
- **Header** — "Arsip Artikel"
- **Search Bar** — Pencarian artikel
- **Featured Article** — Kartu hero besar
- **Grid 2 Kolom** — Kartu artikel dengan thumbnail, judul, excerpt, author, tanggal, read time
- **Sidebar** — Artikel populer, tag populer, newsletter subscribe
- **Category Filter** — Filter berdasarkan kategori
- **Pagination** — Navigasi halaman

#### Detail Artikel (`/articles/:slug`)

> _[Screenshot Article Detail]_

Halaman detail artikel dengan:
- **Reading Progress Bar** — Indikator progres membaca
- **Header** — Judul, author (avatar + nama), tanggal publikasi, read time
- **Thumbnail Utama** — Gambar sampul artikel
- **Konten** — Isi artikel
- **Sidebar** — Artikel terkait
- **Share Buttons** — Sosial media sharing

#### Keranjang (`/dashboard/cart`)

> _[Screenshot Cart Page]_

Halaman keranjang belanja:
- **Daftar Item** — Thumbnail, judul kursus, instruktur, harga per item
- **Tombol Delete** — Hapus per item atau kosongkan semua
- **Ringkasan** — Subtotal, total
- **CTA** — "Checkout" (disabled jika keranjang kosong)
- **Empty State** — Ilustrasi + tombol "Browse Courses" jika kosong

#### Checkout (`/dashboard/checkout`)

> _[Screenshot Checkout Page]_

Halaman pembayaran:
- **Form Detail Pembeli** — Nama, email, telepon, alamat
- **Metode Pembayaran** — 3 pilihan: Transfer Bank, Kartu Kredit, E-Wallet
- **Ringkasan Pesanan** — Daftar item + total
- **CTA** — "Bayar Sekarang" dengan loading state
- **Success Screen** — Konfirmasi pembayaran berhasil setelah submit

#### Riwayat Transaksi (`/dashboard/history`)

> _[Screenshot Transaction History]_

Halaman riwayat transaksi:
- **Tabel** — Invoice, Course, Tanggal, Jumlah, Status
- **Filter Status** — Tombol: Semua, Success, Pending, Failed
- **Pagination** — Navigasi halaman
- **Empty State** — Jika belum ada transaksi

#### Dashboard Student (`/dashboard`)

> _[Screenshot User Dashboard]_

Halaman utama student setelah login:
- **Welcome Header** — Gradien indigo-purple + streak badge
- **Quick Stats** — 4 kartu: Courses Enrolled, Learning Time, Certificates, Streak
- **Layout 65/35**:
  - **Kiri:** Continue Learning, In Progress, Recommended Courses (2×2 grid), Streak Calendar (GitHub-style contribution), Recent Activity
  - **Kanan:** Monthly Goals (gradien card), Upcoming Deadlines (dengan urgency badge), Achievements, Community/Forum, Quick Actions

#### Dashboard Admin (`/admin`)

> _[Screenshot Admin Dashboard]_

Halaman utama admin:
- **Topbar** — Logo, search, notifikasi bell, avatar + dropdown logout
- **Sidebar** — Navigasi tetap, collapsible di mobile
- **Header** — Welcome + date + period filter (Today/Week/Month/Year) + Refresh button
- **KPI Cards** — 5 kartu: Revenue, Users, Courses, Students, Health (masing-masing dengan gradient, icon, trend)
- **Layout 65/35** — Grafik Revenue (Recharts AreaChart) + Top Courses / Activity Feed + Reviews + Goals + Quick Actions
- **Secondary Metrics** — 6 kartu: Conversion Rate, Avg Transaction, Completion Rate, Rating, Tickets, Refund Rate
- **2 Kolom** — Latest Transactions + Newest Users
- **3 Kolom** — Traffic Sources (pie chart), User Devices (progress bar), Top Locations (progress bar)
- **Alert Bars** — Success, Warning, Info (dismissible)

#### Kelola Artikel (`/admin/articles`)

> _[Screenshot Article Management]_

Halaman CRUD artikel:
- **Stats Row** — Total Artikel, Published, Draft, Total Views
- **Search & Filter** — Pencarian, filter status (Semua/Published/Draft), filter kategori
- **Tabel** — Thumbnail + judul + excerpt, kategori badge, author, tanggal, status badge, views, actions (Edit/Preview/Hapus)
- **Bulk Actions** — Select all + toolbar (Publish/Draft/Hapus)
- **Pagination** — Showing X-Y of Z
- **Modal Tambah/Edit** — 8 field: judul (slug auto), kategori, status toggle, excerpt, thumbnail URL, konten, tags — react-hook-form + zod
- **Delete Confirm** — Dialog konfirmasi dengan judul artikel

#### Kelola Produk (`/admin/courses`)

> _[Screenshot Course Management]_

Halaman CRUD kursus:
- **Stats Row** — Total Course, Published, Draft, Total Students, Total Revenue
- **Search & Filter** — 3 dropdown: status, kategori, level
- **Tabel** — 11 kolom: thumbnail+judul+desc, kategori badge, level badge (`getLevelColor`), instruktur (avatar+inisial), students, harga (`formatRupiah`), revenue (`formatRupiahShort`), status badge, actions
- **Bulk Actions** — Select all + toolbar (Publish/Draft/Hapus)
- **Pagination**
- **Modal Tambah/Edit** — 13 field: judul, slug auto, deskripsi, kategori, level, instruktur, harga, harga asli, thumbnail, durasi, status toggle, tags, isBestseller checkbox
- **Delete Confirm**

#### Kelola Pengguna (`/admin/users`)

> _[Screenshot User Management]_

Halaman CRUD pengguna:
- **Stats Row** — Total Pengguna, Student, Instructor, Admin, Baru Bulan Ini
- **Search & Filter** — Filter role (Student/Instructor/Admin), filter status (Active/Inactive)
- **Tabel** — Avatar + nama + email, role badge (student=outline, instructor=blue, admin=indigo), status badge (Active=green/Inactive=gray), tanggal daftar, course enrolled, last active (relative), 4 actions
- **Bulk Actions** — Aktifkan/Suspend/Hapus
- **Modal Tambah/Edit** — 7 field: nama, email, role, status toggle, password (khusus baru), confirm password (khusus baru), avatar URL
- **Modal Detail** — Read-only: info dasar, stats (learning time/certificates/streak), enrolled courses with progress bar, aktivitas terbaru
- **Suspend Confirm** — Amber warning dialog
- **Delete Confirm** — Red danger dialog

#### Kelola Transaksi (`/admin/transactions`)

> _[Screenshot Transaction Management]_

Halaman manajemen transaksi:
- **Stats Row** — Total, Success, Pending, Failed, Total Revenue
- **Search & Filter** — 4 toggle buttons (All/Success/Pending/Failed)
- **Tabel** — Invoice, customer, course, amount, status badge, payment method, date, 2 actions
- **Bulk Actions** — Mark Success/Pending/Failed, Hapus
- **Edit Status Modal** — Selector 3 status
- **Delete Confirm**
- **Export Button**

### Pengujian Sistem

Pengujian dilakukan pada tiga area utama: **unit test** (utility functions + form validation), **repository test** (CRUD operations), **hook test** (async behavior), dan **build test** (TypeScript + production build).

#### Unit Test (Vitest)

Proyek menggunakan **Vitest** dengan environment **node** untuk pure functions dan **jsdom** untuk React hooks. Terdapat **101 test cases** yang mencakup:

| Kelompok | File | Jumlah Test | Cakupan |
|---|---|---|---|
| **Utility Functions** | `format.test.ts` | 14 | `formatRupiah`, `formatRupiahShort`, `getRelativeTime` |
| | `badge.test.ts` | 20 | `getLevelColor`, `getStatusColor`, `getCategoryColor`, `getUrgencyColor` |
| **Form Validation** | `auth-schemas.test.ts` | 7 | Login schema, Register schema (valid, invalid email, mismatched password, terms) |
| | `admin-schemas.test.ts` | 12 | Article schema, Course schema (valid, short title, invalid slug, URL, price, level) |
| **Repository CRUD** | `MockArticleRepository.test.ts` | 12 | findAll, findBySlug, create (id, author, readTime, persist), update, delete, error handling |
| | `MockCourseRepository.test.ts` | 13 | findAll, findBySlug, findByCategory, findFeatured, create (id, isFree, persist), update (fields, discount), delete |
| | `MockUserRepository.test.ts` | 11 | findAll (all, by role), findById, create, update, delete, getUserDetail |
| | `MockAuthRepository.test.ts` | 6 | Login (student, admin, instructor, invalid), Register (student role, instructor role) |
| **React Hooks** | `useAsync.test.tsx` | 6 | Loading state, data success, error state, non-Error rejection, refetch, cancel on unmount |
| **Total** | | **101** | ✅ |

**Hasil:** ✅ 101/101 test passed.

#### Build Test

| Pengujian | Command | Hasil |
|---|---|---|
| TypeScript Compile | `tsc -b` | ✅ 0 error |
| Production Build | `vite build` | ✅ Sukses (1.2s) |
| Lint | `eslint .` | ✅ 0 error (hanya warning pre-existing) |

#### Chaos Testing

Data khusus dibuat untuk menguji ketahanan layout terhadap edge cases:

| Test Data | Skenario | Yang Diuji |
|---|---|---|
| Chaos Course | Judul 200+ karakter, rating 0, student 0, harga 1.25M, thumbnail broken | `line-clamp`, `ImageWithFallback`, `formatRupiah`, zero-value rendering |
| Chaos User | Nama super panjang, email super panjang, avatar null | `truncate`, avatar fallback, table column overflow |

#### Responsive Testing

Layout diuji pada 3 breakpoint:

| Breakpoint | Ukuran | Status |
|---|---|---|
| Mobile | < 640px | Card layout untuk tabel admin, hamburger menu, stacked grid |
| Tablet | 640 - 1024px | Grid 2 kolom, sidebar collapsible |
| Desktop | > 1024px | Full layout, 5-column KPI, sidebar fixed |

---

<br>

# BAB 3
## PENUTUP

### Kesimpulan

CodeTrack berhasil dikembangkan sebagai platform belajar coding online yang mencakup:

1. **16 halaman** dengan routing SPA
2. **Arsitektur Clean Architecture 3-layer** dengan Dependency Injection
3. **CRUD lengkap** untuk 4 modul admin (Artikel, Course, Pengguna, Transaksi)
4. **Flow commerce** lengkap: katalog → keranjang → checkout → riwayat
5. **Dashboard** untuk student (progress, streak, goals) dan admin (KPI, grafik, analytics)
6. **101 unit test** — utility functions, repository CRUD, auth flow, React hooks, form validation
7. **Mock data** dengan chaos testing untuk ketahanan layout
8. **Bundle optimization** dari 546 KB menjadi 101 KB (81% reduction)

### Saran Pengembangan

Beberapa hal yang dapat dikembangkan ke depannya:

| Saran | Deskripsi |
|---|---|
| **Integrasi Backend API** | Ganti mock repository dengan implementasi API nyata (cukup 1 baris di `main.tsx`) |
| **Autentikasi JWT** | Login dengan token, refresh token, session management |
| **Payment Gateway** | Integrasi pembayaran nyata (Midtrans, Xendit) |
| **Component Test** | Tambah unit test untuk React components (UI, layout) — saat ini sudah ada test untuk hooks dan utility |
| **Dark Mode** | Implementasi theme toggle dengan Tailwind dark mode |
| **PWA** | Service worker, offline support, installable |
| **Real-time** | Notifikasi real-time untuk admin (transaksi baru, user baru) |
| **CI/CD** | GitHub Actions untuk test otomatis sebelum deploy |
| **i18n** | Dukungan multi-bahasa (minimal EN/ID) |
| **E2E Testing** | Cypress atau Playwright untuk end-to-end testing |

---

<br>

_Dokumen ini disusun sebagai laporan proyek mata kuliah Workshop UI._

_[Screenshot dan data pribadi dapat dilengkapi oleh penulis]_
