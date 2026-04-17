import { useState, useRef, useEffect, useCallback } from 'react'
import DheebChat from './DheebChat'
import './Dheeb.css'

/* ═══════════════════════════════════════════
   SPRITE SHEET CONFIG
   640x384, 10 cols x 6 rows, each frame 64x64
   ═══════════════════════════════════════════ */
const FRAME_W = 64
const FRAME_H = 64
const SHEET_W = 640
const SHEET_H = 384
const WOLF_VISUAL = 64 // 64 * 1.0 scale
const WOLF_W = WOLF_VISUAL
const WOLF_H = WOLF_VISUAL

/* Animation definitions: [row, frameCount, fps]
   Row 0: idle/standing
   Row 1: walk cycle
   Row 2: howl + sit sequence
   Row 3: attack/bite
   Row 4: crouch (incomplete)
   Row 5: lay down + sleep
*/
const ANIMS = {
  idle:    { row: 0, frames: 8,  fps: 6  },
  walk:    { row: 1, frames: 8,  fps: 10 },
  howl:    { row: 2, frames: 10, fps: 8  },
  attack:  { row: 3, frames: 7,  fps: 10 },
  laydown: { row: 5, frames: 4,  fps: 5  },
}

/* ─── Helper: random between min & max ─── */
const rand = (min, max) => min + Math.random() * (max - min)
const randInt = (min, max) => Math.floor(rand(min, max + 1))

/* ═══════════════════════════════════════════
   STATE MACHINE STATES
   ═══════════════════════════════════════════ */
const STATES = {
  IDLE: 'IDLE',
  WALK: 'WALK',
  SIT: 'SIT',
  HOWL: 'HOWL',
  LAY_DOWN: 'LAY_DOWN',
  RUN: 'RUN',
  JUMP: 'JUMP',
  FALL: 'FALL',
}

/* ─── Physics constants ─── */
const GRAVITY = 600
const JUMP_VY = -500
const WALK_SPEED = 60
const RUN_SPEED = 140
const JUMP_H_SPEED = 180

export default function Dheeb() {
  const [chatOpen, setChatOpen] = useState(false)
  const chatOpenRef = useRef(false)

  /* Refs to avoid re-renders during animation loop */
  const stateRef = useRef(STATES.FALL)
  const xRef = useRef(0)
  const yRef = useRef(0)
  const vyRef = useRef(0)
  const facingLeftRef = useRef(false)
  const frameRef = useRef(0)
  const animRef = useRef('walk')
  const stateTimerRef = useRef(0)
  const frameTimerRef = useRef(0)
  const breathRef = useRef(0)
  const targetXRef = useRef(0)
  const chatPositionRef = useRef({ x: 0, y: 0 })

  /* Platform tracking */
  const platformsRef = useRef([])
  const onPlatformRef = useRef(null)
  const jumpTargetRef = useRef(null)
  const jumpVyRef = useRef(JUMP_VY)
  const jumpHSpeedRef = useRef(JUMP_H_SPEED)
  const neighborMapRef = useRef(new Map())

  /* Landing bounce */
  const landBounceRef = useRef(0) // 0 = no bounce, >0 = bouncing

  /* For sit / laydown sequence tracking */
  const seqPhaseRef = useRef('in') // 'in', 'hold', 'out'
  const seqTimerRef = useRef(0)

  /* DOM refs */
  const wolfRef = useRef(null)
  const spriteRef = useRef(null)
  const shadowRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)

  /* Mouse tracking for hover direction */
  const mouseXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 400)
  const isHoveringRef = useRef(false)

  /* ─── Build neighbor graph from card positions (2D linked list) ─── */
  const buildNeighborMap = useCallback(() => {
    const plats = platformsRef.current
    const map = new Map()
    for (const p of plats) {
      const n = { left: null, right: null, up: null, down: null }
      const pCx = (p.left + p.right) / 2
      let bestR = Infinity, bestL = Infinity, bestU = Infinity, bestD = Infinity
      for (const q of plats) {
        if (q.el === p.el) continue
        const qCx = (q.left + q.right) / 2
        const hOverlap = Math.min(p.right, q.right) - Math.max(p.left, q.left)
        const vOverlap = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top)
        // RIGHT neighbor: center is to the right, must share the same row (real vertical overlap)
        if (qCx > pCx + 20 && vOverlap > 0) {
          const d = qCx - pCx
          if (d < bestR) { bestR = d; n.right = q }
        }
        // LEFT neighbor: same row requirement
        if (qCx < pCx - 20 && vOverlap > 0) {
          const d = pCx - qCx
          if (d < bestL) { bestL = d; n.left = q }
        }
        // DOWN neighbor: below, horizontally overlapping
        if (q.top > p.top + 20 && hOverlap > -20) {
          const d = q.top - p.bottom
          if (d >= -20 && d < bestD) { bestD = d; n.down = q }
        }
        // UP neighbor: above, horizontally overlapping
        if (q.top < p.top - 20 && hOverlap > -20) {
          const d = p.top - q.bottom
          if (d >= -20 && d < bestU) { bestU = d; n.up = q }
        }
      }
      map.set(p.el, n)
    }
    neighborMapRef.current = map
  }, [])

  /* ─── Scan all .card elements and build platforms array ─── */
  const updatePlatforms = useCallback(() => {
    const cards = document.querySelectorAll('.card')
    const plats = Array.from(cards).map((el) => {
      const rect = el.getBoundingClientRect()
      return {
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        el,
      }
    })
    plats.sort((a, b) => a.top - b.top)
    platformsRef.current = plats
    buildNeighborMap()
  }, [buildNeighborMap])

  /* ─── Find platform under a given x,y (wolf bottom) ─── */
  const findPlatformAt = useCallback((wx, wyBottom) => {
    for (const p of platformsRef.current) {
      if (wx >= p.left && wx <= p.right) {
        // Wolf bottom is at or just past platform top
        if (wyBottom >= p.top && wyBottom <= p.top + 30) {
          return p
        }
      }
    }
    return null
  }, [])

  /* ─── Pick walk target on current platform ─── */
  const pickTargetOnPlatform = useCallback(() => {
    const plat = onPlatformRef.current
    if (!plat) return
    const margin = 20
    const minDist = 40 // minimum walk distance so animation has time to play
    let target
    let attempts = 0
    do {
      target = rand(plat.left + margin, plat.right - margin)
      attempts++
    } while (Math.abs(target - xRef.current) < minDist && attempts < 10)
    // If platform is too small for a meaningful walk, just go to the opposite edge
    if (Math.abs(target - xRef.current) < minDist) {
      target = xRef.current < (plat.left + plat.right) / 2
        ? plat.right - margin
        : plat.left + margin
    }
    targetXRef.current = target
  }, [])

  /* ─── Transition to a new state ─── */
  const transitionTo = useCallback(
    (newState) => {
      stateRef.current = newState
      stateTimerRef.current = 0
      frameRef.current = 0
      frameTimerRef.current = 0
      seqPhaseRef.current = 'in'
      seqTimerRef.current = 0

      switch (newState) {
        case STATES.IDLE:
          animRef.current = 'idle'
          frameRef.current = 0
          stateTimerRef.current = rand(1, 2.5)
          break
        case STATES.WALK:
          animRef.current = 'walk'
          pickTargetOnPlatform()
          break
        case STATES.SIT:
          animRef.current = 'howl' // row 2 frames 0-4 = sit
          frameRef.current = 0
          break
        case STATES.HOWL:
          animRef.current = 'howl' // row 2 frames 5-9 = howl
          frameRef.current = 5
          break
        case STATES.LAY_DOWN:
          animRef.current = 'laydown'
          frameRef.current = 0
          break
        case STATES.RUN:
          animRef.current = 'walk'
          pickTargetOnPlatform()
          break
        case STATES.JUMP:
          animRef.current = 'walk'
          frameRef.current = 0
          vyRef.current = jumpVyRef.current
          onPlatformRef.current = null
          break
        case STATES.FALL:
          animRef.current = 'idle'
          frameRef.current = 0
          onPlatformRef.current = null
          break
        default:
          break
      }
    },
    [pickTargetOnPlatform]
  )

  /* ─── Pick next state randomly (called when wolf arrives at walk target) ─── */
  const pickNextState = useCallback(() => {
    const r = Math.random()
    if (r < 0.35) {
      // Idle briefly then walk again
      transitionTo(STATES.IDLE)
    } else if (r < 0.55) {
      transitionTo(STATES.SIT)
    } else if (r < 0.7) {
      transitionTo(STATES.HOWL)
    } else if (r < 0.85) {
      transitionTo(STATES.LAY_DOWN)
    } else {
      // Walk to new position on same card
      transitionTo(STATES.WALK)
    }
  }, [transitionTo])

  /* ─── Try to jump to a neighbor card ─── */
  /* direction: 'left', 'right', 'up', 'down', or 'any' */
  const tryJump = useCallback((direction = 'any') => {
    const plat = onPlatformRef.current
    if (!plat) return false

    const neighbors = neighborMapRef.current.get(plat.el)
    if (!neighbors) return false

    let target = null
    if (direction === 'any') {
      const available = ['left', 'right', 'up', 'down'].filter(d => neighbors[d])
      if (available.length === 0) return false
      target = neighbors[available[randInt(0, available.length - 1)]]
    } else if (direction === 'right') {
      // At right edge: try right first, then down
      target = neighbors.right || neighbors.down
    } else if (direction === 'left') {
      // At left edge: try left first, then down
      target = neighbors.left || neighbors.down
    } else {
      target = neighbors[direction]
    }

    if (!target) return false

    jumpTargetRef.current = target
    targetXRef.current = rand(target.left + 20, target.right - 20)

    // Dynamic jump velocity based on vertical distance
    const dy = target.top - plat.top
    if (dy < -20) {
      const heightNeeded = Math.abs(dy) + 80
      jumpVyRef.current = -Math.sqrt(2 * GRAVITY * heightNeeded)
      jumpVyRef.current = Math.max(jumpVyRef.current, -900)
    } else if (dy > 20) {
      jumpVyRef.current = -Math.min(280, 180 + dy * 0.2)
    } else {
      jumpVyRef.current = JUMP_VY
    }

    const dx = Math.abs(targetXRef.current - xRef.current)
    jumpHSpeedRef.current = Math.min(Math.max(dx / 1.2, JUMP_H_SPEED), 400)

    transitionTo(STATES.JUMP)
    return true
  }, [transitionTo])

  /* ─── Check if wolf is at platform edge ─── */
  const atPlatformEdge = useCallback((dir) => {
    const plat = onPlatformRef.current
    if (!plat) return false
    if (dir > 0) return xRef.current >= plat.right - 10
    return xRef.current <= plat.left + 10
  }, [])

  /* ─── Land on platform ─── */
  const landOnPlatform = useCallback((plat) => {
    onPlatformRef.current = plat
    yRef.current = plat.top - WOLF_H
    vyRef.current = 0
    landBounceRef.current = 0.2 // start bounce timer
    jumpTargetRef.current = null
  }, [])

  /* ─── Main animation loop ─── */
  const tick = useCallback(
    (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      const state = stateRef.current
      const anim = ANIMS[animRef.current]

      // Freeze when chat is open
      if (chatOpenRef.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      /* ─── Update sprite frame timer ─── */
      frameTimerRef.current -= dt
      let advanceFrame = false
      if (frameTimerRef.current <= 0) {
        frameTimerRef.current = 1 / anim.fps + rand(-0.01, 0.01)
        advanceFrame = true
      }

      /* ─── Landing bounce decay ─── */
      if (landBounceRef.current > 0) {
        landBounceRef.current -= dt
        if (landBounceRef.current < 0) landBounceRef.current = 0
      }

      /* ─── Snap to platform if on one (platform positions may shift) ─── */
      if (onPlatformRef.current && state !== STATES.JUMP && state !== STATES.FALL) {
        const plat = onPlatformRef.current
        yRef.current = plat.top - WOLF_H
        // Check if we walked off
        if (xRef.current < plat.left - 5 || xRef.current > plat.right + 5) {
          transitionTo(STATES.FALL)
        }
      }

      /* ─── State-specific logic ─── */
      switch (state) {
        case STATES.IDLE: {
          breathRef.current += dt * 2.5
          if (animRef.current !== 'idle') {
            animRef.current = 'idle'
            frameRef.current = 0
          }
          stateTimerRef.current -= dt
          if (stateTimerRef.current <= 0) {
            // Always walk next after idle (no more random from idle)
            transitionTo(STATES.WALK)
          }
          break
        }

        case STATES.WALK: {
          // Advance walk frame
          if (advanceFrame) {
            frameRef.current = (frameRef.current + 1) % anim.frames
          }

          const target = targetXRef.current
          const diff = target - xRef.current

          // Move toward target
          const dir = diff > 0 ? 1 : -1
          if (!isHoveringRef.current) {
            facingLeftRef.current = dir < 0
          }
          xRef.current += dir * WALK_SPEED * dt

          // Clamp to platform
          if (onPlatformRef.current) {
            xRef.current = Math.max(
              onPlatformRef.current.left + 5,
              Math.min(onPlatformRef.current.right - 5, xRef.current)
            )
          }

          // At platform edge? Jump sideways, down, or up
          if (onPlatformRef.current) {
            const plat = onPlatformRef.current
            const atLeftEdge = xRef.current <= plat.left + 10
            const atRightEdge = xRef.current >= plat.right - 10
            if (atLeftEdge || atRightEdge) {
              const neighbors = neighborMapRef.current.get(plat.el)
              const r = Math.random()
              let jumped = false
              // 25% down, 15% up, 60% sideways
              if (r < 0.25 && neighbors?.down) {
                jumped = tryJump('down')
              } else if (r < 0.40 && neighbors?.up) {
                jumped = tryJump('up')
              }
              if (!jumped) {
                const jumpDir = atRightEdge ? 'right' : 'left'
                if (!tryJump(jumpDir)) {
                  facingLeftRef.current = !facingLeftRef.current
                  targetXRef.current = facingLeftRef.current
                    ? plat.left + 20
                    : plat.right - 20
                }
              }
              break
            }
          }

          // Arrived at target? Maybe jump to another card, otherwise pick next action
          if (Math.abs(diff) < 8) {
            if (Math.random() < 0.2 && tryJump('any')) {
              break
            }
            pickNextState()
          }

          breathRef.current = 0
          break
        }

        case STATES.RUN: {
          if (advanceFrame) {
            frameRef.current = (frameRef.current + 1) % anim.frames
          }
          const target = targetXRef.current
          const diff = target - xRef.current
          if (Math.abs(diff) < 8) {
            // At edge? Jump!
            if (onPlatformRef.current) {
              const dir = diff > 0 ? 1 : -1
              if (atPlatformEdge(dir)) {
                if (!tryJump('any')) {
                  transitionTo(STATES.IDLE)
                }
                break
              }
            }
            transitionTo(STATES.IDLE)
          } else {
            const dir = diff > 0 ? 1 : -1
            if (!isHoveringRef.current) {
              facingLeftRef.current = dir < 0
            }
            xRef.current += dir * RUN_SPEED * dt
            if (onPlatformRef.current) {
              xRef.current = Math.max(onPlatformRef.current.left + 5, Math.min(onPlatformRef.current.right - 5, xRef.current))
            }
          }
          breathRef.current = 0
          break
        }

        case STATES.JUMP: {
          // Apply gravity
          vyRef.current += GRAVITY * dt
          yRef.current += vyRef.current * dt

          // Move horizontally toward target
          const hDiff = targetXRef.current - xRef.current
          if (Math.abs(hDiff) > 2) {
            const dir = hDiff > 0 ? 1 : -1
            facingLeftRef.current = dir < 0
            xRef.current += dir * jumpHSpeedRef.current * dt
          }

          if (advanceFrame) {
            frameRef.current = (frameRef.current + 1) % anim.frames
          }

          // Check landing — only on TARGET platform (prevents accidental mid-arc landing)
          if (vyRef.current > 0 && jumpTargetRef.current) {
            const wolfBottom = yRef.current + WOLF_H
            const t = jumpTargetRef.current
            if (
              xRef.current >= t.left - 10 &&
              xRef.current <= t.right + 10 &&
              wolfBottom >= t.top &&
              wolfBottom <= t.top + vyRef.current * dt + 20
            ) {
              landOnPlatform(t)
              transitionTo(STATES.IDLE)
              break
            }
            // Missed target — fell too far past it, switch to FALL to catch any platform
            if (yRef.current + WOLF_H > t.top + 100) {
              transitionTo(STATES.FALL)
              break
            }
          }

          // Fell off the page? Reset to top platform
          if (yRef.current > (document.documentElement.scrollHeight || 5000) + 200) {
            const plats = platformsRef.current
            if (plats.length > 0) {
              const top = plats[0]
              xRef.current = (top.left + top.right) / 2
              yRef.current = top.top - WOLF_H - 100
              vyRef.current = 0
              transitionTo(STATES.FALL)
            }
          }

          breathRef.current = 0
          break
        }

        case STATES.FALL: {
          // Apply gravity
          vyRef.current += GRAVITY * dt
          yRef.current += vyRef.current * dt

          if (advanceFrame) {
            frameRef.current = (frameRef.current + 1) % anim.frames
          }

          // Check landing
          const wolfBottom = yRef.current + WOLF_H
          for (const p of platformsRef.current) {
            if (
              xRef.current >= p.left - 10 &&
              xRef.current <= p.right + 10 &&
              wolfBottom >= p.top &&
              wolfBottom <= p.top + vyRef.current * dt + 20
            ) {
              landOnPlatform(p)
              transitionTo(STATES.IDLE)
              break
            }
          }

          // Fell off page? Reset
          if (yRef.current > (document.documentElement.scrollHeight || 5000) + 200) {
            const plats = platformsRef.current
            if (plats.length > 0) {
              const top = plats[0]
              xRef.current = (top.left + top.right) / 2
              yRef.current = top.top - WOLF_H - 100
              vyRef.current = 0
            }
          }

          breathRef.current = 0
          break
        }

        case STATES.SIT: {
          const phase = seqPhaseRef.current
          if (phase === 'in') {
            if (advanceFrame) {
              if (frameRef.current < 4) {
                frameRef.current++
              } else {
                seqPhaseRef.current = 'hold'
                seqTimerRef.current = rand(4, 6)
              }
            }
          } else if (phase === 'hold') {
            frameRef.current = 4
            seqTimerRef.current -= dt
            if (seqTimerRef.current <= 0) {
              seqPhaseRef.current = 'out'
            }
          } else if (phase === 'out') {
            if (advanceFrame) {
              if (frameRef.current > 0) {
                frameRef.current--
              } else {
                transitionTo(STATES.WALK)
              }
            }
          }
          breathRef.current = 0
          break
        }

        case STATES.HOWL: {
          if (advanceFrame) {
            if (frameRef.current < 9) {
              frameRef.current++
            } else {
              transitionTo(STATES.IDLE)
            }
          }
          breathRef.current = 0
          break
        }

        case STATES.LAY_DOWN: {
          const phase = seqPhaseRef.current
          if (phase === 'in') {
            if (advanceFrame) {
              if (frameRef.current < anim.frames - 1) {
                frameRef.current++
              } else {
                seqPhaseRef.current = 'hold'
                seqTimerRef.current = rand(5, 8)
              }
            }
          } else if (phase === 'hold') {
            frameRef.current = anim.frames - 1
            seqTimerRef.current -= dt
            if (seqTimerRef.current <= 0) {
              seqPhaseRef.current = 'out'
            }
          } else if (phase === 'out') {
            if (advanceFrame) {
              if (frameRef.current > 0) {
                frameRef.current--
              } else {
                transitionTo(STATES.WALK)
              }
            }
          }
          breathRef.current = 0
          break
        }

        default:
          break
      }

      /* ─── Hover: face toward mouse ─── */
      if (isHoveringRef.current) {
        facingLeftRef.current = mouseXRef.current < xRef.current
      }

      /* ─── Landing bounce squash/stretch ─── */
      let bounceScaleX = 1
      let bounceScaleY = 1
      if (landBounceRef.current > 0) {
        const t = landBounceRef.current / 0.2 // normalized 1→0
        const squash = Math.sin(t * Math.PI) * 0.15
        bounceScaleX = 1 + squash
        bounceScaleY = 1 - squash
      }

      /* ─── Apply to DOM directly (no React re-render) ─── */
      if (wolfRef.current) {
        const breathY = state === STATES.IDLE ? Math.sin(breathRef.current) * 1.5 : 0
        wolfRef.current.style.left = `${xRef.current - WOLF_W / 2}px`
        wolfRef.current.style.top = `${yRef.current + breathY}px`
      }

      if (spriteRef.current) {
        const row = ANIMS[animRef.current].row
        const col = frameRef.current
        const bgX = -(col * FRAME_W)
        const bgY = -(row * FRAME_H)
        spriteRef.current.style.backgroundImage = `url('/sprites/wolf.png')`
        spriteRef.current.style.backgroundPosition = `${bgX}px ${bgY}px`
        spriteRef.current.style.backgroundSize = `${SHEET_W}px ${SHEET_H}px`

        const scaleX = facingLeftRef.current ? -1 : 1
        spriteRef.current.style.transform = `scale(${scaleX * bounceScaleX}, ${1 * bounceScaleY})`
      }

      /* ─── Shadow: wider when higher off ground, smaller when on ground ─── */
      if (shadowRef.current) {
        const plat = onPlatformRef.current
        if (plat) {
          shadowRef.current.style.opacity = '1'
          shadowRef.current.style.width = '32px'
        } else {
          // In air — find closest platform below to estimate height
          let closestBelow = null
          let minDist = Infinity
          for (const p of platformsRef.current) {
            if (xRef.current >= p.left && xRef.current <= p.right && p.top > yRef.current + WOLF_H) {
              const d = p.top - (yRef.current + WOLF_H)
              if (d < minDist) {
                minDist = d
                closestBelow = p
              }
            }
          }
          if (closestBelow) {
            const heightRatio = Math.min(minDist / 300, 1)
            shadowRef.current.style.opacity = `${1 - heightRatio * 0.7}`
            shadowRef.current.style.width = `${32 + heightRatio * 16}px`
          } else {
            shadowRef.current.style.opacity = '0.3'
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    },
    [pickNextState, transitionTo, tryJump, atPlatformEdge, landOnPlatform]
  )

  /* ─── Start / stop animation loop ─── */
  useEffect(() => {
    /* Delay initial spawn — wait for cards to finish entrance animations */
    const spawnDelay = setTimeout(() => {
      updatePlatforms()

      const plats = platformsRef.current
      if (plats.length > 0) {
        const first = plats[0]
        xRef.current = (first.left + first.right) / 2
        yRef.current = first.top - WOLF_H - 220 // start above the card
        vyRef.current = 0
        onPlatformRef.current = null
        transitionTo(STATES.FALL) // gravity will drop him onto the first card
      } else {
        xRef.current = window.innerWidth / 2
        yRef.current = 0
        vyRef.current = 0
        transitionTo(STATES.FALL)
      }

      // Fade in once positioned (next frame, so the position is applied first)
      requestAnimationFrame(() => {
        if (wolfRef.current) wolfRef.current.style.opacity = '1'
      })

      rafRef.current = requestAnimationFrame(tick)
    }, 1500)

    /* Recalculate platforms on resize */
    const onResize = () => {
      updatePlatforms()
      if (onPlatformRef.current) {
        const el = onPlatformRef.current.el
        const rect = el.getBoundingClientRect()
        const newPlat = {
          left: rect.left + window.scrollX,
          right: rect.right + window.scrollX,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          el,
        }
        onPlatformRef.current = newPlat
        yRef.current = newPlat.top - WOLF_H
        xRef.current = Math.max(newPlat.left + 10, Math.min(newPlat.right - 10, xRef.current))
      }
    }

    /* Periodic platform refresh */
    const platformInterval = setInterval(updatePlatforms, 2000)

    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      clearTimeout(spawnDelay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      clearInterval(platformInterval)
    }
  }, [tick, transitionTo, updatePlatforms])

  /* ─── Track mouse position ─── */
  useEffect(() => {
    const onMove = (e) => {
      mouseXRef.current = e.clientX
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ─── Click handler ─── */
  const handleWolfClick = useCallback(() => {
    chatPositionRef.current = { x: xRef.current, y: yRef.current }
    /* Trigger howl animation */
    stateRef.current = STATES.HOWL
    animRef.current = 'howl'
    frameRef.current = 5
    frameTimerRef.current = 0
    seqPhaseRef.current = 'in'
    setChatOpen(true)
    chatOpenRef.current = true
  }, [])

  const handleCloseChat = useCallback(() => {
    setChatOpen(false)
    chatOpenRef.current = false
  }, [])

  /* ─── Hover handlers ─── */
  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  return (
    <div className="dheeb">
      <div
        ref={wolfRef}
        className="dheeb-wolf"
        onClick={handleWolfClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={spriteRef} className="dheeb-sprite" />
        <div ref={shadowRef} className="dheeb-shadow" />
      </div>

      {chatOpen && (
        <>
          <div className="dheeb-overlay" onClick={handleCloseChat} />
          <DheebChat onClose={handleCloseChat} chatPosition={chatPositionRef.current.x} />
        </>
      )}
    </div>
  )
}
