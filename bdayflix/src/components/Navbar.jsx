import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'
import { NOTIFICATIONS } from '../data/constants'

export default function Navbar({ scrolled, selectedProfile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { setSearchOpen, myList } = useAppContext()
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleFavoritesClick = () => {
    if (location.pathname === '/') {
      document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(15,15,15,0.95)',
          backdropFilter: scrolled ? 'none' : 'blur(10px)'
        }}
      >
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase font-display" style={{ color: '#E50914' }}>
            B-DAYFLIX
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Home
            </Link>
            <Link to="/list" className={`transition-colors relative ${location.pathname === '/list' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              My List
              {myList.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {myList.length}
                </span>
              )}
            </Link>
            {/* <button onClick={handleFavoritesClick} className="transition-colors text-gray-300 hover:text-white cursor-pointer">
              Favorites
            </button> */}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="text-xl cursor-pointer hover:text-gray-400 transition-colors hover:scale-110"
            title="Search"
          >
            🔍
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="text-xl cursor-pointer hover:text-gray-400 transition-colors relative hover:scale-110"
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 md:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden notif-dropdown z-50">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-red-500 hover:text-red-400 cursor-pointer font-bold">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-red-600/5' : ''}`}
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n))
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />}
                        <div className={notif.unread ? '' : 'ml-5'}>
                          <p className="text-sm text-gray-300">{notif.text}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded cursor-pointer overflow-hidden border border-white/20 flex items-center justify-center text-sm font-bold hover:border-white/40 transition-all hover:scale-110"
          >
            {selectedProfile?.charAt(0) || '👤'}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-xl cursor-pointer hover:text-gray-400"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-20 px-8 lg:hidden mobile-menu-enter">
          <div className="flex flex-col gap-6 text-xl font-medium mt-8">
            <Link to="/" className="text-white hover:text-red-500 transition-colors py-3 border-b border-white/10">
              🏠 Home
            </Link>
            <Link to="/player" className="text-gray-300 hover:text-red-500 transition-colors py-3 border-b border-white/10">
              ▶ Memory Player
            </Link>
            <Link to="/list" className="text-gray-300 hover:text-red-500 transition-colors py-3 border-b border-white/10">
              🔖 My List ({myList.length})
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-red-500 transition-colors py-3 border-b border-white/10">
              ♥ About kiran
            </Link>
            <Link to="/share" className="text-gray-300 hover:text-red-500 transition-colors py-3 border-b border-white/10">
              ↗ Share Celebration
            </Link>
            <Link to="/settings" className="text-gray-300 hover:text-red-500 transition-colors py-3 border-b border-white/10">
              ⚙ Profile Settings
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
