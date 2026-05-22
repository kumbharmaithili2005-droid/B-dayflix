import { useNavigate } from 'react-router-dom'
import { CONTINUE_WATCHING } from '../data/constants'

export default function ContinueWatching() {
  const navigate = useNavigate()

  return (
    <section className="px-8 lg:px-16">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 group">
        <span className="text-white">▶ Continue Watching</span>
        <span className="text-gray-400 transition-transform group-hover:translate-x-1">→</span>
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-8 scroll-smooth hide-scrollbar">
        {CONTINUE_WATCHING.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/player?id=${item.id}`)}
            className="flex-none w-72 md:w-80 relative card-3d rounded-lg cursor-pointer overflow-hidden group text-left"
          >
            <div className="relative h-44">
              <img
                src={item.image}
                className="w-full h-full object-cover rounded-t-lg"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-100 scale-0 transition-transform duration-300">
                  <span className="text-black text-2xl ml-1">▶</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-700 w-full">
              <div
                className="h-full bg-red-600 transition-all"
                style={{ width: `${item.progress}%` }}
              />
            </div>

            <div className="bg-[#181818] p-4 rounded-b-lg border-x border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm group-hover:text-white text-gray-200">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.duration} • {item.progress}% watched</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm hover:border-white/50 transition-colors" title="More Info">
                    ℹ
                  </span>
                </div>
              </div>
            </div>
            <div className="reflection" />
          </button>
        ))}
      </div>
    </section>
  )
}
