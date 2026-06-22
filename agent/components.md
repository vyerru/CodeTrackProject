# Component Inventory — CodeTrack

> Register of all existing, planned, and required components.
> **Check this file before creating a new component** — it may already exist.
> Last updated: 2026-06-21

---

## Table of Contents

1. [Component Audit Criteria (Definition of Done)](#1-component-audit-criteria)
2. [Shared Layout Components](#2-shared-layout-components)
3. [Shared UI Primitives](#3-shared-ui-primitives)
4. [Shared Common Components](#4-shared-common-components)
5. [Feature Components](#5-feature-components)
6. [Status Legend](#6-status-legend)

---

## 1. Component Audit Criteria (Definition of Done)

Before a component is marked **Done**, it must pass the following checks:

### A. Responsive Integrity
| Check | Requirement |
|---|---|
| Fluid widths | No fixed pixel dimensions on main containers. Use `w-full`, `max-w-*`, percentages. |
| Multi-viewport | Component must render correctly at 320px, 768px, and 1024px+ without overflow or overlap. |
| Spacing | Use Flex/Grid `gap-*` for sibling alignment. No manual margins (`ml-1`, `mr-4`, `mt-2`) for layout. |

### B. Content Resilience
| Check | Requirement |
|---|---|
| Layout shift prevention | Every `<img>` or thumbnail needs a container with an aspect ratio (`aspect-video`, `aspect-square`). |
| Image fallback | Never render an `<img>` without error handling. Use `ImageWithFallback` — broken images show a placeholder, not the browser default broken-icon. |
| Text overflow | Dynamic text (titles, instructor names) exceeding ~200 chars must not break layout. Use `truncate` or `line-clamp-{N}`. |

### C. State Coverage
| Check | Requirement |
|---|---|
| Loading | Show skeleton or spinner while data is fetching. |
| Empty | Render `EmptyState` with a CTA when data array is `[]`. |
| Error | Render `ErrorState` with a "Coba Lagi" (retry) button on fetch failure. |
| Edge/null | Handle `null`/`undefined` props gracefully (e.g., avatar fallback to initials). |

### D. Interaction Standards
| Check | Requirement |
|---|---|
| Focus | `focus-visible:ring-2 ... outline-none` for keyboard navigation. |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`. |
| Loading state | Form buttons show a spinner + text change, and disable the submit action. |

---

## 2. Shared Layout Components

Path: `src/shared/components/layout/`

| Component | File | Status | Used By |
|---|---|---|---|
| Navbar | `Navbar.tsx` | ✅ Done | PublicLayout, UserLayout |
| Footer | `Footer.tsx` | ✅ Done | PublicLayout |
| PublicLayout | `PublicLayout.tsx` | ✅ Done | All public routes |
| UserLayout | `UserLayout.tsx` | ✅ Done | All authenticated user routes |
| AdminLayout | `AdminLayout.tsx` | ✅ Done | All admin routes |
| AdminTopbar | `AdminTopbar.tsx` | ✅ Done | AdminLayout |
| AdminSidebar | `AdminSidebar.tsx` | ✅ Done | AdminLayout |
| ProtectedRoute | `ProtectedRoute.tsx` | ✅ Done | Router |

---

## 3. Shared UI Primitives

Path: `src/shared/components/ui/`

> These are **shadcn/ui** primitives. Install new ones via `npx shadcn add [component]`.

| Component | Status | Used In |
|---|---|---|
| Button | ✅ Installed | All pages |
| Card | ✅ Installed | All pages |
| Input | ✅ Installed | Forms, search |
| Badge | ✅ Installed | Course level, status, role |
| Progress | ✅ Installed | Dashboard, course cards |
| Separator | ✅ Installed | Navbar, forms |
| Checkbox | ✅ Installed | Register form |
| DropdownMenu | ✅ Installed | User navbar avatar |
| Avatar | ✅ Installed | User info |
| Tabs | ✅ Installed | Course catalog filter |
| Select | ✅ Installed | Sort dropdown |
| Dialog | ✅ Installed | Confirmation modals |
| Sheet | ✅ Installed | Mobile sidebar |
| Skeleton | ✅ Installed | Loading states |
| Toast / Sonner | ✅ Installed | Action notifications |

### Custom UI Components

| Component | Status | Description |
|---|---|---|
| `Typography.tsx` | ✅ Done | Reusable heading/text variants (`h1`–`h4`, `p`, `lead`, `large`, `small`, `muted`) |
| `LoadingSpinner.tsx` (Skeleton) | ✅ Done | Spinner with optional full-page mode |

---

## 4. Shared Common Components

Path: `src/shared/components/common/`

| Component | Props | Status | Used In |
|---|---|---|---|
| `CourseCard` | `course: Course, variant?: 'grid' \| 'list'` | ✅ Done | Landing, Catalog, Dashboard |
| `EmptyState` | `title, description, action?` | ✅ Done | Empty tables, zero-cart, no-history |
| `ErrorState` | `message?, onRetry?` | ✅ Done | Fetch error fallback |
| `LoadingSpinner` | `size?, fullPage?` | ✅ Done | Loading states |
| `PageSkeleton` | — | ✅ Done | Suspense fallback (lazy routes) |
| `ImageWithFallback` | Standard `<img>` props | ✅ Done | Resilient image rendering |
| `LevelBadge` | `level: CourseLevel` | ✅ Done | Course cards |
| `NotFoundPage` | — | ✅ Done | Catch-all route `*` |
| `StatCard` | `icon, value, label, trend?, gradient?` | ⬜ Todo | Admin KPI, User stats |
| `DataTable` | `columns, data, loading?` | ⬜ Todo | All management pages |
| `PageHeader` | `title, breadcrumb?` | ⬜ Todo | Admin sub-pages |
| `AlertBanner` | `type, message, action?` | ⬜ Todo | Admin dashboard |
| `StatusBadge` | `status: TransactionStatus` | ⬜ Todo | Transaction table |

---

## 5. Feature Components

### Landing — `src/features/landing/components/`

| Component | Description | Status |
|---|---|---|
| `HeroSection` | 2-column: heading, subtext, CTAs, stats | ✅ Done |
| `FeaturesSection` | 3 feature cards | ✅ Done |
| `TestimonialsSection` | Carousel with arrow navigation | ✅ Done |
| `CoursesSection` | Grid of 3 `CourseCard` components | ✅ Done |
| `CTASection` | Gradient indigo-purple banner with heading + CTA | ✅ Done |

### Auth — `src/features/auth/components/`

| Component | Description | Status |
|---|---|---|
| `LoginForm` | Email + password + social login | ✅ Done |
| `RegisterForm` | Full form with terms checkbox | ✅ Done |
| `SocialLoginButtons` | Google + GitHub buttons | ✅ Done |

### Courses — `src/features/courses/components/`

| Component | Description | Status |
|---|---|---|
| `CourseFilter` | Sidebar filter: level, price, duration, rating, features | ✅ Done |
| `CourseCategoryTabs` | Horizontal category tab filter | ✅ Done |
| `CourseGrid` | Grid wrapper with grid/list toggle | ✅ Done |
| `CourseListItem` | List view item | ⬜ Todo (low priority) |

### Articles — `src/features/articles/components/`

| Component | Description |
|---|---|
| `ArticleCard` | Thumbnail + title + excerpt + meta |
| `ArticleMeta` | Author, date, read time |

### Commerce — `src/features/commerce/components/`

| Component | Description |
|---|---|
| `CartItem` | Cart row with delete action |
| `OrderSummary` | Subtotal, discount, total, CTA |
| `PaymentMethodSelector` | Radio group: Transfer / Kartu / E-Wallet |

### User Dashboard — `src/features/user-dashboard/components/`

| Component | Status | Description |
|---|---|---|
| `WelcomeHeader` | ✅ Done | Gradient header + streak pill |
| `StatCards` | ✅ Done | Quick stats row |
| `ContinueLearningSection` | ✅ Done | In-progress course list |
| `RecommendedCoursesSection` | ✅ Done | 2×2 recommended grid |
| `StreakCalendar` | ✅ Done | Monthly activity calendar |
| `RecentActivitySection` | ✅ Done | Activity feed |
| `MonthlyGoalsCard` | ✅ Done | Gradient goal card |
| `UpcomingDeadlines` | ✅ Done | Deadline list |
| `AchievementsCard` | ✅ Done | Badge display |
| `CommunityCard` | ✅ Done | Forum topics |
| `QuickActionsCard` | ✅ Done | Action button grid |

### Admin — `src/features/admin/components/`

| Component | Description |
|---|---|
| `AdminSidebar` | Fixed sidebar with section groups |
| `AdminTopbar` | Dark-styled topbar: logo, search, bell, avatar |
| `SidebarItem` | Button with active state |
| `SidebarSection` | Caption label for sidebar group |
| `KpiCard` | Stat card with gradient + icon + trend |
| `RevenueChart` | AreaChart (recharts) with gradient fill |
| `TopCoursesTable` | Table with trophy rank + growth badge |
| `ActivityFeed` | Scrollable feed with avatar + action |
| `QuickActionsGrid` | 2×3 grid of coloured action buttons |
| `TrafficPieChart` | Donut chart with legend |
| `DeviceBreakdown` | Desktop/Mobile/Tablet progress bars |
| `TopLocations` | City-based progress bars with flag emoji |
| `TransactionRow` | Invoice + customer + amount + status badge |
| `UserRow` | Avatar + name + email + role badge + timestamp |
| `AlertBar` | Border-left alert (success/warning/info) |
| `PendingReviewsCard` | Counter + list items + CTA |
| `TodayGoalsCard` | Progress + checklist |

---

## 6. Status Legend

| Status | Meaning |
|---|---|
| ✅ **Done** | Passed all audit criteria. Responsive, resilient, covers all states. |
| ⚠️ **Pending Audit** | Component exists but has not been tested with async simulation, extreme data, and mobile viewports. Do not treat as finished. |
| ⬜ **Todo** | Not yet created. |
| 🚨 **Required** | Critical for frontend resilience; was previously noted as missing. |
