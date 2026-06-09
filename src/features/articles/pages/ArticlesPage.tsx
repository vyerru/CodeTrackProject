import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import FeaturedArticleCard from '../components/FeaturedArticleCard'
import ArticleCard from '../components/ArticleCard'
import ArticleSidebar from '../components/ArticleSidebar'
import ArticleSkeleton from '../components/ArticleSkeleton'

export default function ArticlesPage() {
  const {
    articles,
    featuredArticle,
    popularArticles,
    categories,
    tags,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useArticles()

  if (isLoading) {
    return <ArticleSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Artikel & Tips Coding
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Panduan, tutorial, dan tips untuk meningkatkan skill coding kamu
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-[600px] mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel, tutorial, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Left Side - Article Grid (70%) */}
            <div className="flex-1 lg:w-[70%]">
              {featuredArticle && activeCategory === 'Semua' && !searchQuery && currentPage === 1 && (
                <FeaturedArticleCard article={featuredArticle} />
              )}

              {articles.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">Tidak ada artikel ditemukan</p>
                  <p className="text-sm mt-2">Coba ubah kata kunci atau filter kategori</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {articles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => window.location.href = `/articles/${article.slug}`}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[40px] h-10 px-3 rounded-lg transition-all text-sm ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Side - Sidebar (30%) */}
            <div className="hidden lg:block w-[30%]">
              <ArticleSidebar popularArticles={popularArticles} tags={tags} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
