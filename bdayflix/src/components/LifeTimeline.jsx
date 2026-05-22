import { useEffect, useRef, useState } from 'react'
import { BIRTHDAY_TIMELINE } from '../data/constants'

export default function LifeTimeline() {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const itemRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.dataset.index]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-8 lg:px-16 py-12">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 group">
        <span className="text-white">📅 Life Timeline</span>
        <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
      </h2>
      <p className="text-gray-500 text-sm mb-10">Every season tells a story — here's the highlight reel</p>

      <div className="relative">
        {/* Central line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-purple-600 to-red-600 md:-translate-x-1/2" />

        <div className="space-y-8 md:space-y-12">
          {BIRTHDAY_TIMELINE.map((item, i) => {
            const isLeft = i % 2 === 0
            const isVisible = visibleItems.has(String(i))

            return (
              <div
                key={i}
                ref={el => itemRefs.current[i] = el}
                data-index={i}
                className={`relative flex items-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Dot on line */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-[#0f0f0f] z-10 md:-translate-x-1/2 -translate-x-1/2 shadow-[0_0_20px_rgba(229,9,20,0.5)]" />

                {/* Card */}
                <div className={`ml-16 md:ml-0 md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-5 hover:border-red-600/30 transition-all hover:shadow-lg hover:shadow-red-600/5 group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black uppercase tracking-widest px-2 py-1 bg-red-600/20 text-red-400 rounded border border-red-600/30">
                        {item.year}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.season}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-red-400 transition-colors">{item.event}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
