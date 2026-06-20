import { useNavigate } from 'react-router'
import { Calendar, Clock, Eye, Link2, Check, ChevronRight } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useArticleDetail } from '../hooks/useArticleDetail'
import ImageWithFallback from '@/shared/components/common/ImageWithFallback'
import { getCategoryColor } from '@/shared/utils'
import PageSkeleton from '@/shared/components/common/PageSkeleton'

export default function ArticleDetailPage() {
  const navigate = useNavigate()
  const { article, relatedArticles, readProgress, isLoading, error } = useArticleDetail()
  const [copied, setCopied] = useState(false)

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  if (isLoading) return <PageSkeleton />

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-400 mb-6">Halaman yang kamu cari tidak tersedia.</p>
          <button
            onClick={() => navigate('/articles')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            Kembali ke Artikel
          </button>
        </div>
      </div>
    )
  }

  const paragraphs = article.content.split('\n\n').filter(Boolean)

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-indigo-500 z-50 transition-all duration-150" style={{ width: `${readProgress}%` }} />

      <article className="min-h-screen bg-gray-50 pt-4 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 pt-4">
            <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/articles')} className="hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Artikel</button>
            <ChevronRight size={14} />
            <span className="text-gray-400">{article.category}</span>
          </nav>

          {/* Category Badge */}
          <span className={`inline-block px-3 py-1 text-white text-xs font-semibold rounded-full ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <img src={article.authorAvatar} alt={article.author} className="w-8 h-8 rounded-full aspect-square" />
              <span className="font-medium text-gray-700">{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{article.formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{article.readTime} menit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={16} />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm text-gray-500">Bagikan:</span>
            <ShareButton href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}>
              <TwitterIcon />
            </ShareButton>
            <ShareButton href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}>
              <FacebookIcon />
            </ShareButton>
            <ShareButton href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}>
              <LinkedinIcon />
            </ShareButton>
            <button
              onClick={handleCopyLink}
              className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-gray-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              aria-label="Copy link"
            >
              {copied ? <Check size={16} /> : <Link2 size={16} />}
            </button>
          </div>

          {/* Featured Image */}
          <div className="mb-10 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-10">
            {/* Left Column */}
            <div>
              <div className="prose prose-lg max-w-prose">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {para}
                  </p>
                ))}
              </div>

              {/* Author Bio */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-black/5">
                  <ImageWithFallback
                    src={article.authorAvatar ?? ''}
                    alt={article.author}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0 aspect-square"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{article.author}</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">Penulis dan kontributor di CodeTrack</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-xl border border-black/5 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Artikel Terkait</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <button
                        key={related.id}
                        onClick={() => navigate(`/articles/${related.slug}`)}
                        className="flex gap-3 text-left group w-full focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                      >
                        <ImageWithFallback
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-20 aspect-video rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{related.formattedDate}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Dapatkan Update</h3>
                <p className="text-sm text-indigo-100 mb-4">
                  Dapatkan notifikasi artikel terbaru dan tips eksklusif dari CodeTrack.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email kamu"
                    className="flex-1 px-3 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Artikel Terkait</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => {
                      window.scrollTo(0, 0)
                      navigate(`/articles/${related.slug}`)
                    }}
                    className="bg-white rounded-xl border border-black/5 overflow-hidden text-left group focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                  >
                    <ImageWithFallback
                      src={related.thumbnail}
                      alt={related.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-5">
                      <span className={`inline-block px-2 py-0.5 text-white text-xs font-semibold rounded-full ${getCategoryColor(related.category)}`}>
                        {related.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{related.excerpt}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                        <span>{related.formattedDate}</span>
                        <span>·</span>
                        <span>{related.readTime} menit</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}

function ShareButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-gray-600 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
    >
      {children}
    </a>
  )
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
