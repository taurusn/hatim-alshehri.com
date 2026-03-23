import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const charsRef = useRef([])
  const counterRef = useRef(null)
  const fillRef = useRef(null)
  const wrapRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean)
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out entire loader
        gsap.to(wrapRef.current, {
          opacity: 0,
          scale: 0.98,
          filter: 'blur(8px)',
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            setVisible(false)
            onComplete()
          },
        })
      },
    })

    // Initial state: chars hidden below
    tl.set(chars, { y: 90, opacity: 0 })
    tl.set(taglineRef.current, { opacity: 0, y: 10 })

    // Stagger characters up from below with overflow hidden
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power3.out',
    }, 0.3)

    // Counter 000 -> 100
    const counter = { val: 0 }
    tl.to(counter, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(counter.val)).padStart(3, '0')
        }
      },
    }, 0.5)

    // Fill progress line
    tl.to(fillRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
    }, 0.5)

    // Tagline fade in
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 1.0)

    // Brief hold before exit
    tl.to({}, { duration: 0.3 })

    return () => tl.kill()
  }, [onComplete])

  if (!visible) return null

  const name = 'HATIM ALSHEHRI'

  return (
    <div ref={wrapRef} style={styles.wrap}>
      {/* Ambient teal glow behind content */}
      <div style={styles.glow} />

      {/* Name with character stagger */}
      <div style={styles.nameRow}>
        {name.split('').map((ch, i) => (
          <span
            key={i}
            ref={el => (charsRef.current[i] = el)}
            style={{
              ...styles.char,
              ...(ch === ' ' ? { width: '0.3em' } : {}),
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>

      {/* Progress line */}
      <div style={styles.line}>
        <div ref={fillRef} style={styles.lineFill} />
      </div>

      {/* Counter */}
      <div ref={counterRef} style={styles.counter}>000</div>

      {/* Tagline */}
      <div ref={taglineRef} style={styles.tagline}>Building systems that ship</div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: '#060a0c',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '40vw',
    height: '40vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14,180,155,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  nameRow: {
    overflow: 'hidden',
    display: 'flex',
    gap: '0.04em',
    padding: '0.1em 0',
  },
  char: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'white',
    display: 'inline-block',
    lineHeight: 1,
    willChange: 'transform, opacity',
  },
  line: {
    width: '80px',
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    marginTop: '2rem',
    overflow: 'hidden',
    borderRadius: '1px',
  },
  lineFill: {
    height: '100%',
    width: '0%',
    background: 'linear-gradient(90deg, #065f50, #0eb49b, #2dd4b0)',
    borderRadius: '1px',
  },
  counter: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.15em',
    marginTop: '1.5rem',
  },
  tagline: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.12)',
    marginTop: '1.8rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontVariant: 'small-caps',
  },
}
