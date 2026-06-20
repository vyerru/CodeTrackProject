import { useNavigate } from 'react-router'
import CourseCard from '@/shared/components/common/CourseCard'
import type { Course } from '@/shared/types'

const popularCourses: Course[] = [
  {
    id: '1',
    slug: 'complete-web-development-bootcamp',
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Pelajari HTML, CSS, JavaScript, React, Node.js',
    instructor: 'Sarah Martinez',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    price: 299000,
    originalPrice: 499000,
    rating: 4.8,
    totalStudents: 12450,
    duration: 32,
    level: 'Beginner',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    isBestseller: true,
    isFree: false,
    isPublished: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'mobile-app-development-with-react-native',
    title: 'Mobile App Development with React Native',
    description: 'Bangun aplikasi iOS dan Android dengan satu codebase',
    instructor: 'Andi Wijaya',
    instructorAvatar: 'https://i.pravatar.cc/150?img=8',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    price: 399000,
    originalPrice: 599000,
    rating: 4.6,
    totalStudents: 8750,
    duration: 28,
    level: 'Intermediate',
    category: 'Mobile Development',
    tags: ['React Native', 'iOS', 'Android'],
    isBestseller: false,
    isFree: false,
    isPublished: true,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    slug: 'machine-learning-fundamentals',
    title: 'Machine Learning Fundamentals with Python',
    description: 'Pahami konsep ML dan bangun model prediktif',
    instructor: 'Dr. Rina Wijaya',
    instructorAvatar: 'https://i.pravatar.cc/150?img=9',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    price: 499000,
    originalPrice: 799000,
    rating: 4.9,
    totalStudents: 5600,
    duration: 40,
    level: 'Advanced',
    category: 'Data Science',
    tags: ['Python', 'ML', 'TensorFlow'],
    isBestseller: true,
    isFree: false,
    isPublished: true,
    createdAt: '2024-03-01',
  },
]

export default function CoursesSection() {
  const navigate = useNavigate()

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-[#111827] mb-12">
          Course Populer
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/courses')}
            className="border border-[#4f39f6] text-[#4f39f6] font-medium rounded-lg px-8 py-3 text-sm hover:bg-[#4f39f6]/5 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Lihat Semua Course
          </button>
        </div>
      </div>
    </section>
  )
}
