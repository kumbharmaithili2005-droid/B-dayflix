import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'
import { MEMORIES } from '../data/constants'

export default function MemoryDetails() {
  const navigate = useNavigate()
  const { addToList, showToast } = useAppContext()

  const recommendations = MEMORIES.slice(0, 4)

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer" onClick={() => navigate('/player?id=mem-5')}>
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200" alt="Memory Details" className="w-full shadow-2xl" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-black text-3xl ml-1">▶</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">The Perfect Birthday Celebration</h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-bold">2024</span>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-bold">Documentary</span>
              <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-bold">Celebration</span>
              <span className="text-green-500 font-bold text-sm flex items-center">99% Match</span>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              This heartwarming documentary captures the essence of a perfect birthday celebration, showcasing the bond between friends and family. From sunrise surprises to midnight moments, this is a journey through love, laughter, and unforgettable memories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <h3 className="font-bold text-lg mb-4">Cast & Crew</h3>
                <div className="space-y-3">
                  <p className="text-gray-400"><span className="font-bold text-white">Starring:</span> All loved ones</p>
                  <p className="text-gray-400"><span className="font-bold text-white">Director:</span> Birthday Squad</p>
                  <p className="text-gray-400"><span className="font-bold text-white">Producer:</span> Joy & Celebration Inc.</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Production</h3>
                <div className="space-y-3">
                  <p className="text-gray-400"><span className="font-bold text-white">Released:</span> May 2024</p>
                  <p className="text-gray-400"><span className="font-bold text-white">Runtime:</span> 32 minutes</p>
                  <p className="text-gray-400"><span className="font-bold text-white">Rating:</span> 5★ Unforgettable</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button onClick={() => navigate('/player?id=mem-5')} className="bg-white text-black px-8 py-3 rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition-all flex items-center gap-2">▶ Play Now</button>
              <button onClick={() => addToList({ id: 'mem-5', title: 'The Big Day', duration: '55 min', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' })} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">➕ My List</button>
              <button onClick={() => navigate('/share')} className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">↗ Share</button>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="font-bold text-lg mb-6">More Like This</h3>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <button key={rec.id} onClick={() => navigate(`/player?id=${rec.id}`)} className="w-full bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-red-600/50 flex items-center gap-3 text-left">
                    <img src={rec.image} alt={rec.title} className="w-16 h-12 object-cover rounded" />
                    <div>
                      <p className="text-sm font-bold">{rec.title}</p>
                      <p className="text-xs text-gray-500">{rec.year}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
