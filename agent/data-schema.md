# Data Schema & Testing Contracts — CodeTrack

> Type definitions, mock data structure, utility functions, and chaos-testing data contracts.
> Components must be designed **defensively** to handle the edge cases documented here.
> Last updated: 2026-06-21

---

## Table of Contents

1. [TypeScript Type Definitions](#1-typescript-type-definitions)
2. [Utility Functions](#2-utility-functions)
3. [Mock Data Contract](#3-mock-data-contract)
4. [Chaos-Testing Data](#4-chaos-testing-data)
5. [Demo Credentials](#5-demo-credentials)

---

## 1. TypeScript Type Definitions

### Core Primitives

```typescript
type UserRole           = 'user' | 'admin'
type CourseLevel        = 'Beginner' | 'Intermediate' | 'Advanced'
type TransactionStatus  = 'success' | 'pending' | 'failed'
type CourseCategory     =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'Backend Development'
  | 'DevOps'
  | 'Cloud Computing'
  | 'Design'
type ActivityType       = 'enrollment' | 'registration' | 'purchase' | 'completion' | 'review'
type DeadlineUrgency    = 'high' | 'medium' | 'low'
```

### User

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string | null          // Must handle null/undefined → fallback to initials
  role: UserRole
  createdAt: string               // ISO 8601 date string
}
```

### Course

```typescript
interface Course {
  id: string
  slug: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string | null   // Often missing — handle fallback
  thumbnail: string                   // URL — prone to failure, use ImageWithFallback
  price: number                       // Can reach millions/billions — format with formatRupiah()
  originalPrice?: number | null
  discount?: number | null
  rating: number
  totalStudents: number
  level: CourseLevel
  category: CourseCategory
  isBestseller?: boolean
  isFree?: boolean
  duration?: number                   // Hours
  tags?: string[]
  isPublished?: boolean
  createdAt?: string
}
```

### Article

```typescript
interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  publishedAt: string               // ISO 8601 date string
  readTime: number                  // In minutes
  thumbnail: string
  category: string
  tags: string[]
}
```

### Transaction

```typescript
interface Transaction {
  id: string
  invoice: string
  userId: string
  customerName: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  createdAt: string                 // ISO 8601 date string
  paymentMethod: string
}
```

### Dashboard-Specific Types

```typescript
interface EnrolledCourse {
  courseId: string
  progress: number                  // 0–100
  currentLesson: string
  enrolledAt: string
  completedAt?: string
}

interface UserStats {
  coursesEnrolled: number
  coursesInProgress: number
  overallCompletion: number          // 0–100
  learningTimeThisMonth: number      // In hours
  learningTimeIncrease: number       // Percentage vs. last month
  certificatesEarned: number
  certificatesToUnlock: number
  currentStreak: number              // In days
  longestStreak: number              // In days
}

interface MonthlyGoal {
  id: string
  title: string
  current: number
  target: number
  type: 'courses' | 'hours' | 'certificates' | 'streak'
}

interface Badge {
  id: string
  name: string
  icon: string                      // Emoji character
  date: string                      // e.g. "Dec 10"
  description?: string
}

interface ForumTopic {
  id: string
  title: string
  author: string
  replies: number
  views: number
  time: string                      // Relative time, e.g., "2 hours ago"
  category: string
}

interface UserActivity {
  id: string
  type: 'completed' | 'certificate' | 'quiz' | 'forum'
  title: string
  time: string
}

interface AdminActivity {
  id: number
  type: ActivityType
  user: string
  action: string
  time: string
  avatar: string
}

interface Deadline {
  id: string
  course: string
  dueInDays: number
  progress: number
  urgency: DeadlineUrgency
}

interface KpiCard {
  label: string
  value: string
  icon: LucideIcon
  trend?: number                    // Positive = upward trend
  gradient: string                  // Tailwind gradient class
  iconBg: string
  iconColor: string
}
```

---

## 2. Utility Functions

All defined in `core/utils/` and re-exported via `shared/utils/`.

| Function | Signature | Returns | Example |
|---|---|---|---|
| `formatRupiah` | `(amount: number) => string` | Long-form IDR | `"Rp 589.000"` |
| `formatRupiahShort` | `(amount: number) => string` | Short-form IDR | `"Rp 589k"` / `"Rp 1.2M"` |
| `getLevelColor` | `(level: CourseLevel) => string` | Tailwind classes | `"bg-green-100 text-green-700"` |
| `getStatusColor` | `(status: TransactionStatus) => string` | Tailwind classes | `"bg-green-500 text-white"` |
| `getRelativeTime` | `(dateString: string) => string` | Relative string | `"2 hours ago"`, `"1 day ago"` |

---

## 3. Mock Data Contract

Mock data files live in `src/data/sources/mock/`. Each file must include both **ideal** records and **chaos** records (see Section 4 below).

### Courses (`courses.json`)

```json
{
  "id": "1",
  "slug": "complete-web-development-bootcamp",
  "title": "Complete Web Development Bootcamp 2024",
  "description": "Pelajari HTML, CSS, JavaScript, React, Node.js dan bangun project nyata",
  "instructor": "Sarah Martinez",
  "instructorAvatar": "https://i.pravatar.cc/150?img=5",
  "thumbnail": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
  "price": 299000,
  "originalPrice": 499000,
  "discount": 40,
  "rating": 4.8,
  "totalStudents": 12450,
  "duration": 32,
  "level": "Beginner",
  "category": "Web Development",
  "tags": ["HTML", "CSS", "JavaScript", "React"],
  "isBestseller": true,
  "isFree": false,
  "isPublished": true,
  "createdAt": "2024-01-15"
}
```

### Articles (`articles.json`)

```json
{
  "id": "1",
  "slug": "belajar-react-hooks",
  "title": "Panduan Lengkap React Hooks untuk Pemula",
  "excerpt": "React Hooks mengubah cara kita menulis komponen React...",
  "content": "...",
  "author": "Sarah Martinez",
  "authorAvatar": "https://i.pravatar.cc/150?img=5",
  "publishedAt": "2024-12-10",
  "readTime": 8,
  "thumbnail": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  "category": "Web Development",
  "tags": ["React", "JavaScript", "Frontend"]
}
```

### Users (`users.json`)

```json
{
  "id": "1",
  "name": "Budi Santoso",
  "email": "budi.s@email.com",
  "avatar": "https://i.pravatar.cc/150?img=11",
  "role": "user",
  "createdAt": "2024-12-15T05:00:00Z"
}
```

### Transactions (`transactions.json`)

```json
{
  "id": "1",
  "invoice": "INV/20241215/0012",
  "userId": "1",
  "customerName": "John Doe",
  "courseId": "1",
  "courseTitle": "Complete Web Development Bootcamp",
  "amount": 589000,
  "status": "success",
  "createdAt": "2024-12-15T09:00:00Z",
  "paymentMethod": "transfer"
}
```

---

## 4. Chaos-Testing Data

> **Required reading for all component audits.**
>
> When designing or auditing `CourseCard`, `ArticleCard`, `UserRow`, or any data-driven component, you **must** inject these chaos records into the mock data to verify layout resilience.
>
> If the layout breaks (overflow, overlap, buttons pushed out), **fix the component CSS** — do not modify the test data.

### Chaos Course

```json
{
  "id": "999-chaos-course",
  "slug": "chaos-testing-course-with-very-long-url-slug-that-might-break-layout-if-not-handled",
  "title": "Ini Adalah Judul Kursus Yang Sangat Panjang Sekali Bahkan Melebihi Tiga Baris Teks Dan Seharusnya Dipotong Oleh Line Clamp Dua Atau Tiga Untuk Menghindari Kerusakan Layout Card",
  "description": "Deskripsi ini sengaja dibuat sangat panjang untuk menguji apakah Anda menggunakan max-w-prose dan line-clamp yang benar atau Anda membiarkan teks ini tumpah ruah merusak hierarki visual dari halaman detail kursus Anda.",
  "instructor": "Dr. Prof. Ir. Nama Instruktur Sangat Panjang Sekali M.Sc., Ph.D.",
  "instructorAvatar": null,
  "thumbnail": "https://url-gambar-rusak-atau-sangat-lambat-sekali.com/image.jpg",
  "price": 1250000000,
  "originalPrice": 2500000000,
  "discount": 50,
  "rating": 0,
  "totalStudents": 0,
  "level": "Beginner",
  "category": "Web Development",
  "isBestseller": true
}
```

### Chaos User

```json
{
  "id": "999-chaos-user",
  "name": "Pengguna Dengan Nama Super Panjang Sekali Sampai Memecahkan Sidebar Dan Navbar CodeTrack",
  "email": "email.super.panjang.sekali.yang.tidak.masuk.akal@subdomain.domain.co.id",
  "avatar": null,
  "role": "user",
  "createdAt": "2026-12-31T23:59:59Z"
}
```

### What Chaos Data Tests

| Property | Chaos Value | What It Tests |
|---|---|---|
| `title` | 200+ characters | `line-clamp-2` / `truncate` protection |
| `description` | 400+ characters | `max-w-prose`, `line-clamp`, overflow |
| `instructor` | Very long name with titles | Overflow in card/row layout |
| `instructorAvatar` | `null` | Avatar fallback to initials |
| `thumbnail` | Broken URL | `ImageWithFallback` fallback display |
| `price` | 1.25 billion | `formatRupiah()` with large numbers |
| `rating` | `0` | Zero-value rendering (stars, display) |
| `totalStudents` | `0` | Zero-value rendering |
| `email` | Very long email | Table column overflow |
| `createdAt` | Future date | Date formatting edge case |

---

## 5. Demo Credentials

Hardcoded in `LoginPage.tsx` for demo purposes. No backend or persistence.

| Role | Email | Password |
|---|---|---|
| User | `user@codetrack.id` | `user123` |
| Admin | `admin@codetrack.id` | `admin123` |
