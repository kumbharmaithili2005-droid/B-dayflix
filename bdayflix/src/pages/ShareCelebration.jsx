import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../App'

export default function ShareCelebration() {
  const { showToast } = useAppContext()
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState('')

  const copyLink = () => {
    navigator.clipboard.writeText('https://bdayflix.com/celebrate/kiran24').catch(() => {})
    setCopied(true)
    showToast('Link copied to clipboard! 📋')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareTo = (platform) => {
    const msg = encodeURIComponent(customMessage || '🎉 Check out this amazing birthday celebration on B-DAYFLIX!')
    const url = encodeURIComponent('https://bdayflix.com/celebrate/kiran24')
    const urls = {
      Twitter: `https://twitter.com/intent/tweet?text=${msg}&url=${url}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      Instagram: `https://instagram.com`,
      WhatsApp: `https://wa.me/?text=${msg}%20${url}`,
    }
    window.open(urls[platform], '_blank')
    showToast(`Shared to ${platform}! 🎉`)
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        <h1 className="text-4xl md:text-5xl font-black font-display mb-2">Share the Celebration</h1>
        <p className="text-gray-400 text-lg mb-12">Spread the joy and let everyone celebrate together</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Engagement Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Views', value: '2.4K', icon: '👁️' },
                { label: 'Shares', value: '856', icon: '↗️' },
                { label: 'Likes', value: '1.2K', icon: '❤️' },
                { label: 'Comments', value: '342', icon: '💬' },
              ].map((metric, i) => (
                <div key={i} className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-red-600/30 transition-all">
                  <p className="text-3xl mb-2">{metric.icon}</p>
                  <p className="text-sm text-gray-400 uppercase">{metric.label}</p>
                  <p className="text-2xl font-black">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Share Links</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Direct Link</p>
                <div className="flex gap-2">
                  <input type="text" value="https://bdayflix.com/celebrate/kiran24" readOnly className="flex-1 bg-black border border-white/20 rounded px-3 py-2 text-sm text-gray-300 outline-none" />
                  <button onClick={copyLink} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all font-bold cursor-pointer min-w-[80px]">{copied ? '✓ Copied' : 'Copy'}</button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Custom Message (optional)</p>
                <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder="Add a personal message to your share..." className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm text-gray-300 outline-none focus:border-red-600 transition-colors h-20 resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Share on Social Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Twitter', icon: '𝕏', color: 'hover:bg-gray-700' },
              { name: 'Facebook', icon: 'f', color: 'hover:bg-blue-700' },
              { name: 'Instagram', icon: '◎', color: 'hover:bg-pink-600' },
              { name: 'WhatsApp', icon: '💬', color: 'hover:bg-green-600' },
            ].map((platform) => (
              <button key={platform.name} onClick={() => shareTo(platform.name)} className={`bg-white/10 border border-white/20 rounded-lg p-6 text-center transition-all ${platform.color} text-white cursor-pointer hover:scale-105 hover:shadow-lg`}>
                <p className="text-4xl mb-2">{platform.icon}</p>
                <p className="font-bold">{platform.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
