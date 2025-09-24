import { useEffect, useRef, useState } from 'react'

// Minimal Gemini chat integration via REST API (no extra deps)
const GEMINI_API_KEY = "AIzaSyCBJ4pjSlgLxFZKRr2VSNJ33_NES7G0vmc" // fallback to provided key

async function generateGeminiReply(history, userText) {
  // Build contents from a short window of recent messages to keep prompt concise
  const recent = history.slice(-8) // last 8 messages
  const contents = [
    ...recent.map(m => ({
      role: m.author === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    { role: 'user', parts: [{ text: userText }] }
  ]

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY || '')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`Gemini API error: ${res.status} ${msg}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
  return text
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'bot', text: 'Welcome to Chat! Type or use the mic to speak.' }
  ])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [sending, setSending] = useState(false)
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

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || sending) return

    const userMsg = { id: Date.now(), author: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Show a temporary typing indicator bubble to preserve current styles
    const typingId = Date.now() + 1
    setMessages(prev => [...prev, { id: typingId, author: 'bot', text: '…' }])

    try {
      setSending(true)
      if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your env.')
      const reply = await generateGeminiReply(messages, trimmed)
      // Replace typing indicator with real reply
      setMessages(prev => prev.map(m => m.id === typingId ? { ...m, text: reply } : m))
    } catch (err) {
      const msg = err?.message || 'Failed to get response.'
      setMessages(prev => prev.map(m => m.id === typingId ? { ...m, text: `Error: ${msg}` } : m))
    } finally {
      setSending(false)
    }
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
              disabled={sending}
            />
            <button onClick={handleSend} className="send" aria-label="Send message" disabled={sending}>Send</button>
          </div>
        </div>
      </section>
    </main>
  )
}


