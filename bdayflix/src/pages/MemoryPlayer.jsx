import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../App'
import { MEMORIES, FAVORITES_DATA, CONTINUE_WATCHING } from '../data/constants'

const ALL_CONTENT = [...MEMORIES, ...FAVORITES_DATA, ...CONTINUE_WATCHING]

function getYouTubeId(content) {
  if (content.youtube) return content.youtube
  if (content.video && content.video.includes('youtu')) {
    const match = content.video.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&]+)/)
    if (match) return match[1]
  }
  return null
}

// ─── Netflix TUDUM Intro ───
function NetflixIntro({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="absolute inset-0 z-[60] bg-black flex items-center justify-center netflix-intro-bg">
      <div className="netflix-intro-logo text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter uppercase" style={{ color: '#E50914' }}>B-DAYFLIX</h1>
        <div className="netflix-intro-line mt-4 mx-auto" />
      </div>
    </div>
  )
}

// ─── 10-Second Skip Icon (circular arrow with "10") ───
function SkipIcon({ direction = 'back' }) {
  const flip = direction === 'forward' ? 'scale(-1, 1)' : 'scale(1, 1)'
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ transform: flip }}>
      <path d="M24 8C15.2 8 8 15.2 8 24s7.2 16 16 16 16-7.2 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M24 4v8l6-4-6-4z" fill="white"/>
      <text x="24" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="sans-serif">10</text>
    </svg>
  )
}

// ─── Netflix-Style YouTube Player ───
function YouTubeNetflixPlayer({ youtubeId, poster, title, autoplay, allContent, currentId, onVideoEnd }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const progressInterval = useRef(null)
  const controlsTimer = useRef(null)
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [started, setStarted] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [showIntro, setShowIntro] = useState(autoplay !== false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Find next content item for "Next episode" strictly within its own collection category
  let nextContent = null
  if (currentId && allContent) {
    if (currentId.startsWith('cw-')) {
      const cwList = allContent.filter(c => c.id.startsWith('cw-'))
      const idx = cwList.findIndex(c => c.id === currentId)
      if (idx >= 0 && idx < cwList.length - 1) {
        nextContent = cwList[idx + 1]
      }
    } else if (currentId.startsWith('mem-')) {
      const memList = allContent.filter(c => c.id.startsWith('mem-'))
      const idx = memList.findIndex(c => c.id === currentId)
      if (idx >= 0 && idx < memList.length - 1) {
        nextContent = memList[idx + 1]
      }
    } else if (currentId.startsWith('fav-')) {
      const favList = allContent.filter(c => c.id.startsWith('fav-'))
      const idx = favList.findIndex(c => c.id === currentId)
      if (idx >= 0 && idx < favList.length - 1) {
        nextContent = favList[idx + 1]
      }
    }
  }

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer()
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => initPlayer()

    return () => {
      clearInterval(progressInterval.current)
      if (playerRef.current?.destroy) playerRef.current.destroy()
    }
  }, [youtubeId])

  function initPlayer() {
    if (playerRef.current?.destroy) playerRef.current.destroy()

    playerRef.current = new window.YT.Player('yt-player-target', {
      videoId: youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          setReady(true)
          setDuration(e.target.getDuration())
          e.target.setVolume(80)
          if (!showIntro && autoplay !== false) {
            e.target.playVideo()
          }
        },
        onStateChange: (e) => {
          const state = e.data
          if (state === window.YT.PlayerState.PLAYING) {
            setPlaying(true)
            setStarted(true)
            startProgressTracker()
          } else if (state === window.YT.PlayerState.PAUSED) {
            setPlaying(false)
            stopProgressTracker()
          } else if (state === window.YT.PlayerState.ENDED) {
            setPlaying(false)
            stopProgressTracker()
            if (onVideoEnd) onVideoEnd()
          }
        },
      },
    })
  }

  function startProgressTracker() {
    stopProgressTracker()
    progressInterval.current = setInterval(() => {
      if (!playerRef.current?.getCurrentTime) return
      setCurrent(playerRef.current.getCurrentTime())
      setDuration(playerRef.current.getDuration())
      const loaded = playerRef.current.getVideoLoadedFraction?.() || 0
      setBuffered(loaded * 100)
    }, 250)
  }

  function stopProgressTracker() {
    clearInterval(progressInterval.current)
  }

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (playing) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [playing])

  const seekTo = useCallback((time) => {
    if (!playerRef.current) return
    playerRef.current.seekTo(time, true)
    setCurrent(time)
  }, [])

  const handleProgressClick = useCallback((e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seekTo(pct * duration)
  }, [duration, seekTo])

  const handleVolumeChange = useCallback((e) => {
    const val = parseInt(e.target.value)
    setVolume(val)
    setMuted(val === 0)
    if (playerRef.current?.setVolume) playerRef.current.setVolume(val)
    if (val === 0) playerRef.current?.mute?.()
    else playerRef.current?.unMute?.()
  }, [])

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return
    if (muted) { playerRef.current.unMute(); playerRef.current.setVolume(volume || 80); setMuted(false) }
    else { playerRef.current.mute(); setMuted(true) }
  }, [muted, volume])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) { el.requestFullscreen?.(); setIsFullscreen(true) }
    else { document.exitFullscreen?.(); setIsFullscreen(false) }
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => { if (playing) setShowControls(false) }, 3000)
  }, [playing])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break
        case 'ArrowLeft': e.preventDefault(); seekTo(Math.max(0, currentTime - 10)); break
        case 'ArrowRight': e.preventDefault(); seekTo(Math.min(duration, currentTime + 10)); break
        case 'm': e.preventDefault(); toggleMute(); break
        case 'f': e.preventDefault(); toggleFullscreen(); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [togglePlay, seekTo, currentTime, duration, toggleMute, toggleFullscreen])

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const progressPct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { if (playing) setShowControls(false) }}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      <div className="aspect-video bg-black relative overflow-hidden">
        {/* YouTube player (hidden controls) */}
        <div id="yt-player-target" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

        {/* Clickable overlay to play/pause */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {/* Netflix Intro Overlay */}
        {showIntro && (
          <NetflixIntro onDone={() => {
            setShowIntro(false)
            if (playerRef.current?.playVideo) playerRef.current.playVideo()
          }} />
        )}

        {/* Pre-play poster overlay */}
        {!started && !showIntro && (
          <div className="absolute inset-0 z-20">
            <img src={poster} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            {ready && (
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay() }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/play"
              >
                <div className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all hover:scale-110 shadow-2xl group-hover/play:shadow-red-600/50">
                  <span className="text-5xl text-white ml-1.5">▶</span>
                </div>
              </button>
            )}
            {!ready && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-4 border-white/20 border-t-red-600 rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute bottom-8 left-8 z-30">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">B-DAYFLIX ORIGINAL</p>
              <h2 className="text-3xl md:text-4xl font-black font-display">{title}</h2>
            </div>
          </div>
        )}

        {/* ── TOP BAR: Episode title ── */}
        {started && (
          <div className={`absolute top-0 left-0 right-0 z-30 transition-all duration-500 ${showControls || !playing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-gradient-to-b from-black/70 to-transparent pt-5 pb-12 px-6">
              <div className="flex items-center justify-between">
                <button onClick={() => navigate('/')} className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                </button>
                <h3 className="text-sm md:text-base font-medium text-white tracking-wide">{title}</h3>
                <div className="w-6" />
              </div>
            </div>
          </div>
        )}

        {/* ── CENTER CONTROLS: Rewind / Play-Pause / Forward ── */}
        {started && (
          <div className={`absolute inset-0 z-20 flex items-center justify-center gap-12 md:gap-20 transition-all duration-500 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}>
            {/* 10s Rewind */}
            <button
              onClick={(e) => { e.stopPropagation(); seekTo(Math.max(0, currentTime - 10)) }}
              className="hover:scale-110 transition-transform cursor-pointer active:scale-95 opacity-80 hover:opacity-100"
              title="Rewind 10s"
            >
              <SkipIcon direction="back" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay() }}
              className="hover:scale-110 transition-transform cursor-pointer active:scale-95"
            >
              {playing ? (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="white">
                  <rect x="18" y="14" width="10" height="36" rx="2" />
                  <rect x="36" y="14" width="10" height="36" rx="2" />
                </svg>
              ) : (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="white">
                  <polygon points="22,12 52,32 22,52" />
                </svg>
              )}
            </button>

            {/* 10s Forward */}
            <button
              onClick={(e) => { e.stopPropagation(); seekTo(Math.min(duration, currentTime + 10)) }}
              className="hover:scale-110 transition-transform cursor-pointer active:scale-95 opacity-80 hover:opacity-100"
              title="Forward 10s"
            >
              <SkipIcon direction="forward" />
            </button>
          </div>
        )}

        {/* ── BOTTOM CONTROLS ── */}
        <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ${showControls || !playing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-t from-black via-black/70 to-transparent pt-20 pb-3 px-4 md:px-6">
            {/* Progress bar */}
            <div className="group/bar mb-2">
              <div className="cursor-pointer h-[5px] group-hover/bar:h-[7px] bg-white/25 rounded-full relative transition-all" onClick={handleProgressClick}>
                {/* Buffered */}
                <div className="absolute inset-y-0 left-0 bg-white/25 rounded-full" style={{ width: `${buffered}%` }} />
                {/* Progress (red) */}
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100" style={{ width: `${progressPct}%`, background: '#E50914' }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform" style={{ background: '#E50914' }} />
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: action buttons */}
              <div className="flex items-center gap-3 md:gap-5">
                {/* Volume */}
                <div className="flex items-center gap-1 group/vol">
                  <button onClick={(e) => { e.stopPropagation(); toggleMute() }} className="flex items-center justify-center hover:opacity-80 transition-all cursor-pointer" title="Volume">
                    {muted || volume === 0 ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    )}
                  </button>
                  <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                    <input
                      type="range" min="0" max="100" value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 accent-red-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Episodes */}
                <button 
                  onClick={(e) => { e.stopPropagation(); document.getElementById('more-like-this')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer" 
                  title="Episodes"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                  <span>Episodes</span>
                </button>

                {/* Audio & Subtitles */}
                <button className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer" title="Audio & Subtitles">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M7 15l2-6 2 6M7.5 13.5h3M15 9v6M17 9v6"/></svg>
                  <span>Audio & Subtitles</span>
                </button>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 md:gap-5">
                {/* Time display */}
                <span className="text-sm text-gray-300 font-medium tabular-nums">
                  {fmt(currentTime)} <span className="text-gray-500">/</span> {fmt(duration)}
                </span>

                {/* Next episode */}
                {nextContent && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/player?id=${nextContent.id}`); window.scrollTo(0, 0) }}
                    className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
                    title="Next episode"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 4l12 8-12 8V4z"/><rect x="18" y="5" width="2" height="14"/></svg>
                    <span>Next episode</span>
                  </button>
                )}

                {/* Fullscreen */}
                <button onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className="flex items-center justify-center hover:opacity-80 transition-all cursor-pointer" title="Fullscreen">
                  {isFullscreen ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main MemoryPlayer Page ───
export default function MemoryPlayer() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToList, showToast } = useAppContext()
  const videoRef = useRef(null)

  const contentId = searchParams.get('id') || 'mem-1'
  const content = ALL_CONTENT.find(c => c.id === contentId) || MEMORIES[0]
  // Prioritize MP4 videos over YouTube - use HTML5 player with Netflix styling for MP4s
  const hasMP4 = content.video && typeof content.video === 'string' && !content.video.includes('youtu')
  const youtubeId = hasMP4 ? null : getYouTubeId(content)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [endPopup, setEndPopup] = useState(null) // 'next' | 'scroll' | 'memtutorial' | null
  const controlsTimer = useRef(null)

  // Determine if current video is from Continue Watching
  const cwIndex = CONTINUE_WATCHING.findIndex(c => c.id === contentId)
  const isCW = cwIndex >= 0
  const isLastCW = isCW && cwIndex === CONTINUE_WATCHING.length - 1
  const nextCW = isCW && !isLastCW ? CONTINUE_WATCHING[cwIndex + 1] : null

  // Determine if current video is from Top Memories
  const memIndex = MEMORIES.findIndex(m => m.id === contentId)
  const isMem = memIndex >= 0
  const isFirstMem = isMem && memIndex === 0
  const nextMem = isMem && memIndex < MEMORIES.length - 1 ? MEMORIES[memIndex + 1] : null

  const handleVideoEnd = () => {
    if (isCW && isLastCW) {
      setEndPopup('scroll')
    } else if (isCW && nextCW) {
      setEndPopup('next')
    } else if (isFirstMem) {
      setEndPopup('memtutorial')
    }
  }

  const chapters = [
    { name: 'welcome home, Dad!', time: 0 },
    { name: 'Tough competition to water', time: 30 },
    { name: 'Trip to Kokan with Saadu and family', time: 60 },
    { name: 'Sleeping peacefully', time: 90 },
    { name: 'Sleep laugh while being sick', time: 120 },
    { name: 'cute moment with chhotu sanskruti', time: 200 },
  ]

  // Native video listeners
  useEffect(() => {
    if (youtubeId) return
    const v = videoRef.current
    if (!v) return
    const onTime = () => setCurrentTime(v.currentTime)
    const onLoaded = () => setDuration(v.duration)
    const onEnd = () => { setIsPlaying(false); handleVideoEnd() }
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('ended', onEnd)
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('loadedmetadata', onLoaded); v.removeEventListener('ended', onEnd) }
  }, [contentId, youtubeId])

  const togglePlay = () => {
    if (youtubeId) return
    const v = videoRef.current
    if (!v) return
    if (isPlaying) { v.pause() } else { v.play().catch(() => {}) }
    setIsPlaying(!isPlaying)
  }

  const seek = (e) => {
    if (youtubeId) return
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * duration
  }

  const seekTo = (time) => {
    if (youtubeId) return
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(time, duration || 999)
    if (!isPlaying) { v.play().catch(() => {}); setIsPlaying(true) }
  }

  const changeVolume = (e) => {
    if (youtubeId) return
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) videoRef.current.volume = val
    setIsMuted(val === 0)
  }

  const toggleMute = () => {
    if (youtubeId) return
    if (videoRef.current) videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const el = document.getElementById('video-container')
    if (!el) return
    if (!document.fullscreenElement) { el.requestFullscreen?.(); setIsFullscreen(true) }
    else { document.exitFullscreen?.(); setIsFullscreen(false) }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => { if (isPlaying) setShowControls(false) }, 3000)
  }

  const fmt = (s) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${String(sec).padStart(2, '0')}` }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 text-sm">
          <span>←</span> Back to Hub
        </Link>

        {/* ── Video Player ── */}
        {youtubeId ? (
          <div className="mb-8">
            <YouTubeNetflixPlayer
              youtubeId={youtubeId}
              poster={content.image}
              title={content.title}
              autoplay={true}
              allContent={ALL_CONTENT}
              currentId={contentId}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        ) : (
          <div
            id="video-container"
            className="relative bg-black rounded-2xl overflow-hidden mb-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { if (isPlaying) setShowControls(false) }}
            style={{ cursor: showControls ? 'default' : 'none' }}
          >
            <div className="aspect-video bg-black relative overflow-hidden">
              <video
                ref={videoRef}
                src={content.video}
                poster={content.image}
                className="w-full h-full object-contain"
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
              />

              {/* Pre-play poster overlay */}
              {!isPlaying && currentTime === 0 && (
                <div className="absolute inset-0 z-20">
                  <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay() }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/play"
                  >
                    <div className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all hover:scale-110 shadow-2xl group-hover/play:shadow-red-600/50">
                      <span className="text-5xl text-white ml-1.5">▶</span>
                    </div>
                  </button>
                  <div className="absolute bottom-8 left-8 z-30">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">B-DAYFLIX ORIGINAL</p>
                    <h2 className="text-3xl md:text-4xl font-black font-display">{content.title}</h2>
                  </div>
                </div>
              )}

              {/* ── TOP BAR: Episode title ── */}
              {(currentTime > 0 || isPlaying) && (
                <div className={`absolute top-0 left-0 right-0 z-30 transition-all duration-500 ${showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <div className="bg-gradient-to-b from-black/70 to-transparent pt-5 pb-12 px-6">
                    <div className="flex items-center justify-between">
                      <button onClick={() => navigate('/')} className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                      </button>
                      <h3 className="text-sm md:text-base font-medium text-white tracking-wide">{content.title}</h3>
                      <div className="w-6" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── CENTER CONTROLS: Rewind / Play-Pause / Forward ── */}
              {(currentTime > 0 || isPlaying) && (
                <div className={`absolute inset-0 z-20 flex items-center justify-center gap-12 md:gap-20 transition-all duration-500 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                  {/* 10s Rewind */}
                  <button
                    onClick={(e) => { e.stopPropagation(); seekTo(Math.max(0, currentTime - 10)) }}
                    className="hover:scale-110 transition-transform cursor-pointer active:scale-95 opacity-80 hover:opacity-100"
                    title="Rewind 10s"
                  >
                    <SkipIcon direction="back" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay() }}
                    className="hover:scale-110 transition-transform cursor-pointer active:scale-95"
                  >
                    {isPlaying ? (
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="white">
                        <rect x="18" y="14" width="10" height="36" rx="2" />
                        <rect x="36" y="14" width="10" height="36" rx="2" />
                      </svg>
                    ) : (
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="white">
                        <polygon points="22,12 52,32 22,52" />
                      </svg>
                    )}
                  </button>

                  {/* 10s Forward */}
                  <button
                    onClick={(e) => { e.stopPropagation(); seekTo(Math.min(duration, currentTime + 10)) }}
                    className="hover:scale-110 transition-transform cursor-pointer active:scale-95 opacity-80 hover:opacity-100"
                    title="Forward 10s"
                  >
                    <SkipIcon direction="forward" />
                  </button>
                </div>
              )}

              {/* ── BOTTOM CONTROLS ── */}
              <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ${showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-gradient-to-t from-black via-black/70 to-transparent pt-20 pb-3 px-4 md:px-6">
                  {/* Progress bar */}
                  <div className="group/bar mb-2">
                    <div className="cursor-pointer h-[5px] group-hover/bar:h-[7px] bg-white/25 rounded-full relative transition-all" onClick={seek}>
                      {/* Progress (red) */}
                      <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%', background: '#E50914' }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform" style={{ background: '#E50914' }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: action buttons */}
                    <div className="flex items-center gap-3 md:gap-5">
                      {/* Volume */}
                      <div className="flex items-center gap-1 group/vol">
                        <button onClick={(e) => { e.stopPropagation(); toggleMute() }} className="flex items-center justify-center hover:opacity-80 transition-all cursor-pointer" title="Volume">
                          {isMuted || volume === 0 ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                          ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                          )}
                        </button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                          <input
                            type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                            onChange={changeVolume}
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 accent-red-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Episodes */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); document.getElementById('more-like-this')?.scrollIntoView({ behavior: 'smooth' }) }}
                        className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer" 
                        title="Episodes"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                        <span>Episodes</span>
                      </button>

                      {/* Audio & Subtitles */}
                      <button className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer" title="Audio & Subtitles">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M7 15l2-6 2 6M7.5 13.5h3M15 9v6M17 9v6"/></svg>
                        <span>Audio & Subtitles</span>
                      </button>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 md:gap-5">
                      {/* Time display */}
                      <span className="text-sm text-gray-300 font-medium tabular-nums">
                        {fmt(currentTime)} <span className="text-gray-500">/</span> {fmt(duration)}
                      </span>

                      {/* Next episode */}
                      {nextCW && isCW && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/player?id=${nextCW.id}`); window.scrollTo(0, 0) }}
                          className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
                          title="Next episode"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 4l12 8-12 8V4z"/><rect x="18" y="5" width="2" height="14"/></svg>
                          <span>Next episode</span>
                        </button>
                      )}
                      {nextMem && isMem && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/player?id=${nextMem.id}`); window.scrollTo(0, 0) }}
                          className="hidden md:flex items-center gap-1.5 text-white text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
                          title="Next episode"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 4l12 8-12 8V4z"/><rect x="18" y="5" width="2" height="14"/></svg>
                          <span>Next episode</span>
                        </button>
                      )}

                      {/* Fullscreen */}
                      <button onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className="flex items-center justify-center hover:opacity-80 transition-all cursor-pointer" title="Fullscreen">
                        {isFullscreen ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">{content.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {content.genre?.map(g => <span key={g} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-bold border border-red-600/30">{g}</span>)}
            </div>
            <p className="text-gray-400 text-lg mb-6">{content.description || 'A beautiful compilation of cherished moments and celebrations throughout the years.'}</p>

            {!youtubeId && (
              <div>
                <h3 className="font-bold text-lg mb-2">Chapters</h3>
                <div className="space-y-2">
                  {chapters.map((ch, i) => (
                    <button key={i} onClick={() => seekTo(ch.time)} className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:translate-x-1 cursor-pointer flex items-center gap-3">
                      <span className="text-red-600 font-bold">{String(i + 1).padStart(2, '0')}</span>
                      <span>{ch.name}</span>
                      <span className="text-xs text-gray-600 ml-auto">{fmt(ch.time)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold mb-4">Video Info</h3>
              <div className="space-y-3 text-sm">
                <div><p className="text-gray-500 text-xs uppercase">Duration</p><p className="font-bold">{content.duration || '32 minutes'}</p></div>
                <div><p className="text-gray-500 text-xs uppercase">Quality</p><p className="font-bold">HD • B-DAYFLIX</p></div>
                <div><p className="text-gray-500 text-xs uppercase">Match</p><p className="font-bold text-green-500">{content.match || '99%'} Match</p></div>
                <div><p className="text-gray-500 text-xs uppercase">Rating</p><p className="font-bold">{content.rating || 'PG'}</p></div>
              </div>
            </div>
            <button onClick={() => addToList({ id: content.id, title: content.title, duration: content.duration || 'N/A', image: content.image })} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all cursor-pointer">➕ Add to My List</button>
            <button onClick={() => navigate('/share')} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all border border-white/20 cursor-pointer">↗ Share Memory</button>
          </div>
        </div>

        {/* More Memories */}
        <div id="more-like-this" className="mt-16">
          <h3 className="text-2xl font-bold mb-6">More Like This</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MEMORIES.filter(m => m.id !== contentId).map(m => (
              <button key={m.id} onClick={() => { navigate(`/player?id=${m.id}`); window.scrollTo(0, 0) }} className="relative rounded-lg overflow-hidden card-3d cursor-pointer group text-left">
                <img src={m.image} alt={m.title} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><span className="text-3xl">▶</span></div>
                <p className="text-xs font-bold mt-2">{m.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── End-of-Video Popups ── */}
      {endPopup === 'next' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center popup-overlay-enter" onClick={() => setEndPopup(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-red-600/30 rounded-2xl px-10 py-8 max-w-sm text-center shadow-2xl popup-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">⏭️</div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white mb-2">Click on next episode...</h2>
            <p className="text-gray-400 text-sm mb-6">The next surprise is waiting for you!</p>
            <button
              onClick={() => { setEndPopup(null); navigate(`/player?id=${nextCW.id}`); window.scrollTo(0, 0) }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-all cursor-pointer active:scale-95"
            >
              Next Episode ▶
            </button>
          </div>
        </div>
      )}

      {endPopup === 'scroll' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center popup-overlay-enter" onClick={() => { setEndPopup(null); navigate('/'); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-red-600/30 rounded-2xl px-10 py-8 max-w-md text-center shadow-2xl popup-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🫣</div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white mb-2">Scroll down to unlock new more memories 🫣!!</h2>
            <p className="text-gray-400 text-sm mb-6">There's so much more to discover below!</p>
            <button
              onClick={() => { setEndPopup(null); navigate('/'); setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 500) }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-all cursor-pointer active:scale-95"
            >
              Take me there! 🎉
            </button>
          </div>
        </div>
      )}

      {endPopup === 'memtutorial' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center popup-overlay-enter" onClick={() => setEndPopup(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-red-600/30 rounded-2xl px-10 py-8 max-w-md text-center shadow-2xl popup-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-xl md:text-2xl font-black font-display text-white mb-2">Now you got this just click on the next episode for watching more memories!!</h2>
            <p className="text-gray-400 text-sm mb-6">Keep exploring — every memory is a new surprise!</p>
            {nextMem && (
              <button
                onClick={() => { setEndPopup(null); navigate(`/player?id=${nextMem.id}`); window.scrollTo(0, 0) }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                Next Memory ▶
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
