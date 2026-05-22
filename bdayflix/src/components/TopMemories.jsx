import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'
import { MEMORIES } from '../data/constants'

export default function TopMemories() {
  const navigate = useNavigate()
  const { addToList } = useAppContext()
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    const container = scrollRef.current
    if (!container) return
    container.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section id="memories" className="px-8 lg:px-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 group">
          <span className="text-white">Top Memories for You</span>
          <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
        </h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 hover:border-white/30 cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 hover:border-white/30 cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="perspective-container overflow-visible">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-12 pt-4 px-2 -mx-2 scroll-smooth hide-scrollbar">
          {MEMORIES.map((memory, i) => (
            <div
              key={memory.id}
              className="flex-none w-48 md:w-64 h-72 md:h-96 relative card-3d rounded-lg cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/player?id=${memory.id}`)}
            >
              <img
                src={memory.image}
                className="w-full h-full object-cover rounded-lg"
                alt={memory.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 md:p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  {/* Play button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/player?id=${memory.id}`) }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer shadow-lg"
                  >
                    <span className="text-black text-lg ml-0.5">▶</span>
                  </button>
                  {/* Add to List */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToList({ id: memory.id, title: memory.title, duration: memory.duration, image: memory.image })
                    }}
                    className="w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center hover:border-white transition-all cursor-pointer"
                    title="Add to My List"
                  >
                    <span className="text-lg">+</span>
                  </button>
                  {/* More Info */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/details') }}
                    className="w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center hover:border-white transition-all cursor-pointer"
                    title="More Info"
                  >
                    <span className="text-sm">ℹ</span>
                  </button>
                </div>

                <h3 className="text-sm font-bold mb-1">{memory.title}</h3>
                <p className="text-[10px] text-gray-400 mb-2">{memory.year}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-green-500 font-bold">{memory.match} Match</span>
                  <span className="border border-gray-500 px-1">{memory.rating}</span>
                  <span>{memory.episodes}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {memory.genre.map(g => (
                    <span key={g} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300">{g}</span>
                  ))}
                </div>
              </div>
              <div className="reflection"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
