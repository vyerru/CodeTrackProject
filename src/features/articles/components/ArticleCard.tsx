import { Calendar, Clock } from 'lucide-react'
import type { ArticleWithMeta } from '../hooks/useArticles'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'
import { getCategoryColor } from '@/shared/utils'

interface Props {
  article: ArticleWithMeta
  onClick?: () => void
}

export default function ArticleCard({ article, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video relative">
        <ImageWithFallback
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-xs`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-gray-900 font-bold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {article.authorAvatar ? (
            <ImageWithFallback
              src={article.authorAvatar}
              alt={article.author}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-white">
              {article.author.charAt(0)}
            </div>
          )}
          <span className="text-gray-700 font-medium">{article.author}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{article.formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime} min</span>
          </div>
        </div>
      </div>
    </div>
  )
}
