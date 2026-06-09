import { Eye, Mail } from 'lucide-react'
import type { ArticleWithMeta } from '../hooks/useArticles'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'

interface Props {
  popularArticles: ArticleWithMeta[]
  tags: string[]
}

export default function ArticleSidebar({ popularArticles, tags }: Props) {
  return (
    <div className="sticky top-[144px] space-y-8">
      {/* Popular Articles */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-6">Artikel Populer</h3>
        <div className="space-y-4">
          {popularArticles.map((article) => (
            <div
              key={article.id}
              className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
            >
              <ImageWithFallback
                src={article.thumbnail}
                alt={article.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 text-sm font-medium line-clamp-2 mb-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-6">Tag Populer</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-indigo-600 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-sm text-white">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-white font-bold mb-2">Dapatkan Tips Coding Mingguan</h3>
        <p className="text-indigo-100 text-sm mb-4">Subscribe untuk artikel dan tips terbaru</p>
        <input
          type="email"
          placeholder="Email kamu"
          className="w-full px-4 py-2.5 rounded-lg mb-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  )
}
