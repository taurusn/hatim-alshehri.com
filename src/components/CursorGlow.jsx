import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const [isTouch, setIsTouch] = useState(false)

  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(hasTouch)

    if (hasTouch) return

    const handleMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  if (isTouch) return null

  return (
    <motion.div
      className="cursor-glow"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  )
}
