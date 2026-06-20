# Components Registry — CodeTrack

Daftar semua komponen yang ada atau perlu dibuat. Update file ini setiap kali komponen baru selesai dibuat.

## Definition of Done (DoD) - Kriteria Kelulusan Wajib:

**A. Compatibility & Fluid Constraints:**
1. **Fluid Width:** Dilarang keras menggunakan ukuran tetap absolut (contoh: `w-[300px]`, `h-[500px]`) pada kontainer utama. WAJIB menggunakan persentase (`w-full`) atau batasan maksimum (`max-w-md`, dsb).
2. **Multi-Viewport Test:** Komponen wajib utuh, tidak terpotong, dan tidak tumpang tindih pada resolusi:
   - Mobile (`xs/sm`: 320px - 640px)
   - Tablet (`md`: 768px)
   - Desktop (`lg/xl`: 1024px ke atas)
3. **Layouting:** Dilarang menggunakan margin manual (`ml-1`, `mr-4`, `mt-2`) untuk mengatur jarak elemen sejajar. WAJIB menggunakan pembungkus *Flex* atau *Grid* dengan utilitas `gap`.

**B. Content & Asset Resilience (Ketahanan Visual):**
4. **Layout Shift Prevention:** Setiap elemen `<img>` atau *thumbnail* WAJIB dibungkus kontainer dengan rasio aspek pasti (contoh: `aspect-video`, `aspect-square`) untuk mencegah *Cumulative Layout Shift* (CLS) saat gambar sedang diunduh.
5. **Broken Image Handling:** Dilarang me-render gambar tanpa penanganan galat (seperti komponen `ImageWithFallback`). Jika URL gambar putus/gagal dimuat, antarmuka wajib menampilkan *placeholder* elegan, bukan ikon *broken image* bawaan peramban.

**C. Ekstrem Data Handling:**
6. **Text Overflow:** Komponen tidak boleh melebar merusak *layout* saat dirender dengan teks data dinamis (seperti judul kursus atau nama instruktur) sepanjang 200 karakter. Wajib ada proteksi `truncate` atau `line-clamp-X`.

---

## Shared — Layout (`src/shared/components/layout/`)

| Komponen | File | Status | Dipakai di |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ✅ Done | PublicLayout, UserLayout |
| Footer | `Footer.tsx` | ✅ Done | PublicLayout |
| PublicLayout | `PublicLayout.tsx` | ✅ Done | Public routes |
| UserLayout | `UserLayout.tsx` | ✅ Done | User routes (berisi Navbar + Outlet) |
| AdminLayout | `AdminLayout.tsx` | ✅ Done | Admin routes (berisi AdminTopbar + AdminSidebar + Outlet) |
| ProtectedRoute | `ProtectedRoute.tsx` | ✅ Done | Router |
| AdminTopbar | `AdminTopbar.tsx` | ✅ Done | AdminLayout |
| AdminSidebar | `AdminSidebar.tsx` | ✅ Done | AdminLayout |

---

## Shared — UI (`src/shared/components/ui/`)

Semua dari shadcn/ui — install via `npx shadcn add [component]`

| Komponen | Dipakai di |
|---|---|
| Button | Semua halaman |
| Card | Semua halaman |
| Input | Form, search |
| Badge | Course level, status, role |
| Progress | Dashboard, course card |
| Separator | Navbar, form |
| Checkbox | Register form |
| DropdownMenu | User navbar avatar |
| Avatar | User info |
| Tabs | Course catalog filter |
| Select | Sort dropdown |
| Dialog | Modal konfirmasi |
| Sheet | Mobile sidebar |
| Skeleton | Loading state |
| Toast / Sonner | Notifikasi aksi |

---

## Shared — Common (`src/shared/components/common/`)

| Komponen | Props | Dipakai di | Status |
|---|---|---|---|
| `CourseCard` | `course: Course, variant?: 'grid'\|'list'` | Landing, Catalog, Dashboard | ✅ Done |
| `StatCard` | `icon, value, label, trend?, gradient?` | Admin KPI, User stats | ⬜ Todo |
| `DataTable` | `columns, data, loading?` | Semua halaman Kelola | ⬜ Todo |
| `PageHeader` | `title, breadcrumb?` | Admin sub-pages | ⬜ Todo |
| `EmptyState` | `title, description, action?` | Tabel kosong, empty states | ✅ Done |
| `ErrorState` | `message?, onRetry?` | Error handling semua halaman | ✅ Done |
| `LoadingSpinner` | `size?, fullPage?` | Loading state | ✅ Done |
| `AlertBanner` | `type, message, action?` | Admin dashboard | ⬜ Todo |
| `StatusBadge` | `status: TransactionStatus` | Tabel transaksi | ⬜ Todo |
| `NotFoundPage` | — | Catch-all route `*` | ✅ Done |
| `LevelBadge` | `level: CourseLevel` | Course card | ✅ Done |

---

## Feature Components

### Landing (`src/features/landing/components/`)
| Komponen | Keterangan | Status |
|---|---|---|
| `HeroSection` | 2 kolom: teks + gambar, CTA buttons, stats | ✅ Done |
| `FeaturesSection` | 3 card fitur unggulan | ✅ Done |
| `TestimonialsSection` | Carousel testimonial dengan arrow nav | ✅ Done |
| `CoursesSection` | Grid 3 CourseCard, heading "Course Populer" | ✅ Done |
| `CTASection` | Banner gradient indigo-purple | ✅ Done |

> `CoursesSection` menggunakan `CourseCard` dari `shared/components/common/`

### Auth (`src/features/auth/components/`)
| Komponen | Keterangan | Status |
|---|---|---|
| `LoginForm` | Form email + password + social login | ✅ Done |
| `RegisterForm` | Form lengkap + terms checkbox | ✅ Done |
| `SocialLoginButtons` | Google + GitHub buttons | ✅ Done |

### Courses (`src/features/courses/components/`)
| Komponen | Keterangan | Status |
|---|---|---|
| `CourseFilter` | Sidebar filter: level, harga, durasi, rating, fitur | ✅ Done |
| `CourseCategoryTabs` | Tab filter kategori horizontal | ✅ Done |
| `CourseGrid` | Wrapper grid dengan toggle grid/list | ✅ Done |
| `CourseListItem` | Tampilan list view untuk course | ⬜ Todo (low priority) |

### Articles (`src/features/articles/components/`)
| Komponen | Keterangan |
|---|---|
| `ArticleCard` | Thumbnail + judul + excerpt + meta |
| `ArticleMeta` | Author, tanggal, read time |

### Commerce (`src/features/commerce/components/`)
| Komponen | Keterangan |
|---|---|
| `CartItem` | Row item keranjang dengan hapus |
| `OrderSummary` | Subtotal, diskon, total, CTA |
| `PaymentMethodSelector` | Radio button Transfer/Kartu/E-Wallet |

### User Dashboard (`src/features/user-dashboard/components/`)
| Komponen | File | Status |
|---|---|---|
| `WelcomeHeader` | `WelcomeHeader.tsx` | ✅ Done |
| `StatCards` | `StatCards.tsx` | ✅ Done |
| `ContinueLearningSection` | `ContinueLearningSection.tsx` | ✅ Done |
| `RecommendedCoursesSection` | `RecommendedCoursesSection.tsx` | ✅ Done |
| `StreakCalendar` | `StreakCalendar.tsx` | ✅ Done |
| `RecentActivitySection` | `RecentActivitySection.tsx` | ✅ Done |
| `MonthlyGoalsCard` | `MonthlyGoalsCard.tsx` | ✅ Done |
| `UpcomingDeadlines` | `UpcomingDeadlines.tsx` | ✅ Done |
| `AchievementsCard` | `AchievementsCard.tsx` | ✅ Done |
| `CommunityCard` | `CommunityCard.tsx` | ✅ Done |
| `QuickActionsCard` | `QuickActionsCard.tsx` | ✅ Done |

### Admin (`src/features/admin/components/`)
| Komponen | Keterangan |
|---|---|
| `AdminSidebar` | Fixed sidebar dengan SidebarItem + SidebarSection |
| `AdminTopbar` | Navy topbar: logo + search + bell + avatar |
| `SidebarItem` | Button item dengan active state (border-l-4) |
| `SidebarSection` | Label section uppercase |
| `KpiCard` | Stat card dengan gradient + icon + trend badge |
| `RevenueChart` | AreaChart recharts dengan gradient fill |
| `TopCoursesTable` | Table dengan trophy rank + badge growth |
| `ActivityFeed` | Scrollable feed dengan avatar + icon + action |
| `QuickActionsGrid` | Grid 2x3 action buttons warna-warni |
| `TrafficPieChart` | PieChart donut dengan legend |
| `DeviceBreakdown` | Progress bars Desktop/Mobile/Tablet |
| `TopLocations` | Progress bars per kota dengan flag emoji |
| `TransactionRow` | Invoice mono + customer + amount + status badge |
| `UserRow` | Avatar + nama + email + role badge + time |
| `AlertBar` | Border-left alert: success/warning/info |
| `PendingReviewsCard` | Counter + list item + CTA button |
| `TodayGoalsCard` | Progress + checklist items |

---

## Status Legend
- ✅ **Done** — Telah lulus 6 Kriteria Audit (DoD) tanpa cacat.
- ⚠️ **Pending Audit** — Komponen ada, tapi belum diuji dengan simulasi asinkron, data ekstrem, dan layar seluler. Jangan anggap selesai.
- ⬜ **Todo** — Belum dikerjakan.
- 🚨 **Wajib Dibuat** — Komponen kritikal untuk ketahanan *front-end* yang sebelumnya Anda abaikan.

> Update status di sini setiap kali menyelesaikan komponen.