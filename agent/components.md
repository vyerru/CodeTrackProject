# Components Registry — CodeTrack

Daftar semua komponen yang ada atau perlu dibuat. Update file ini setiap kali komponen baru selesai dibuat.

---

## Shared — Layout (`src/shared/components/layout/`)

| Komponen | File | Status | Dipakai di |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ✅ Done | PublicLayout |
| Footer | `Footer.tsx` | ✅ Done | PublicLayout |
| PublicLayout | `PublicLayout.tsx` | ✅ Done | Public routes |
| UserLayout | `UserLayout.tsx` | ✅ Done | User routes |
| AdminLayout | `AdminLayout.tsx` | ✅ Done | Admin routes |
| ProtectedRoute | `ProtectedRoute.tsx` | ✅ Done | Router |
| AdminTopbar | `AdminTopbar.tsx` | ⬜ Todo | Admin pages |
| AdminSidebar | `AdminSidebar.tsx` | ⬜ Todo | Admin pages |

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
| `EmptyState` | `title, description, action?` | Tabel kosong | ⬜ Todo |
| `LoadingSpinner` | `size?, fullPage?` | Lazy loading | ⬜ Todo |
| `AlertBanner` | `type, message, action?` | Admin dashboard | ⬜ Todo |
| `StatusBadge` | `status: TransactionStatus` | Tabel transaksi | ⬜ Todo |
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
| `CourseListItem` | Tampilan list view untuk course | ⬜ Todo |

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
- ✅ Done — komponen sudah selesai dibuat
- 🔄 In Progress — sedang dikerjakan
- ⬜ Todo — belum dibuat

> Update status di sini setiap kali menyelesaikan komponen.