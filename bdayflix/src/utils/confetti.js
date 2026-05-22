export function createConfetti() {
  const colors = ['#E50914', '#6D28D9', '#0EA5E9', '#FFFFFF', '#FACC15']

  function spawnParticle() {
    const particle = document.createElement('div')
    particle.style.position = 'fixed'
    particle.style.top = '-10px'
    particle.style.left = Math.random() * 100 + 'vw'
    particle.style.width = Math.random() * 8 + 4 + 'px'
    particle.style.height = particle.style.width
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    particle.style.opacity = Math.random()
    particle.style.borderRadius = '50%'
    particle.style.pointerEvents = 'none'
    particle.style.zIndex = '10'
    
    const duration = Math.random() * 3 + 2
    particle.style.animation = `fall ${duration}s linear forwards`
    
    document.body.appendChild(particle)
    
    setTimeout(() => particle.remove(), duration * 1000)
  }

  // Add keyframes if not already present
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style')
    style.id = 'confetti-styles'
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(110vh) rotate(360deg);
        }
      }
    `
    document.head.appendChild(style)
  }

  // Spawn multiple particles
  const interval = setInterval(spawnParticle, 100)
  
  // Stop after 5 seconds
  setTimeout(() => clearInterval(interval), 5000)
}
