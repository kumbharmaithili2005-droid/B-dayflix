import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../App'

export default function MyList() {
  const navigate = useNavigate()
  const { myList, removeFromList, toggleWatched } = useAppContext()
  const [sortBy, setSortBy] = useState('default')
  const [filterBy, setFilterBy] = useState('all')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  let displayList = [...myList]

  // Apply filter
  if (filterBy === 'watched') displayList = displayList.filter(i => i.watched)
  if (filterBy === 'unwatched') displayList = displayList.filter(i => !i.watched)

  // Apply sort
  if (sortBy === 'title') displayList.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy === 'title-desc') displayList.sort((a, b) => b.title.localeCompare(a.title))

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-display mb-2">My List</h1>
            <p className="text-gray-400">{myList.length} item{myList.length !== 1 ? 's' : ''} in your watchlist</p>
          </div>
          <div className="flex gap-4 relative">
            {/* Sort dropdown */}
            <div className="relative">
              <button onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false) }} className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-bold cursor-pointer flex items-center gap-2">
                Sort {sortBy !== 'default' && <span className="text-red-500 text-xs">●</span>}
              </button>
              {showSortMenu && (
                <div className="absolute top-12 right-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                  {[{ v: 'default', l: 'Default' }, { v: 'title', l: 'Title A-Z' }, { v: 'title-desc', l: 'Title Z-A' }].map(opt => (
                    <button key={opt.v} onClick={() => { setSortBy(opt.v); setShowSortMenu(false) }} className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors cursor-pointer ${sortBy === opt.v ? 'text-red-500 font-bold' : 'text-gray-300'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Filter dropdown */}
            <div className="relative">
              <button onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false) }} className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all font-bold cursor-pointer flex items-center gap-2">
                Filter {filterBy !== 'all' && <span className="text-red-500 text-xs">●</span>}
              </button>
              {showFilterMenu && (
                <div className="absolute top-12 right-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                  {[{ v: 'all', l: 'All Items' }, { v: 'watched', l: 'Watched' }, { v: 'unwatched', l: 'Unwatched' }].map(opt => (
                    <button key={opt.v} onClick={() => { setFilterBy(opt.v); setShowFilterMenu(false) }} className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors cursor-pointer ${filterBy === opt.v ? 'text-red-500 font-bold' : 'text-gray-300'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {displayList.map((item, index) => (
            <div key={item.id} className="bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-lg p-4 md:p-6 flex items-center justify-between hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                <span className="text-2xl md:text-3xl font-black text-gray-600 hidden md:block">{String(index + 1).padStart(2, '0')}</span>
                {item.image && <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded hidden sm:block" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-lg truncate">{item.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{item.duration}</p>
                </div>
                <button onClick={() => toggleWatched(item.id)} className="cursor-pointer">
                  {item.watched ? (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-bold border border-green-600/50">✓ Watched</span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs font-bold border border-gray-600/50">Unwatched</span>
                  )}
                </button>
              </div>
              <div className="flex gap-2 md:gap-4 ml-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => navigate(`/player?id=${item.id}`)} className="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all cursor-pointer text-sm">▶ Play</button>
                <button onClick={() => removeFromList(item.id)} className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-all cursor-pointer text-sm">✕</button>
              </div>
            </div>
          ))}
        </div>

        {displayList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 text-lg mb-4">{filterBy !== 'all' ? 'No items match your filter.' : 'Your list is empty.'}</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold cursor-pointer">Browse Memories</button>
          </div>
        )}
      </div>
    </div>
  )
}
