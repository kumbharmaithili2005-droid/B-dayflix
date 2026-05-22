import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'
import { MEMORIES, FAVORITES_DATA, BIRTHDAY_WISHES } from '../data/constants'

const ALL_ITEMS = [
  ...MEMORIES.map(m => ({ ...m, type: 'memory' })),
  ...FAVORITES_DATA.map(f => ({ ...f, type: 'favorite', genre: [f.genre] })),
  ...BIRTHDAY_WISHES.map(w => ({ id: w.id, title: `Wish from ${w.author}`, type: 'wish', description: w.message, image: null })),
]

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useAppContext()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [searchOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setSearchOpen])

  if (!searchOpen) return null

  const results = query.trim().length > 0
    ? ALL_ITEMS.filter(item => {
        const q = query.toLowerCase()
        return (
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          (Array.isArray(item.genre) && item.genre.some(g => g.toLowerCase().includes(q)))
        )
      })
    : []

  const handleItemClick = (item) => {
    setSearchOpen(false)
    if (item.type === 'memory') {
      navigate(`/player?id=${item.id}`)
    } else if (item.type === 'favorite') {
      navigate(`/player?id=${item.id}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-lg flex flex-col search-modal-enter">
      <div className="max-w-3xl w-full mx-auto mt-20 px-6">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories, wishes, favorites..."
            className="flex-1 bg-transparent text-3xl md:text-4xl font-bold text-white placeholder-gray-600 outline-none border-b-2 border-gray-700 focus:border-red-600 transition-colors pb-3"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="text-gray-400 hover:text-white text-2xl transition-colors cursor-pointer p-2"
          >
            ✕
          </button>
        </div>

        {/* Results */}
        {query.trim().length > 0 && (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🎬</p>
                <p className="text-gray-400 text-xl">No results found for "{query}"</p>
                <p className="text-gray-600 mt-2">Try searching for memories, wishes, or favorites</p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
                {results.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-red-600/30 transition-all group cursor-pointer"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-20 h-14 object-cover rounded-lg" />
                    ) : (
                      <div className="w-20 h-14 bg-gradient-to-br from-red-600 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        💌
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white group-hover:text-red-400 transition-colors truncate">{item.title}</h4>
                      <p className="text-gray-500 text-sm truncate">{item.description?.substring(0, 80)}...</p>
                    </div>
                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/10 text-gray-400">
                      {item.type}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {/* Quick Links when empty */}
        {query.trim().length === 0 && (
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-3">
              {['Birthday', 'Memories', 'Friends', 'Family', 'Celebration', 'Adventure'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all cursor-pointer border border-white/10 hover:border-red-600/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
