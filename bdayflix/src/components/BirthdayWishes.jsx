import { useState, useRef, useEffect } from 'react'
import { BIRTHDAY_WISHES } from '../data/constants'

export default function BirthdayWishes() {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scroll = (dir) => {
    const container = scrollRef.current
    if (!container) return
    const cardWidth = 380
    container.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = 380
      setActiveIndex(Math.round(scrollLeft / cardWidth))
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="px-8 lg:px-16 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 group">
          <span className="text-white">💌 Birthday Wishes</span>
          <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
        </h2>
        <div className="flex gap-2">
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

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 scroll-smooth hide-scrollbar"
      >
        {BIRTHDAY_WISHES.map((wish, i) => (
          <div
            key={wish.id}
            className={`flex-none w-[360px] bg-gradient-to-br ${wish.color} rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl group`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border-2 border-white/30">
                  {wish.avatar}
                </div>
                <div>
                  <h3 className="font-black text-lg">{wish.author}</h3>
                  <p className="text-white/70 text-xs uppercase tracking-wider font-bold">{wish.relationship}</p>
                </div>
              </div>

              <p className="text-white/90 leading-relaxed text-[15px] mb-4 min-h-[100px]">
                "{wish.message}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-300 text-sm">★</span>
                  ))}
                </div>
                <span className="text-white/50 text-xs">B-DAYFLIX Original</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-2">
        {BIRTHDAY_WISHES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-red-600 w-6' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
