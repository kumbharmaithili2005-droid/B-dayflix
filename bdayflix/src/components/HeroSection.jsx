import { useNavigate } from 'react-router-dom'

export default function HeroSection({ selectedProfile = 'kiran' }) {
  const navigate = useNavigate()

  return (
    <header className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-end pt-20 md:pt-24 lg:pt-24 pb-10 lg:pb-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover"
          alt="Celebration"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content — anchored bottom-left */}
      <div className="relative z-10 px-8 md:px-12 lg:px-16 max-w-2xl lg:max-w-3xl animate-hero w-full">
        {/* B-DAYFLIX Original Badge */}
        <div className="flex items-center gap-2 mb-3 lg:mb-4">
          <span className="text-xl lg:text-3xl font-black tracking-tighter" style={{ color: '#E50914' }}>B</span>
          <span className="text-xs lg:text-sm font-bold uppercase tracking-[0.3em] text-gray-300">SERIES</span>
        </div>

        {/* Title */}
        <h1 className="hero-title font-black font-display leading-[0.92] mb-3 lg:mb-5 drop-shadow-2xl">
          <span className="block italic text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem]">Happy</span>
          <span className="block italic text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem]">Birthday,</span>
          <span className="block italic text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #E50914, #ff6b6b, #E50914)' }}>
            {selectedProfile || 'kiran'}
          </span>
        </h1>

        {/* Top 10 Badge */}
        <div className="flex items-center gap-3 mb-2 lg:mb-4">
          <div className="flex-shrink-0">
            <svg width="24" height="26" viewBox="0 0 28 30" fill="none">
              <rect x="0" y="0" width="28" height="30" rx="3" fill="#E50914"/>
              <text x="5" y="12" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">TOP</text>
              <text x="6" y="24" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">10</text>
            </svg>
          </div>
          <span className="text-sm lg:text-lg font-bold text-white">#1 Happy Birthday kiran</span>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm lg:text-base text-gray-300 mb-4 lg:mb-6 max-w-sm lg:max-w-lg leading-relaxed drop-shadow-md">
          A once-in-a-lifetime celebration featuring award-winning moments, surprise cameos from your favorite people, and a season finale you'll never forget.
        </p>

        {/* Play & More Info Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/player?id=cw-1')}
            className="bg-white text-black pl-5 pr-7 py-2 lg:py-2.5 rounded font-bold flex items-center gap-2 hover:bg-white/80 transition-all active:scale-95 cursor-pointer text-sm lg:text-base shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><polygon points="5,3 19,12 5,21" /></svg>
            Play
          </button>
          <button
            onClick={() => navigate('/details')}
            className="bg-gray-500/60 backdrop-blur-sm text-white pl-5 pr-7 py-2 lg:py-2.5 rounded font-bold flex items-center gap-2 hover:bg-gray-500/40 transition-all active:scale-95 cursor-pointer text-sm lg:text-base"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r="0.5" fill="white"/></svg>
            More Info
          </button>
        </div>
      </div>

      {/* Maturity Rating Badge */}
      <div className="absolute bottom-[8%] lg:bottom-[12%] right-0 z-10">
        <div className="bg-gray-800/60 backdrop-blur-sm border-l-2 border-white/30 px-4 py-1.5">
          <span className="text-xs lg:text-sm font-bold text-gray-300">U/A 13+</span>
        </div>
      </div>
    </header>
  )
}
