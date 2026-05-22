import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'

export default function CTASection() {
  const navigate = useNavigate()
  const { addToList, showToast } = useAppContext()

  return (
    <section className="px-8 lg:px-16 text-center py-20 bg-gradient-to-b from-transparent to-black/40">
      <div className="max-w-4xl mx-auto">
        <div className="text-6xl text-[#E50914] mb-6">🎉</div>
        <h2 className="text-4xl md:text-5xl font-black font-display mb-8">Ready for Your Next Season?</h2>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          Season 24 is now streaming everywhere you go. We can't wait to see the adventures, the plot twists, and the victories that await you this year.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => navigate('/player?id=mem-1')} className="group flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#E50914] group-hover:bg-[#E50914] transition-all duration-300">
              <span className="text-2xl">🔄</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Rewatch Best Bits</span>
          </button>
          <button onClick={() => navigate('/share')} className="group flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#6D28D9] group-hover:bg-[#6D28D9] transition-all duration-300">
              <span className="text-2xl">↗</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Share the Joy</span>
          </button>
          <button onClick={() => { addToList({ id: 'celebration-2024', title: 'Birthday Celebration 2024', duration: 'Full Event', image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80&w=800' }) }} className="group flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-300">
              <span className="text-2xl">➕</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">Add to My List</span>
          </button>
        </div>
      </div>
    </section>
  )
}
