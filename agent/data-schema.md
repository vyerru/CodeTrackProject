# Data Schema — CodeTrack

Semua tipe data dan struktur mock JSON yang digunakan di seluruh halaman.

---

## TypeScript Types

### Base Types
```ts
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

---

### User
```ts
interface User {
  id: string
  name: string
  email: string
  avatar?: string           // URL dari i.pravatar.cc
  role: UserRole
  createdAt: string         // ISO date string
}
```

### Course
```ts
interface Course {
  id: string
  slug: string              // kebab-case untuk URL
  title: string
  description: string
  instructor: string
  instructorAvatar?: string
  thumbnail: string         // URL dari unsplash atau placeholder
  price: number             // dalam Rupiah, contoh: 589000
  originalPrice?: number    // harga sebelum diskon
  discount?: number         // persentase, contoh: 40
  rating: number            // 0.0 - 5.0
  totalStudents: number
  duration: number          // dalam jam
  level: CourseLevel
  category: CourseCategory
  tags: string[]
  isBestseller?: boolean
  isFree?: boolean
  isPublished: boolean
  createdAt: string
}
```

### Article
```ts
interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number          // dalam menit
  thumbnail: string
  category: string
  tags: string[]
}
```

### Transaction
```ts
interface Transaction {
  id: string
  invoice: string           // format: INV/YYYYMMDD/XXXX
  userId: string
  customerName: string
  courseId: string
  courseTitle: string
  amount: number            // dalam Rupiah
  status: TransactionStatus
  createdAt: string
  paymentMethod: string     // 'transfer' | 'credit_card' | 'ewallet'
}
```

### Enrolled Course (untuk user dashboard)
```ts
interface EnrolledCourse {
  courseId: string
  progress: number          // 0-100
  currentLesson: string
  enrolledAt: string
  completedAt?: string
}
```

### User Stats (untuk user dashboard)
```ts
interface UserStats {
  coursesEnrolled: number
  coursesInProgress: number
  overallCompletion: number   // 0-100
  learningTimeThisMonth: number // dalam jam
  learningTimeIncrease: number  // persentase vs bulan lalu
  certificatesEarned: number
  certificatesToUnlock: number
  currentStreak: number       // dalam hari
  longestStreak: number       // dalam hari
}
```

### Monthly Goal
```ts
interface MonthlyGoal {
  id: string
  title: string
  current: number
  target: number
  type: 'courses' | 'hours' | 'certificates' | 'streak'
}
```

### Badge / Achievement
```ts
interface Badge {
  id: string
  name: string
  icon: string              // emoji
  date: string              // contoh: "Dec 10"
  description?: string
}
```

### Forum Topic
```ts
interface ForumTopic {
  id: string
  title: string
  author: string
  replies: number
  views: number
  time: string              // relative time, contoh: "2 hours ago"
  category: string
}
```

### Recent Activity (user dashboard)
```ts
interface UserActivity {
  id: string
  type: 'completed' | 'certificate' | 'quiz' | 'forum'
  title: string
  time: string
}
```

### Recent Activity (admin dashboard)
```ts
interface AdminActivity {
  id: number
  type: ActivityType
  user: string
  action: string
  time: string
  avatar: string
}
```

### Upcoming Deadline
```ts
interface Deadline {
  id: string
  course: string
  dueInDays: number
  progress: number
  urgency: DeadlineUrgency
}
```

### KPI Card (admin)
```ts
interface KpiCard {
  label: string
  value: string
  icon: LucideIcon
  trend?: number            // persentase, positif = naik
  gradient: string          // Tailwind gradient class
  iconBg: string
  iconColor: string
}
```

---

## Mock Data

### courses.json (contoh struktur)
```json
[
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
]
```

### articles.json (contoh struktur)
```json
[
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
]
```

### users.json (contoh struktur)
```json
[
  {
    "id": "1",
    "name": "Budi Santoso",
    "email": "budi.s@email.com",
    "avatar": "https://i.pravatar.cc/150?img=11",
    "role": "user",
    "createdAt": "2024-12-15T05:00:00Z"
  },
  {
    "id": "2",
    "name": "Admin User",
    "email": "admin@codetrack.id",
    "avatar": null,
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### transactions.json (contoh struktur)
```json
[
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
]
```

---

## Utility Functions

```ts
// Format harga Rupiah panjang: Rp 589.000
formatRupiah(amount: number): string

// Format harga Rupiah pendek: Rp 589k / Rp 1.2M
formatRupiahShort(amount: number): string

// Warna badge level course
getLevelColor(level: CourseLevel): string
// Returns Tailwind classes: 'bg-green-100 text-green-700' dst

// Warna badge status transaksi
getStatusColor(status: TransactionStatus): string
// Returns Tailwind classes: 'bg-green-500 text-white' dst

// Relative time dari ISO string
getRelativeTime(dateString: string): string
// Returns: "2 hours ago", "1 day ago", dst
```

---

## Demo Auth Credentials

Untuk keperluan demo login tanpa backend:

```
User:  email: user@codetrack.id   | password: user123   | role: user
Admin: email: admin@codetrack.id  | password: admin123  | role: admin
```

Credentials ini di-hardcode di `features/auth/pages/LoginPage.tsx` untuk demo.