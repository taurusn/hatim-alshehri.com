import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Loader from './components/Loader'
import CursorGlow from './components/CursorGlow'
import Card, { Label, Pill } from './components/Card'

/* ─── Shared animation helper for non-Card motion elements ─── */
const fade = (d = 0) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
})

/* ─── Data ─── */
const allTechs = [
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'NestJS', icon: 'nestjs' },
  { name: 'Django', icon: 'django' },
  { name: 'Flask', icon: 'flask' },
  { name: 'Express', icon: 'express' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'Vite', icon: 'vite' },
  { name: 'Phaser', icon: 'phaserframework' },
  { name: 'vLLM', icon: null },
  { name: 'Llama', icon: 'meta' },
  { name: 'Gemini', icon: 'googlegemini' },
  { name: 'Qdrant', icon: null },
  { name: 'spaCy', icon: 'spacy' },
  { name: 'scikit-learn', icon: 'scikitlearn' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Cloudflare', icon: 'cloudflare' },
  { name: 'Nginx', icon: 'nginx' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Redis', icon: 'redis' },
  { name: 'RabbitMQ', icon: 'rabbitmq' },
  { name: 'Go', icon: 'go' },
  { name: 'Python', icon: 'python' },
  { name: 'TypeScript', icon: 'typescript' },
]

const nurliyaPills = [
  'FastAPI', 'Next.js', 'Qdrant', 'RabbitMQ', 'Go',
  'Gemini', 'Redis', 'MinIO', 'Cloudflare', 'HDBSCAN', 'MiniLM',
]

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  return (
    <>
      <Loader onComplete={done} />

      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background depth layers */}
          <div className="bg-depth">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="vignette" />
          </div>

          {/* Cursor glow */}
          <CursorGlow />

          <main className="page">
            <div className="grid">

              {/* ═══════════════════════════════════════════
                  HERO — span 2 cols, 2 rows
                  ═══════════════════════════════════════════ */}
              <Card
                className="card-hero anim-border span-2r flex-col justify-between"
                style={{ minHeight: 340 }}
                delay={0}
              >
                <div>
                  <h1 className="hero-name">Hatim<br />Alshehri</h1>
                  <p className="sub" style={{ marginTop: '1.2rem', maxWidth: 360, lineHeight: 1.6 }}>
                    I design and ship production systems — from architecture and ML pipelines to frontend and infrastructure.
                  </p>
                </div>
                <div className="btns mt-lg">
                  <a href="https://github.com/taurusn" target="_blank" rel="noopener noreferrer" className="btn">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/hatim-alshehri-cs" target="_blank" rel="noopener noreferrer" className="btn">
                    LinkedIn
                  </a>
                  <a href="/Hatim_Alshehri_CV.pdf" target="_blank" rel="noopener noreferrer" className="btn">
                    Resume
                  </a>
                  <a href="mailto:hatimalshehri.official@outlook.sa" className="btn primary">
                    Say Hello &rarr;
                  </a>
                </div>
              </Card>

              {/* ═══════════════════════════════════════════
                  ROLE
                  ═══════════════════════════════════════════ */}
              <Card className="flex-col justify-between" delay={0.08}>
                <div>
                  <Label>Current Role</Label>
                  <h3 className="heading mt-sm" style={{ fontSize: '1.15rem' }}>Product Owner</h3>
                  <p className="sub mt-xs">Innosoft SA</p>
                </div>
                <span className="mono-sm" style={{ marginTop: '1rem' }}>Dec 2025 — Present</span>
              </Card>

              {/* ═══════════════════════════════════════════
                  LOCATION
                  ═══════════════════════════════════════════ */}
              <Card className="flex-col" delay={0.12}>
                <Label>Based In</Label>
                <h3 className="heading mt-sm" style={{ fontSize: '1.15rem' }}>Dammam</h3>
                <p className="sub mt-xs">Saudi Arabia</p>
              </Card>

              {/* ═══════════════════════════════════════════
                  EDUCATION
                  ═══════════════════════════════════════════ */}
              <Card className="span-2" delay={0.16}>
                <Label>Education</Label>
                <h3 className="heading mt-sm" style={{ fontSize: '1.05rem' }}>B.Sc. Computer Science</h3>
                <p className="sub mt-xs">Imam Abdulrahman Bin Faisal University — Second Honor</p>
                <p className="mono-sm mt-xs">Expected Jun 2026 &middot; Research: Dr. Muawia Abdelmagid Elsadig</p>
              </Card>

              {/* ═══════════════════════════════════════════
                  PROJECTS SECTION
                  ═══════════════════════════════════════════ */}
              <motion.div className="section-label" {...fade()}>
                <Label>Projects</Label>
              </motion.div>

              {/* SADNxAI */}
              <Card className="span-2 anim-border" glow="teal" delay={0}>
                <div className="flex-between" style={{ marginBottom: '0.8rem' }}>
                  <span className="num num-teal">01</span>
                  <a href="https://github.com/taurusn/SADNxAI" target="_blank" rel="noopener noreferrer" className="arrow-link">
                    &#8599; Source
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/logos/sadnxai.png" alt="" className="proj-logo" />
                  <h3 className="heading" style={{ fontSize: '1.3rem' }}>SADNxAI</h3>
                </div>
                <p className="sub mt-xs">Data Anonymization Platform</p>
                <p className="body-sm mt-md">
                  Walks users through anonymizing Saudi banking datasets via conversational interface.
                  A local LLM classifies columns, recommends masking strategies, validates privacy metrics,
                  and generates compliance reports — all aligned with PDPL and SAMA regulations.
                </p>
                <div className="pills mt-md">
                  {['FastAPI', 'Next.js', 'vLLM', 'Llama 3.1', 'PostgreSQL', 'Redis', 'WebSocket'].map(t => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Card>

              {/* SEET */}
              <Card className="span-2" glow="emerald" delay={0.06}>
                <div className="flex-between" style={{ marginBottom: '0.8rem' }}>
                  <span className="num num-emerald">02</span>
                  <a href="https://github.com/taurusn/SEET" target="_blank" rel="noopener noreferrer" className="arrow-link">
                    &#8599; Source
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/logos/seet.png" alt="" className="proj-logo" />
                  <h3 className="heading" style={{ fontSize: '1.3rem' }}>SEET</h3>
                </div>
                <p className="sub mt-xs">Multi-Tenant Messaging Platform</p>
                <p className="body-sm mt-md">
                  Onboard a coffee shop, connect their socials, and the platform handles customer
                  conversations 24/7 — in Najdi dialect. Includes sentiment tracking, automatic
                  handoff to humans when needed, digital vouchers, and white-label branding per tenant.
                </p>
                <div className="pills mt-md">
                  {['FastAPI', 'Next.js', 'Gemini 2.0', 'Docker', 'PostgreSQL'].map(t => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Card>

              {/* Nurliya — full width */}
              <Card className="span-4" glow="rose" delay={0.08}>
                <div className="proj-split">
                  <div>
                    <div className="flex-between" style={{ marginBottom: '0.8rem' }}>
                      <span className="num num-rose">03</span>
                      <a href="https://github.com/taurusn/Nurliya" target="_blank" rel="noopener noreferrer" className="arrow-link">
                        &#8599; Source
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="proj-logo-text">ن</span>
                      <h3 className="heading" style={{ fontSize: '1.3rem' }}>
                        Nurliya
                      </h3>
                    </div>
                    <p className="sub mt-xs">Review Intelligence Platform</p>
                    <p className="body-sm mt-md">
                      Give it a Google Maps link and it scrapes every review, discovers
                      what customers talk about, classifies sentiment in Arabic dialect, and
                      surfaces what's going wrong — across all branches, against competitors.
                    </p>
                  </div>
                  <div>
                    <div className="pills">
                      {nurliyaPills.map(t => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                    <div className="stats-grid">
                      <div>
                        <div className="stat-val" style={{ color: 'var(--rose)' }}>120+</div>
                        <div className="stat-label">places/min scraped</div>
                      </div>
                      <div>
                        <div className="stat-val" style={{ color: 'var(--rose)' }}>12</div>
                        <div className="stat-label">microservices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ═══════════════════════════════════════════
                  STACK — Infinite scrolling marquee
                  ═══════════════════════════════════════════ */}
              <motion.div className="section-label" {...fade()}>
                <Label>Stack</Label>
              </motion.div>

              <motion.div className="span-4" {...fade()}>
                <div className="marquee-wrap">
                  <div className="marquee-track">
                    {[...allTechs, ...allTechs].map((t, i) => (
                      <span key={i} className="marquee-item">
                        {t.icon && (
                          <img
                            src={`https://cdn.simpleicons.org/${t.icon}/999999`}
                            alt=""
                            className="marquee-icon"
                            loading="lazy"
                          />
                        )}
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════
                  FOOTER
                  ═══════════════════════════════════════════ */}
              <motion.div className="footer" {...fade()}>
                <p>hatim-alshehri.com</p>
              </motion.div>

            </div>
          </main>
        </motion.div>
      )}
    </>
  )
}
