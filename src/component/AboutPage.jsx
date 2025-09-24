import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll('.about-section')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="main about-page">
      <section className="hero" id="about">
        <div className="hero-content">
          <div className="about-header">
            <h1 className="about-title">About MAITRI</h1>
            <h2 className="about-subtitle">Astronaut Resilience & Intelligence Assistant</h2>
            <div className="prototype-badge">Prototype for Bharatiya Antariksh Station (BAS)</div>
          </div>

          <div className={`about-section ${visibleSections['how-it-works'] ? 'visible' : ''}`} id="how-it-works">
            <h3 className="section-title"> How MAITRI Works</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="flow-icon">🎤</div>
                <div className="flow-text">Audio Input: Voice/Speech</div>
                <div className="flow-detail">Voice tone, pitch, speed, pauses</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-icon">📹</div>
                <div className="flow-text">Video Input: Camera feed</div>
                <div className="flow-detail">Facial expressions, eye movement</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-icon">⌨️</div>
                <div className="flow-text">Text Input: Typing patterns</div>
                <div className="flow-detail">Response time, word choice</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-icon">🧠</div>
                <div className="flow-text">AI Real-time Analysis</div>
                <div className="flow-detail">Multimodal emotion detection</div>
              </div>
            </div>
          </div>

          <div className={`about-section ${visibleSections['what-we-build'] ? 'visible' : ''}`} id="what-we-build">
            <h3 className="section-title">What We're Building</h3>
            <div className="build-card">
              <p>ARIA is a multimodal AI companion designed to support astronaut mental health through natural conversation, emotion detection, and personalized interventions.</p>
            </div>
          </div>

          <div className={`about-section ${visibleSections['core-features'] ? 'visible' : ''}`} id="core-features">
            <h3 className="section-title">Core Features</h3>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">😊</div>
                <h4>Smart Emotion Detection</h4>
                <p>Detects crew emotional state through voice and facial analysis during normal chat.</p>
                <div className="feature-example">
                  <div className="example-user">User: "I can't focus today"</div>
                  <div className="example-ai">AI detects: Frustrated tone + tired facial expression</div>
                  <div className="example-response">AI: "You sound stressed. Let's try a 2-minute breathing exercise?"</div>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Automatic Wellness Tracking</h4>
                <p>Tracks mood and sleep patterns without manual input - just through conversation.</p>
                <div className="feature-example">
                  <div className="example-user">User: *Types slowly, looks tired*</div>
                  <div className="example-ai">AI detects: Low energy + fatigue markers</div>
                  <div className="example-response">AI: "You seem tired. How did you sleep last night?"</div>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎥</div>
                <h4>AI Avatar Video Calls</h4>
                <p>Interactive video calls with AI companion for emotional support.</p>
                <div className="feature-example">
                  <div className="example-user">User feels lonely → Opens video call</div>
                  <div className="example-ai">AI Avatar: Appears with friendly face, maintains eye contact</div>
                  <div className="example-response">"Hi! I noticed you've been quiet today. Want to talk about it?"</div>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">👨‍👩‍👧‍👦</div>
                <h4>Virtual Family & Friends</h4>
                <p>Upload photos of loved ones → AI creates personalized avatars for emotional connection.</p>
                <div className="feature-example">
                  <div className="example-user">User uploads mom's photo → AI creates mom's avatar</div>
                  <div className="example-ai">AI Mom Avatar: "Beta, I'm proud of you. Tell me about your day?"</div>
                  <div className="example-response">→ Speaks in familiar tone, reduces homesickness</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`about-section ${visibleSections['architecture'] ? 'visible' : ''}`} id="architecture">
            <h3 className="section-title">Backend Architecture & Approach</h3>
            
            <div className="architecture-diagram">
              <div className="arch-layer">
                <h4>React Frontend</h4>
                <div className="arch-components">
                  <span>Chat Interface</span>
                  <span>Video Call UI</span>
                  <span>Avatar System</span>
                </div>
              </div>
              <div className="arch-arrow">↕</div>
              <div className="arch-layer">
                <h4>Python Flask API</h4>
                <div className="arch-components">
                  <span>Audio Processing</span>
                  <span>Facial Analysis</span>
                  <span>Text Analysis</span>
                </div>
              </div>
              <div className="arch-arrow">↕</div>
              <div className="arch-layer">
                <h4>ML Processing Pipeline</h4>
                <div className="arch-components">
                  <span>Emotion Detection</span>
                  <span>Response Generation</span>
                  <span>Avatar Rendering</span>
                </div>
              </div>
            </div>

            <div className="tech-stack">
              <h4>Core ML Components:</h4>
              <div className="tech-grid">
                <div className="tech-item">
                  <span className="tech-name">Voice Analysis</span>
                  <span className="tech-desc">librosa + speech_recognition</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Face Detection</span>
                  <span className="tech-desc">OpenCV + dlib</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">NLP Engine</span>
                  <span className="tech-desc">Transformers (BERT/GPT)</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Avatar System</span>
                  <span className="tech-desc">Custom 3D face generation</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`about-section ${visibleSections['why-matters'] ? 'visible' : ''}`} id="why-matters">
            <h3 className="section-title">Why This Matters</h3>
            <div className="matters-grid">
              <div className="matter-item">
                <div className="matter-icon">⏰</div>
                <h4>6 months isolation</h4>
                <p>AI companion provides consistent support</p>
              </div>
              <div className="matter-item">
                <div className="matter-icon">🏠</div>
                <h4>Missing family</h4>
                <p>Virtual family avatars reduce homesickness</p>
              </div>
              <div className="matter-item">
                <div className="matter-icon">⚡</div>
                <h4>High stress environment</h4>
                <p>Real-time intervention prevents crises</p>
              </div>
              <div className="matter-item">
                <div className="matter-icon">🛰️</div>
                <h4>Limited ground communication</h4>
                <p>On-device processing ensures 24/7 availability</p>
              </div>
            </div>
          </div>

          <div className="about-footer">
            <p className="tagline">MAITRI - Making space feel less lonely, one conversation at a time.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
