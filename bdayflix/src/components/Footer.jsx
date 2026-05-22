import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'

export default function Footer() {
  const navigate = useNavigate()
  const { showToast } = useAppContext()

  const handleSocial = (platform) => {
    const urls = {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
    }
    window.open(urls[platform], '_blank')
  }

  return (
    <footer className="bg-black/80 px-8 py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-black text-[#E50914] font-display">B-DAYFLIX</Link>
          <p className="text-sm text-gray-500">Hand-curated for the world's favorite birthday star.</p>
        </div>
        <div className="flex gap-6 text-gray-400">
          <button onClick={() => handleSocial('facebook')} className="hover:text-white transition-colors cursor-pointer text-xl hover:scale-110">👍</button>
          <button onClick={() => handleSocial('instagram')} className="hover:text-white transition-colors cursor-pointer text-xl hover:scale-110">📷</button>
          <button onClick={() => handleSocial('twitter')} className="hover:text-white transition-colors cursor-pointer text-xl hover:scale-110">𝕏</button>
          <button onClick={() => handleSocial('youtube')} className="hover:text-white transition-colors cursor-pointer text-xl hover:scale-110">▶️</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-10">
        <button onClick={() => navigate('/')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Memory Collection</button>
        <button onClick={() => navigate('/about')} className="hover:underline text-left cursor-pointer hover:text-gray-300">About the Star</button>
        <button onClick={() => navigate('/share')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Share Celebration</button>
        <button onClick={() => navigate('/player')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Media Center</button>
        <button onClick={() => navigate('/settings')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Profile Settings</button>
        <button onClick={() => showToast('Cookie preferences saved! 🍪', 'info')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Cookie Preferences</button>
        <button onClick={() => navigate('/list')} className="hover:underline text-left cursor-pointer hover:text-gray-300">My Watchlist</button>
        <button onClick={() => showToast('Love from the Birthday Squad! 💕', 'success')} className="hover:underline text-left cursor-pointer hover:text-gray-300">Contact Family</button>
      </div>

      <div className="max-w-6xl mx-auto text-[10px] text-gray-600">
        © 2024 B-Dayflix Entertainment. This site was built to celebrate the awesome existence of an amazing person. All rights reserved for more cake. 🎂
      </div>
    </footer>
  )
}
