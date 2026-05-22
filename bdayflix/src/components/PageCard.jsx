import { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function PageCard({ page, index }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    card.style.transform = `scale(1.08) translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <Link
      ref={cardRef}
      to={page.path}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="animate-card bg-gradient-to-br from-[#181818] to-[#0f0f0f] rounded-2xl p-8 card-3d overflow-hidden border border-white/10 hover:border-red-500/50 transition-all group h-80 flex flex-col justify-between"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative z-10">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${page.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl`}
        >
          {page.icon}
        </div>
        <h3 className="text-2xl font-black font-display mb-3">{page.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{page.desc}</p>
      </div>
      <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color: '#E50914' }}>
        <span>View Page</span>
        <span>→</span>
      </div>
      <div className="reflection" />
    </Link>
  )
}
