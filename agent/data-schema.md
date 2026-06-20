## Data Schema & Chaos Mocking — CodeTrack

Skema data ini mencerminkan struktur sistem di dunia nyata. Tidak semua data itu indah, berukuran pas, dan lengkap. Komponen *front-end* WAJIB dirancang secara defensif untuk menangani anomali data.

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
---

### User
```ts
interface User {
  id: string
  name: string
  email: string
  avatar?: string | null    // WAJIB tangani null/undefined dengan fallback inisial
  role: UserRole
  createdAt: string         // ISO date string
}
```

### Course
```ts
interface Course {
  id: string
  slug: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string | null  // Sering kali instruktur tidak mengunggah foto
  thumbnail: string                 // URL gambar yang rentan putus/gagal dimuat
  price: number                     // Harga bisa mencapai jutaan/ratusan juta
  originalPrice?: number | null
  discount?: number | null
  rating: number
  totalStudents: number
  level: CourseLevel
  category: CourseCategory
  isBestseller?: boolean
  isFree?: boolean
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
  invoice: string
  userId: string
  customerName: string
  courseId: string
  courseTitle: string
  amount: number
  status: TransactionStatus
  createdAt: string
  paymentMethod: string
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

saat Anda merancang atau melakukan audit pada komponen CourseCard, ArticleCard, atau UserRow, Anda DILARANG menggunakan data ideal. Anda WAJIB menyuntikkan objek Chaos di bawah ini ke dalam fail JSON tiruan Anda.

Jika tata letak (layout) Anda melebar, tumpang tindih, atau tombolnya terdorong keluar layar karena data ini, perbaiki komponen CSS Anda (gunakan truncate, line-clamp, flex-wrap, min-w-0), jangan ubah datanya.

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

```json
{
  "id": "999-chaos-course",
  "slug": "chaos-testing-course-with-very-long-url-slug-that-might-break-layout-if-not-handled",
  "title": "Ini Adalah Judul Kursus Yang Sangat Panjang Sekali Bahkan Melebihi Tiga Baris Teks Dan Seharusnya Dipotong Oleh Line Clamp Dua Atau Tiga Untuk Menghindari Kerusakan Layout Card",
  "description": "Deskripsi ini sengaja dibuat sangat panjang untuk menguji apakah Anda menggunakan max-w-prose dan line-clamp yang benar atau Anda membiarkan teks ini tumpah ruah merusak hierarki visual dari halaman detail kursus Anda.",
  "instructor": "Dr. Prof. Ir. Nama Instruktur Sangat Panjang Sekali M.Sc., Ph.D.",
  "instructorAvatar": null,
  "thumbnail": "[https://url-gambar-rusak-atau-sangat-lambat-sekali.com/image.jpg](https://url-gambar-rusak-atau-sangat-lambat-sekali.com/image.jpg)",
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
  {
  "id": "999-chaos-user",
  "name": "Pengguna Dengan Nama Super Panjang Sekali Sampai Memecahkan Sidebar Dan Navbar CodeTrack",
  "email": "email.super.panjang.sekali.yang.tidak.masuk.akal@subdomain.domain.co.id",
  "avatar": null,
  "role": "user",
  "createdAt": "2026-12-31T23:59:59Z"
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