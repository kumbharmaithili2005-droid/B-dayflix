import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../App'

export default function ProfileSettings() {
  const { showToast } = useAppContext()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    displayName: 'Birthday Celebrant',
    email: 'celebrate@bdayflix.com',
    bio: 'Living the best birthday celebration ever!',
  })
  const [notifSettings, setNotifSettings] = useState([
    { label: 'Email Notifications', checked: true },
    { label: 'Birthday Reminders', checked: true },
    { label: 'New Memory Alerts', checked: false },
    { label: 'Share Updates', checked: true },
  ])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'history', label: 'Watch History', icon: '📺' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ]

  const handleSave = () => showToast('Profile saved successfully! 🎉')

  const toggleNotif = (idx) => {
    setNotifSettings(prev => prev.map((n, i) => i === idx ? { ...n, checked: !n.checked } : n))
    showToast('Notification preference updated', 'info')
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        <h1 className="text-4xl md:text-5xl font-black font-display mb-12">Profile Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-48">
            <div className="md:sticky md:top-24 space-y-2">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  <span className="text-lg">{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-2 uppercase font-bold">Display Name</label>
                      <input type="text" value={formData.displayName} onChange={e => setFormData(p => ({ ...p, displayName: e.target.value }))} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2 uppercase font-bold">Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2 uppercase font-bold">Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white h-24 outline-none focus:border-red-600 transition-colors resize-none" />
                    </div>
                    <button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all cursor-pointer">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Watch History</h2>
                <div className="space-y-3">
                  {['Surprise!! just for you..', 'Something special', 'Behind the Scenes', 'Guest Interviews', 'The Big Day'].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                        <p className="text-gray-300">{item}</p>
                      </div>
                      <p className="text-gray-500 text-sm">{i + 1} day{i > 0 ? 's' : ''} ago</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Notification Settings</h2>
                <div className="space-y-4">
                  {notifSettings.map((notif, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                      <p className="text-gray-300">{notif.label}</p>
                      <button onClick={() => toggleNotif(i)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${notif.checked ? 'bg-red-600' : 'bg-gray-700'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${notif.checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Security Settings</h2>
                <div className="space-y-4">
                  <button onClick={() => setShowPasswordModal(true)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-lg transition-all cursor-pointer">🔑 Change Password</button>
                  <button onClick={() => showToast('Two-factor authentication enabled!', 'success')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-lg transition-all cursor-pointer">🛡️ Two-Factor Authentication</button>
                  <button onClick={() => setShowLogoutConfirm(true)} className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 font-bold py-3 rounded-lg transition-all cursor-pointer">🚪 Log Out All Devices</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <div className="space-y-4 mb-6">
              <input type="password" placeholder="Current Password" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600" />
              <input type="password" placeholder="New Password" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600" />
              <input type="password" placeholder="Confirm New Password" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-red-600" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowPasswordModal(false); showToast('Password updated!') }} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold cursor-pointer">Update</button>
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 bg-white/10 py-3 rounded-lg font-bold cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <p className="text-4xl mb-4">🚪</p>
            <h2 className="text-xl font-bold mb-4">Log Out All Devices?</h2>
            <p className="text-gray-400 mb-6">You'll need to sign in again on all devices.</p>
            <div className="flex gap-4">
              <button onClick={() => { setShowLogoutConfirm(false); showToast('All devices logged out', 'info') }} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold cursor-pointer">Confirm</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white/10 py-3 rounded-lg font-bold cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
