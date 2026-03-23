import { motion } from 'framer-motion'

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
}

export default function Card({
  children,
  className = '',
  delay = 0,
  glow,
  style,
  ...props
}) {
  const glowClass = glow ? `glow-${glow}` : ''

  return (
    <motion.div
      className={`card ${glowClass} ${className}`.trim()}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function Label({ children, className = '' }) {
  return (
    <span className={`label ${className}`.trim()}>
      {children}
    </span>
  )
}

export function Pill({ children }) {
  return <span className="pill">{children}</span>
}
