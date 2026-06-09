export function getLevelColor(level: string): string {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-700'
    case 'Intermediate': return 'bg-blue-100 text-blue-700'
    case 'Advanced': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'success': return 'bg-green-500 text-white'
    case 'pending': return 'bg-amber-500 text-white'
    case 'failed': return 'bg-red-500 text-white'
    default: return 'bg-gray-400 text-white'
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Web Development': return 'bg-indigo-500'
    case 'Data Science': return 'bg-emerald-500'
    case 'DevOps': return 'bg-orange-500'
    case 'Design': return 'bg-pink-500'
    case 'Mobile Development': return 'bg-blue-500'
    case 'Backend Development': return 'bg-purple-500'
    case 'Cloud Computing': return 'bg-cyan-500'
    default: return 'bg-gray-500'
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'high': return 'bg-red-500 text-white'
    case 'medium': return 'bg-amber-500 text-white'
    case 'low': return 'bg-gray-400 text-white'
    default: return 'bg-gray-400 text-white'
  }
}
