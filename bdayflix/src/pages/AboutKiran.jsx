import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../App'

export default function AboutKiran() {
  const navigate = useNavigate()
  const { showToast } = useAppContext()
  const [messageForm, setMessageForm] = useState({ name: '', message: '' })
  const [sentMessages, setSentMessages] = useState([])

  const sendMessage = () => {
    if (!messageForm.name.trim() || !messageForm.message.trim()) {
      showToast('Please fill in both fields', 'error')
      return
    }
    setSentMessages(prev => [...prev, { ...messageForm, time: 'Just now' }])
    showToast('Birthday message sent! 💌')
    setMessageForm({ name: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <h1 className="text-5xl md:text-6xl font-black font-display mb-6">About kiran</h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              kiran, a vibrant and spirited individual, has touched the hearts of everyone around her. This page celebrates her life, achievements, and the joy she brings to those who know her.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Biography</h2>
                <p className="text-gray-400 leading-relaxed">
                  Born on this special day, kiran has grown into an amazing person filled with passion, creativity, and kindness. From childhood adventures to adult achievements, her journey has been nothing short of remarkable. She believes in living life to the fullest, spreading happiness, and making lasting memories with loved ones.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Achievements</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Leadership', icon: '👑', desc: 'A natural-born leader who inspires everyone' },
                    { name: 'Creativity', icon: '🎨', desc: 'Turning imagination into masterpieces' },
                    { name: 'Kindness', icon: '💝', desc: 'A heart of gold that uplifts others' },
                    { name: 'Adventure', icon: '🌍', desc: 'Fearlessly exploring the unknown' },
                  ].map((a, i) => (
                    <div key={i} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-4 hover:border-red-600/30 transition-all">
                      <span className="text-2xl">{a.icon}</span>
                      <p className="font-bold mt-2">{a.name}</p>
                      <p className="text-gray-500 text-sm">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4">Interests & Hobbies</h2>
                <div className="flex flex-wrap gap-3">
                  {['Photography', 'Travel', 'Cooking', 'Music', 'Reading', 'Arts', 'Sports', 'Dancing'].map((hobby, i) => (
                    <span key={i} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-full font-bold border border-red-600/50 hover:bg-red-600/30 transition-colors cursor-default">{hobby}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <img src="/kiran-profile.png" alt="kiran" className="rounded-2xl w-full mb-8 shadow-2xl bg-gradient-to-br from-pink-100/10 to-purple-100/10" />
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div><p className="text-gray-500 uppercase text-xs">Age</p><p className="font-bold text-lg">24 Years</p></div>
                  <div><p className="text-gray-500 uppercase text-xs">Zodiac</p><p className="font-bold text-lg">✨ A True Star</p></div>
                  <div><p className="text-gray-500 uppercase text-xs">Motto</p><p className="font-bold text-lg">"Live, Laugh, Love"</p></div>
                  <div><p className="text-gray-500 uppercase text-xs">Superpower</p><p className="font-bold text-lg">Making Everyone Smile</p></div>
                </div>
              </div>
              <button onClick={() => navigate('/player?id=mem-5')} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg cursor-pointer transition-all">▶ Watch Her Story</button>
            </div>
          </div>
        </div>

        {/* Tributes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Tributes from Loved Ones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { author: 'Best Friend', message: 'You make every moment special and unforgettable!', icon: '👯' },
              { author: 'Family', message: 'Your smile brightens up our entire world.', icon: '👨‍👩‍👧‍👦' },
              { author: 'Colleague', message: 'An amazing person and an inspiration to us all.', icon: '💼' },
              { author: 'Close Friend', message: 'Celebrating you today and always! 💕', icon: '💫' },
              ...sentMessages.map(m => ({ author: m.name, message: m.message, icon: '💌' })),
            ].map((tribute, i) => (
              <div key={i} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-6 hover:border-red-600/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{tribute.icon}</span>
                  <p className="font-bold text-red-500">{tribute.author}</p>
                </div>
                <p className="text-gray-400 italic">"{tribute.message}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Send Message Form */}
        <div className="bg-gradient-to-br from-red-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-2">💌 Send a Birthday Message</h2>
          <p className="text-gray-400 mb-6">Leave your heartfelt wishes for the birthday star!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={messageForm.name} onChange={e => setMessageForm(p => ({ ...p, name: e.target.value }))} placeholder="Your Name" className="bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-colors" />
            <input type="text" value={messageForm.message} onChange={e => setMessageForm(p => ({ ...p, message: e.target.value }))} placeholder="Your Birthday Wish..." className="bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-colors" onKeyDown={e => e.key === 'Enter' && sendMessage()} />
          </div>
          <button onClick={sendMessage} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg cursor-pointer transition-all">Send Message 🎉</button>
        </div>
      </div>
    </div>
  )
}
