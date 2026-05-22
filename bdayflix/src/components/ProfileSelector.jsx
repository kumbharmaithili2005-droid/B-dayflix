import { useState, useEffect } from 'react'
import { createConfetti } from '../utils/confetti'

const GRADIENTS = [
  { name: 'Indigo Purple', value: 'from-indigo-500 to-purple-600' },
  { name: 'Rose Red', value: 'from-rose-500 to-red-600' },
  { name: 'Emerald Teal', value: 'from-emerald-500 to-teal-600' },
  { name: 'Amber Orange', value: 'from-amber-500 to-orange-600' },
  { name: 'Cyan Blue', value: 'from-cyan-500 to-blue-600' },
]

const EMOJIS = ['👑', '🦄', '🐱', '🦊', '🌸', '🍒', '🎮', '🎨', '🚀', '💫']

export default function ProfileSelector({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([
    { id: '1', name: 'kiran', avatar: '👑', gradient: 'from-indigo-500 to-purple-600' }
  ])
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null) // Profile being edited
  const [addingProfile, setAddingProfile] = useState(null) // Form state for adding a new profile
  
  // Celebration flow state
  const [activeProfile, setActiveProfile] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebStep, setCelebStep] = useState(0)

  const handleProfileClick = (profile) => {
    if (isEditMode) {
      setEditingProfile(profile)
      return
    }

    setActiveProfile(profile)
    setShowCelebration(true)
    setCelebStep(1)
    createConfetti()

    // 5-second countdown step sequence:
    // Stage 1 (0s to 1.5s): Hello card & Big emoji
    // Stage 2 (1.5s to 3.5s): Happy Birthday wish card
    // Stage 3 (3.5s to 5.0s): Countdown spinner and progress bar
    const t2 = setTimeout(() => setCelebStep(2), 1500)
    const t3 = setTimeout(() => setCelebStep(3), 3500)
    const tEnd = setTimeout(() => {
      setShowCelebration(false)
      // Set flag to show popup on home page
      try {
        localStorage.setItem('bdayflix-profile-just-selected', 'true')
      } catch (error) {
        // localStorage might not be available
      }
      onSelectProfile(profile.name)
    }, 5000)

    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(tEnd)
    }
  }

  // Double bursts of confetti during celebration steps
  useEffect(() => {
    if (celebStep === 2) createConfetti()
    if (celebStep === 3) createConfetti()
  }, [celebStep])

  const handleSaveEdit = () => {
    if (!editingProfile.name.trim()) return
    setProfiles(prev => prev.map(p => p.id === editingProfile.id ? editingProfile : p))
    setEditingProfile(null)
  }

  const handleSaveAdd = () => {
    if (!addingProfile.name.trim()) return
    const newProfile = {
      id: Date.now().toString(),
      name: addingProfile.name,
      avatar: addingProfile.avatar || '👑',
      gradient: addingProfile.gradient || 'from-indigo-500 to-purple-600'
    }
    setProfiles(prev => [...prev, newProfile])
    setAddingProfile(null)
  }

  const handleDeleteProfile = (id) => {
    // Keep at least one profile
    if (profiles.length <= 1) {
      alert("You must keep at least one profile!")
      return
    }
    setProfiles(prev => prev.filter(p => p.id !== id))
    setEditingProfile(null)
  }

  return (
    <section className="fixed inset-0 z-[100] bg-[#0f0f0f] text-white flex flex-col items-center justify-center transition-all duration-700 overflow-y-auto py-12 px-6">
      
      {/* Brand logo */}
      <div className="absolute top-8 left-8">
        <span className="text-2xl font-black text-[#E50914] tracking-tighter font-display uppercase">B-DAYFLIX</span>
      </div>

      {!editingProfile && !addingProfile && (
        <div className="flex flex-col items-center w-full max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-12">
            {isEditMode ? 'Manage Profiles:' : "Who's watching?"}
          </h1>

          {/* Profile Cards Grid */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
            {profiles.map(profile => (
              <div key={profile.id} className="relative flex flex-col items-center group">
                <button
                  onClick={() => handleProfileClick(profile)}
                  className="profile-card cursor-pointer flex flex-col items-center gap-4 transition-all duration-300 card-3d hover:scale-110 relative"
                >
                  <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded bg-gradient-to-br ${profile.gradient} overflow-hidden flex items-center justify-center transition-all border-2 border-transparent group-hover:border-white shadow-2xl`}>
                    <span className="text-5xl md:text-7xl">{profile.avatar}</span>
                    
                    {/* Pencil Edit overlay */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/50 bg-black/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-base md:text-lg font-medium group-hover:text-white transition-colors">
                    {profile.name}
                  </span>
                </button>
              </div>
            ))}

            {/* Add Profile Card */}
            <button
              onClick={() => setAddingProfile({ name: '', avatar: '👑', gradient: 'from-indigo-500 to-purple-600' })}
              className="flex flex-col items-center gap-4 group cursor-pointer hover:scale-110 transition-all duration-300"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded border-2 border-dashed border-gray-600 hover:border-gray-400 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 shadow-2xl">
                <span className="text-5xl text-gray-500 group-hover:text-gray-300 transition-colors">+</span>
              </div>
              <span className="text-gray-500 text-base md:text-lg font-medium group-hover:text-gray-300 transition-colors">
                Add Profile
              </span>
            </button>
          </div>

          {/* Manage Profiles Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="border-2 border-gray-500 text-gray-500 hover:border-white hover:text-white font-bold tracking-wider px-8 py-2 md:px-10 md:py-2.5 rounded transition-all cursor-pointer text-sm md:text-base uppercase active:scale-95 hover:bg-white/5"
          >
            {isEditMode ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      )}

      {/* ══ EDIT PROFILE PANEL ══ */}
      {editingProfile && (
        <div className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Edit Profile</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className={`w-28 h-28 md:w-36 md:h-36 rounded bg-gradient-to-br ${editingProfile.gradient} flex items-center justify-center text-6xl md:text-7xl shadow-xl flex-shrink-0`}>
              {editingProfile.avatar}
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Profile Name</label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full bg-[#333] text-white border border-transparent rounded px-4 py-3 outline-none focus:bg-[#444] focus:border-red-600 transition-all font-medium"
                  placeholder="Enter name"
                  maxLength={15}
                />
              </div>

              {/* Avatar Emoji Selector */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Choose Avatar Emoji</label>
                <div className="flex flex-wrap gap-2.5">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setEditingProfile({ ...editingProfile, avatar: emoji })}
                      className={`text-3xl p-2 rounded hover:bg-white/10 active:scale-90 transition-all cursor-pointer ${editingProfile.avatar === emoji ? 'bg-red-600/20 border border-red-600' : 'border border-transparent'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Gradient Selector */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Card Gradient Background</label>
                <div className="flex flex-wrap gap-3">
                  {GRADIENTS.map(grad => (
                    <button
                      key={grad.value}
                      onClick={() => setEditingProfile({ ...editingProfile, gradient: grad.value })}
                      className={`w-10 h-10 rounded bg-gradient-to-br ${grad.value} transition-all cursor-pointer ${editingProfile.gradient === grad.value ? 'ring-4 ring-red-600 scale-105' : 'hover:scale-105'}`}
                      title={grad.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
            <button
              onClick={handleSaveEdit}
              className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 rounded tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingProfile(null)}
              className="border border-gray-600 text-gray-400 hover:text-white hover:border-white font-bold px-8 py-3 rounded tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteProfile(editingProfile.id)}
              className="border border-red-600/50 text-red-500 hover:bg-red-600/10 font-bold px-8 py-3 rounded tracking-wider ml-auto cursor-pointer active:scale-95 transition-all"
            >
              Delete Profile
            </button>
          </div>
        </div>
      )}

      {/* ══ ADD PROFILE PANEL ══ */}
      {addingProfile && (
        <div className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Add Profile</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className={`w-28 h-28 md:w-36 md:h-36 rounded bg-gradient-to-br ${addingProfile.gradient} flex items-center justify-center text-6xl md:text-7xl shadow-xl flex-shrink-0`}>
              {addingProfile.avatar}
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Profile Name</label>
                <input
                  type="text"
                  value={addingProfile.name}
                  onChange={(e) => setAddingProfile({ ...addingProfile, name: e.target.value })}
                  className="w-full bg-[#333] text-white border border-transparent rounded px-4 py-3 outline-none focus:bg-[#444] focus:border-red-600 transition-all font-medium"
                  placeholder="Enter name"
                  maxLength={15}
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Choose Avatar Emoji</label>
                <div className="flex flex-wrap gap-2.5">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setAddingProfile({ ...addingProfile, avatar: emoji })}
                      className={`text-3xl p-2 rounded hover:bg-white/10 active:scale-90 transition-all cursor-pointer ${addingProfile.avatar === emoji ? 'bg-red-600/20 border border-red-600' : 'border border-transparent'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Selector */}
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Card Gradient Background</label>
                <div className="flex flex-wrap gap-3">
                  {GRADIENTS.map(grad => (
                    <button
                      key={grad.value}
                      onClick={() => setAddingProfile({ ...addingProfile, gradient: grad.value })}
                      className={`w-10 h-10 rounded bg-gradient-to-br ${grad.value} transition-all cursor-pointer ${addingProfile.gradient === grad.value ? 'ring-4 ring-red-600 scale-105' : 'hover:scale-105'}`}
                      title={grad.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/5">
            <button
              onClick={handleSaveAdd}
              className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 rounded tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Create Profile
            </button>
            <button
              onClick={() => setAddingProfile(null)}
              className="border border-gray-600 text-gray-400 hover:text-white hover:border-white font-bold px-8 py-3 rounded tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ══ CELEBRATION POPUP (5-Second Countdown) ══ */}
      {showCelebration && activeProfile && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center celebration-overlay">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

          <div className="relative z-10 text-center px-6 max-w-lg celebration-content flex flex-col items-center justify-center">
            
            {/* Step 1: Big emoji burst (0s - 1.5s) */}
            {celebStep === 1 && (
              <div className="animate-zoom-in flex flex-col items-center">
                <div className="text-9xl mb-6 celebration-bounce">🎂</div>
                <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-2 leading-tight">
                  Hello, {activeProfile.name}!
                </h2>
                <p className="text-gray-400 text-lg">Setting up your birthday screen</p>
              </div>
            )}

            {/* Step 2: Birthday message (1.5s - 3.5s) */}
            {celebStep === 2 && (
              <div className="celebration-slide-up flex flex-col items-center w-full">
                <div className="flex justify-center gap-4 text-6xl md:text-7xl mb-8">
                  <span className="celebration-bounce" style={{ animationDelay: '0s' }}>🎉</span>
                  <span className="celebration-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
                  <span className="celebration-bounce" style={{ animationDelay: '0.4s' }}>🥳</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-display mb-4 tracking-tight leading-none text-center">
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #E50914, #ff6b6b, #facc15)' }}>
                    Happy Birthday! 🎂
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed text-center px-4">
                  Today is all about YOU! Get ready for a celebration you'll never forget.
                </p>
              </div>
            )}

            {/* Step 3: Entering message & premium loading spinner (3.5s - 5s) */}
            {celebStep === 3 && (
              <div className="celebration-slide-up flex flex-col items-center w-full">
                <div className="text-7xl md:text-8xl mb-8 celebration-bounce">🌟</div>
                <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
                  Your Celebration Awaits...
                </h2>
                <p className="text-gray-400 text-sm tracking-wider uppercase mb-6">Streaming happiness in high definition</p>
                
                {/* Custom premium progress bar timer */}
                <div className="w-64 h-[6px] bg-white/20 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-red-600 rounded-full animate-load-timer" />
                </div>
                
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
