import { TECH } from '../data/constants'

export default function TechSection() {
  return (
    <section>
      <h3 className="text-3xl font-black font-display mb-10">Built With</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TECH.map(({ icon, name, sub }) => (
          <div
            key={name}
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-sm font-bold">{name}</p>
            <p className="text-xs text-gray-500">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
