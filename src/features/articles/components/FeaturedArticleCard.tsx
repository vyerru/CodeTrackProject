import { Calendar, Clock } from 'lucide-react'
import type { ArticleWithMeta } from '../hooks/useArticles'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'
import { getCategoryColor } from '@/shared/utils'

interface Props {
  article: ArticleWithMeta
}

export default function FeaturedArticleCard({ article }: Props) {
  return (
    <div className="relative rounded-xl overflow-hidden mb-6 group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
      <div className="aspect-video relative">
        <ImageWithFallback
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`${getCategoryColor(article.category)} text-white px-4 py-1.5 rounded-full text-sm`}>
            {article.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-white text-2xl font-bold mb-4">
            {article.title}
          </h2>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              {article.authorAvatar ? (
                <ImageWithFallback
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-medium text-white">
                  {article.author.charAt(0)}
                </div>
              )}
              <span>{article.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{article.formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
