import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'
import { FAVORITES_DATA } from '../data/constants'

export default function AllTimeFavorites() {
  const navigate = useNavigate()
  const { addToList } = useAppContext()
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section id="favorites" className="px-8 lg:px-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 group">
          <span className="text-white">Her All-Time Favorites</span>
          <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
        </h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 cursor-pointer">◀</button>
          <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 cursor-pointer">▶</button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-12 pt-4 px-2 -mx-2 scroll-smooth hide-scrollbar">
        {FAVORITES_DATA.map((fav) => (
          <div key={fav.id} className="flex-none w-64 md:w-80 h-40 md:h-48 relative card-3d rounded-lg cursor-pointer overflow-hidden group" onClick={() => navigate(`/player?id=${fav.id}`)}>
            <img src={fav.image} className="w-full h-full object-cover rounded-lg" alt={fav.title} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-lg font-black italic uppercase font-display">{fav.title}</h3>
              <p className="text-xs text-gray-300">{fav.genre}</p>
            </div>
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button onClick={(e) => { e.stopPropagation(); addToList({ id: fav.id, title: fav.title, duration: 'N/A', image: fav.image }) }} className="w-8 h-8 bg-black/60 border border-white/30 rounded-full flex items-center justify-center hover:bg-black/80 cursor-pointer" title="Add to List">+</button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-black text-2xl ml-1">▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
