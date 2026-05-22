import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProfileSelector from './components/ProfileSelector'
import HomePage from './pages/HomePage'
import MemoryPlayer from './pages/MemoryPlayer'
import MemoryDetails from './pages/MemoryDetails'
import ShareCelebration from './pages/ShareCelebration'
import MyList from './pages/MyList'
import ProfileSettings from './pages/ProfileSettings'
import AboutKiran from './pages/AboutKiran'
import Toast from './components/Toast'
import SearchModal from './components/SearchModal'
import { createConfetti } from './utils/confetti'
import { MEMORIES } from './data/constants'

export const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showMainContent, setShowMainContent] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)


  // Global My List state
  const [myList, setMyList] = useState([
    { id: 'mem-5', title: 'The Big Day', duration: '55 min', watched: true, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' },
    { id: 'mem-2', title: 'Teenage Dreams', duration: '42 min', watched: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800' },
    { id: 'mem-6', title: 'Late Nights', duration: '38 min', watched: false, image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800' },
  ])

  // Toast notification system
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToList = useCallback((item) => {
    setMyList(prev => {
      if (prev.find(i => i.id === item.id)) {
        showToast('Already in your list!', 'info')
        return prev
      }
      showToast(`"${item.title}" added to My List! 🎉`)
      return [...prev, { ...item, watched: false }]
    })
  }, [showToast])

  const removeFromList = useCallback((id) => {
    setMyList(prev => {
      const item = prev.find(i => i.id === id)
      if (item) showToast(`"${item.title}" removed from list`)
      return prev.filter(i => i.id !== id)
    })
  }, [showToast])

  const toggleWatched = useCallback((id) => {
    setMyList(prev => prev.map(i => i.id === id ? { ...i, watched: !i.watched } : i))
  }, [])

  const isInList = useCallback((id) => {
    return myList.some(i => i.id === id)
  }, [myList])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])



  const handleProfileSelect = (profileName) => {
    setSelectedProfile(profileName)
    setShowMainContent(true)
  }

  if (!showMainContent) {
    return <ProfileSelector onSelectProfile={handleProfileSelect} />
  }

  const contextValue = {
    selectedProfile,
    myList,
    addToList,
    removeFromList,
    toggleWatched,
    isInList,
    showToast,
    searchOpen,
    setSearchOpen,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen relative" style={{ backgroundColor: '#0f0f0f' }}>
          <Navbar scrolled={scrolled} selectedProfile={selectedProfile} />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/player" element={<MemoryPlayer />} />
            <Route path="/details" element={<MemoryDetails />} />
            <Route path="/share" element={<ShareCelebration />} />
            <Route path="/list" element={<MyList />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/about" element={<AboutKiran />} />
          </Routes>

          <Footer />
        </div>

        {/* Global overlays */}
        <SearchModal />
        <Toast toasts={toasts} onRemove={removeToast} />
      </Router>
    </AppContext.Provider>
  )
}
