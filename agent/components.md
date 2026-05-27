# Components Registry — CodeTrack

Daftar semua komponen yang ada atau perlu dibuat. Update file ini setiap kali komponen baru selesai dibuat.

---

## Shared — Layout (`src/shared/components/layout/`)

| Komponen | File | Status | Dipakai di |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ⬜ Todo | PublicLayout |
| Footer | `Footer.tsx` | ⬜ Todo | PublicLayout |
| PublicLayout | `PublicLayout.tsx` | ⬜ Todo | Public routes |
| UserLayout | `UserLayout.tsx` | ⬜ Todo | User routes |
| AdminLayout | `AdminLayout.tsx` | ⬜ Todo | Admin routes |
| ProtectedRoute | `ProtectedRoute.tsx` | ⬜ Todo | Router |
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

| Komponen | Props | Dipakai di |
|---|---|---|
| `CourseCard` | `course: Course, variant?: 'grid'\|'list'` | Landing, Catalog, Dashboard |
| `StatCard` | `icon, value, label, trend?, gradient?` | Admin KPI, User stats |
| `DataTable` | `columns, data, loading?` | Semua halaman Kelola |
| `PageHeader` | `title, breadcrumb?` | Admin sub-pages |
| `EmptyState` | `title, description, action?` | Tabel kosong |
| `LoadingSpinner` | `size?, fullPage?` | Lazy loading |
| `AlertBanner` | `type, message, action?` | Admin dashboard |
| `StatusBadge` | `status: TransactionStatus` | Tabel transaksi |
| `LevelBadge` | `level: CourseLevel` | Course card |

---

## Feature Components

### Landing (`src/features/landing/components/`)
| Komponen | Keterangan |
|---|---|
| `HeroSection` | 2 kolom: teks + gambar, CTA buttons, stats |
| `FeaturesSection` | 3 card fitur unggulan |
| `TestimonialsSection` | Carousel testimonial dengan arrow nav |
| `CoursesSection` | Grid 3 CourseCard, heading "Course Populer" |
| `CTASection` | Banner gradient indigo-purple |

> `CoursesSection` menggunakan `CourseCard` dari `shared/components/common/`

### Auth (`src/features/auth/components/`)
| Komponen | Keterangan |
|---|---|
| `LoginForm` | Form email + password + social login |
| `RegisterForm` | Form lengkap + terms checkbox |
| `SocialLoginButtons` | Google + GitHub buttons |

### Courses (`src/features/courses/components/`)
| Komponen | Keterangan |
|---|---|
| `CourseFilter` | Sidebar filter: level, harga, durasi, rating, fitur |
| `CourseCategoryTabs` | Tab filter kategori horizontal |
| `CourseGrid` | Wrapper grid dengan toggle grid/list |
| `CourseListItem` | Tampilan list view untuk course |

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
| Komponen | Keterangan |
|---|---|
| `UserNavbar` | Navbar khusus user dengan dropdown avatar |
| `WelcomeHeader` | Banner gradient + streak pill + CTA buttons |
| `ContinueLearningCard` | Thumbnail + progress + CTA continue |
| `InProgressItem` | Row course in-progress kecil |
| `StreakCalendar` | Grid 12x7 warna intensity GitHub-style |
| `MonthlyGoalsCard` | Goals list + circular progress, gradient card |
| `DeadlineItem` | Course deadline dengan urgency badge |
| `AchievementBadge` | Emoji badge + nama + tanggal |
| `ForumTopicItem` | Judul + author + replies + views |
| `QuickActionButton` | Button dengan hover indigo effect |
| `RecentActivityItem` | Icon + teks + timestamp + connector line |

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