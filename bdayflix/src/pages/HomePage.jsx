import { useRef, useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import TopMemories from '../components/TopMemories'
// import AllTimeFavorites from '../components/AllTimeFavorites'
import CTASection from '../components/CTASection'
import ContinueWatching from '../components/ContinueWatching'
import BirthdayWishes from '../components/BirthdayWishes'
import LifeTimeline from '../components/LifeTimeline'
import { useAppContext } from '../App'

export default function HomePage() {
  const pagesSectionRef = useRef(null)
  const [showPlayPopup, setShowPlayPopup] = useState(false)

  let selectedProfile = 'BIRTHDAY STAR'
  try {
    const ctx = useAppContext()
    if (ctx?.selectedProfile) selectedProfile = ctx.selectedProfile
  } catch (error) {
    // Context not available
  }

  // Show "click on play!!" popup only when user selects profile and comes to home page
  useEffect(() => {
    try {
      const profileJustSelected = localStorage.getItem('bdayflix-profile-just-selected')
      if (profileJustSelected === 'true') {
        const timer = setTimeout(() => {
          setShowPlayPopup(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      // localStorage might not be available
    }
  }, [])

  const dismissPlayPopup = () => {
    setShowPlayPopup(false)
    // Clear the flag so popup doesn't show again
    try {
      localStorage.removeItem('bdayflix-profile-just-selected')
    } catch (error) {
      // localStorage might not be available
    }
  }

  return (
    <>
      <HeroSection selectedProfile={selectedProfile} />
      <main className="relative z-20 pt-2 lg:pt-4 space-y-8 pb-20">
        <ContinueWatching />
        <TopMemories />
        <BirthdayWishes />
        {/* <AllTimeFavorites /> */}
        <LifeTimeline />
        <CTASection />
      </main>

      {/* "Click on Play!!" Popup — first visit only */}
      {showPlayPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center popup-overlay-enter" onClick={dismissPlayPopup}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-red-600/30 rounded-2xl px-10 py-8 max-w-sm text-center shadow-2xl popup-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white mb-2">Click on Play!!</h2>
            <p className="text-gray-400 text-sm mb-6">Your birthday celebration is ready to stream!</p>
            <button
              onClick={dismissPlayPopup}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-all cursor-pointer active:scale-95"
            >
              Got it! 🎉
            </button>
          </div>
        </div>
      )}
    </>
  )
}
