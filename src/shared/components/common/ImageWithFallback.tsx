import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface Props {
  src: string
  alt: string
  className?: string
}

export default function ImageWithFallback({ src, alt, className = '' }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff size={24} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
