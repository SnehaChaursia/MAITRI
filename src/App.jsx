import { useEffect, useRef, useState } from 'react'
import './App.css'
import intro from './assets/intro.mp4'
import backGround from './assets/backGround.mp4'
import ChatPage from './component/ChatPage.jsx'
import AvtarPage from './component/AvtarPage.jsx'
import AboutPage from './component/AboutPage.jsx'
import SignupPage from './component/SignupPage.jsx'
import LoginPage from './component/LoginPage.jsx'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, author: 'bot', text: 'Hi! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isChatOpen])

  // 3D tilt for the hero animation frame
  const frameRef = useRef(null)
  function handleTilt(e) {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    el.style.setProperty('--rx', `${(-dy * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(dx * 10).toFixed(2)}deg`)
  }
  function resetTilt() {
    const el = frameRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { id: Date.now(), author: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, author: 'bot', text: "I'm just a demo chat. Your video area is ready!" }
      ])
      setIsTyping(false)
    }, 900)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const [route, setRoute] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // simple hash-based routing
  useEffect(() => {
    function syncRouteFromHash() {
      const hash = window.location.hash.replace('#', '')
      if (hash === '/chat' || hash === 'chat') setRoute('chat')
      else if (hash === '/avtar' || hash === 'avtar') setRoute('avtar')
      else if (hash === '/about' || hash === 'about') setRoute('about')
      else if (hash === '/signup' || hash === 'signup') setRoute('signup')
      else if (hash === '/login' || hash === 'login') setRoute('login')
      else setRoute('home')
    }
    syncRouteFromHash()
    window.addEventListener('hashchange', syncRouteFromHash)
    return () => window.removeEventListener('hashchange', syncRouteFromHash)
  }, [])

  return (
    <div className="app">
      {/* Full-page background animation */}
      <div className="page-bg" aria-hidden="true">
        <video className="page-bg-video" src={backGround} autoPlay muted loop playsInline />
      </div>

      {/* Universal Sidebar - Only show on non-home pages */}
      {route !== 'home' && (
        <div className="universal-sidebar">
          <button
            className="back-btn"
            onClick={() => {
              window.location.hash = '#/';
              setRoute('home');
            }}
            title="Go Back to Home"
          >
            ←
          </button>
        </div>
      )}
      {route !== 'chat' && (
        <header className="navbar">
          <div className="nav-inner">
            <div className="brand">MAITRI</div>
            <nav className={`links ${isMenuOpen ? 'open' : ''}`}>
              <a href="#home">Home</a>
              <a href="#/about" onClick={(e) => { e.preventDefault(); window.location.hash = '#/about'; setRoute('about') }}>About</a>
              <a href="#features">Features</a>
              <div className="auth-dropdown">
                <button
                  className="auth-trigger"
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                >
                  Auth ▼
                </button>
                {isAuthDropdownOpen && (
                  <div className="auth-dropdown-menu">
                    <a href="#/signup" onClick={(e) => { e.preventDefault(); window.location.hash = '#/signup'; setRoute('signup'); setIsAuthDropdownOpen(false) }}>Signup</a>
                    <a href="#/login" onClick={(e) => { e.preventDefault(); window.location.hash = '#/login'; setRoute('login'); setIsAuthDropdownOpen(false) }}>Login</a>
                  </div>
                )}
              </div>
              <a href="#/avtar" onClick={(e) => { e.preventDefault(); window.location.hash = '#/avtar'; setRoute('avtar') }}>Avtar</a>
              <button className="alert-icon" title="Notifications">
                🔔
              </button>
            </nav>
            <button
              aria-label="Toggle menu"
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(v => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>
      )}

      {route === 'home' ? (
        <main className="main">
          <section className="hero" id="home">
            <div className="hero-content">
              <h1>Welcome</h1>
              <p> Your Companion Beyond Earth-Balancing Emotional and Physical Well-being in Space underneath</p>
              <div className="video-shell" aria-label="Animated hero">
                <div
                  ref={frameRef}
                  className="video-frame"
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                >
                  <div className="glow-ring" />
                  <div className="video-meta">
                    <div className="dot" />
                    <span>Interactive 3D Animation</span>
                  </div>
                  <video
                    className="video"
                    src={intro}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                  />
                  <div className="cta-overlay">
                    <a
                      className="btn-primary"
                      href="#/chat"
                      onClick={() => setRoute('chat')}
                    >
                      Go to Chat
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : route === 'chat' ? (
        <div className={`chat-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
          <button className={`chat-hamburger ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <aside className="sidebar">
            <div className="sidebar-brand">MAITRI</div>
            <button className="sidebar-close" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>×</button>
            <nav className={`sidebar-links ${sidebarOpen ? 'open' : ''}`}>
              <a href="#/chat" className={route === 'chat' ? 'active' : ''}>Chat</a>
              <a href="#/home" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; }}>Home</a>
              <a href="#/about" onClick={(e) => { e.preventDefault(); window.location.hash = '#/about'; setRoute('about'); setSidebarOpen(false) }} className={route === 'about' ? 'active' : ''}>About</a>
              <a href="#/home#features" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; setTimeout(() => { window.location.hash = '#features' }, 0) }}>Features</a>
              <a href="#/signup" onClick={(e) => { e.preventDefault(); window.location.hash = '#/signup'; setRoute('signup'); setSidebarOpen(false) }} className={route === 'signup' ? 'active' : ''}>Signup</a>
              <a href="#/login" onClick={(e) => { e.preventDefault(); window.location.hash = '#/login'; setRoute('login'); setSidebarOpen(false) }} className={route === 'login' ? 'active' : ''}>Login</a>
              <a href="#/avtar" onClick={(e) => { e.preventDefault(); window.location.hash = '#/avtar'; setRoute('avtar'); setSidebarOpen(false) }} className={route === 'avtar' ? 'active' : ''}>Avtar</a>
              <button className="alert-icon" title="Notifications">
                🔔
              </button>
            </nav>
          </aside>
          <div className="chat-main">
            <ChatPage />
          </div>
        </div>
      ) : route === 'avtar' ? (
        <AvtarPage />
      ) : route === 'about' ? (
        <AboutPage />
      ) : route === 'signup' ? (
        <SignupPage />
      ) : route === 'login' ? (
        <LoginPage />
      ) : null}

      <button
        className="chat-fab"
        aria-label="Open chat"
        onClick={() => setIsChatOpen(v => !v)}
      >
        {isChatOpen ? '×' : '💬'}
      </button>

      <div className={`chat-window ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span>Live Chat</span>
          <button className="close" onClick={() => setIsChatOpen(false)} aria-label="Close chat">×</button>
        </div>
        <div className="chat-body">
          {messages.map(m => (
            <div key={m.id} className={`bubble ${m.author}`}>
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="bubble bot typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
          />
          <button onClick={handleSend} className="send" aria-label="Send message">Send</button>
        </div>
      </div>
    </div>
  )
}

export default App
