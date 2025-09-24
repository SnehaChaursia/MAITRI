import { useEffect, useRef, useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'bot', text: 'Welcome to Chat! Type or use the mic to speak.' }
  ])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const chatEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSpeechSupported(false)
      return
    }
    const recog = new SR()
    recog.lang = 'en-US'
    recog.continuous = false
    recog.interimResults = true
    recog.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          setInput(v => (v ? v + ' ' : '') + transcript.trim())
        } else {
          interim += transcript
        }
      }
    }
    recog.onstart = () => setListening(true)
    recog.onend = () => setListening(false)
    recog.onerror = () => setListening(false)
    recognitionRef.current = recog
  }, [])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { id: Date.now(), author: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    // demo echo from bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, author: 'bot', text: 'You said: ' + trimmed }
      ])
    }, 500)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function toggleMic() {
    if (!speechSupported) return
    const recog = recognitionRef.current
    if (!recog) return
    if (listening) {
      try { recog.stop() } catch {}
    } else {
      try { recog.start() } catch {}
    }
  }

  return (
    <main className="main">
      <section className="chat-page" aria-label="Chat page">
        <div className="chat-panel">
          <div className="chat-list">
            {messages.map(m => (
              <div key={m.id} className={`bubble ${m.author}`}>{m.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <button
              className={`mic ${listening ? 'active' : ''}`}
              onClick={toggleMic}
              title={speechSupported ? (listening ? 'Stop listening' : 'Start voice input') : 'Voice input not supported'}
              disabled={!speechSupported}
            >
              {listening ? '⏹' : '🎤'}
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or use the mic..."
              rows={1}
            />
            <button onClick={handleSend} className="send" aria-label="Send message">Send</button>
          </div>
        </div>
      </section>
    </main>
  )
}


