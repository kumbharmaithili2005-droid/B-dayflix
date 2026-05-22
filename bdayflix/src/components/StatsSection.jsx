import { STATS } from '../data/constants'

export default function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-black/40 to-transparent border border-white/5 rounded-2xl p-12 md:p-16">
      <h3 className="text-3xl font-black font-display mb-12 text-center">Project Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-5xl font-black mb-2" style={{ color: '#E50914' }}>{value}</div>
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
