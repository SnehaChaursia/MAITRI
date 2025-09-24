import comingSoon from '../assets/comingSoon.mp4'

export default function AvtarPage() {
  return (
    <main className="main">
      <section className="hero" id="avtar">
        <div className="hero-content">
          <div className="coming-soon-text">Coming Soon...</div>
          <div className="coming-soon-container">
            <video 
              className="coming-soon-video" 
              src={comingSoon} 
              autoPlay 
              muted 
              loop 
              playsInline
            />
          </div>
        </div>
      </section>
    </main>
  )
}


