import { Loader2 } from 'lucide-react'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

const sizeMap = { sm: 16, md: 24, lg: 32 }

export default function LoadingSpinner({ size = 'md', fullPage = false }: Props) {
  const spinner = (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="text-indigo-600 animate-spin" size={sizeMap[size]} />
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="text-indigo-600 animate-spin" size={40} />
      </div>
    )
  }

  return spinner
}
