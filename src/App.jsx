import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Loader from './components/Loader'
import CursorGlow from './components/CursorGlow'
import Card, { Label, Pill } from './components/Card'
import Dheeb from './components/Dheeb'

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
  { name: 'Phaser', icon: null },
  { name: 'vLLM', icon: null },
  { name: 'Llama', icon: 'meta' },
  { name: 'Gemini', icon: 'googlegemini' },
  { name: 'LangGraph', icon: null },
  { name: 'pgvector', icon: null },
  { name: 'Qdrant', icon: null },
  { name: 'spaCy', icon: 'spacy' },
  { name: 'scikit-learn', icon: 'scikitlearn' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Cloudflare', icon: 'cloudflare' },
  { name: 'Nginx', icon: 'nginx' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Redis', icon: 'redis' },
  { name: 'RabbitMQ', icon: 'rabbitmq' },
  { name: 'MinIO', icon: null },
  { name: 'Vault', icon: 'vault' },
  { name: 'mTLS', icon: null },
  { name: 'Go', icon: 'go' },
  { name: 'Python', icon: 'python' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'C# / .NET', icon: 'dotnet' },
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
          {/* Scroll progress (CSS scroll-driven animation) */}
          <div className="scroll-progress" />

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
                className="card-hero span-4 flex-col"
                delay={0}
              >
                <h1 className="hero-name">Hatim Alshehri</h1>
                <p className="sub" style={{ marginTop: '1.2rem', maxWidth: 380, lineHeight: 1.6 }}>
                  Saudi product engineer building distributed systems for regulated industries, and the agent teams that ship them faster.
                </p>
                <div className="btns mt-lg">
                  <a href="mailto:hatimalshehri.official@outlook.sa" className="btn primary">
                    Say Hello &rarr;
                  </a>
                  <a href="https://github.com/taurusn" target="_blank" rel="noopener noreferrer" className="btn">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/hatim-alshehri-cs" target="_blank" rel="noopener noreferrer" className="btn">
                    LinkedIn
                  </a>
                  <a href="/Hatim_Alshehri_CV.pdf" target="_blank" rel="noopener noreferrer" className="btn">
                    Resume
                  </a>
                </div>
              </Card>

              {/* ═══════════════════════════════════════════
                  CURRENTLY — Role + Background combined (span-2)
                  ═══════════════════════════════════════════ */}
              <Card className="span-2 flex-col justify-between" delay={0.08}>
                <div>
                  <Label>Currently</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.7rem' }}>
                    <img src="/logos/innosoft.png" alt="" className="card-logo" />
                    <div>
                      <h3 className="heading" style={{ fontSize: '1.15rem' }}>Product Owner</h3>
                      <p className="sub mt-xs">Innosoft SA &middot; Dec 2025 &ndash; Present</p>
                    </div>
                  </div>
                </div>
                <p className="mono-sm" style={{ marginTop: '1.2rem', letterSpacing: '0.1em' }}>
                  ASIR-BORN &middot; DAMMAM-BASED &middot; AR + EN
                </p>
              </Card>

              {/* ═══════════════════════════════════════════
                  RESEARCH (was Education)
                  ═══════════════════════════════════════════ */}
              <Card className="span-2" delay={0.16}>
                <Label>Research</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.6rem' }}>
                  <img src="/logos/iau.png" alt="" className="card-logo" />
                  <div>
                    <h3 className="heading" style={{ fontSize: '1.05rem' }}>Privacy-Preserving Data Anonymization</h3>
                    <p className="sub mt-xs">Under Dr. Muawia Abdelmagid Elsadig &middot; IAU</p>
                  </div>
                </div>
                <p className="mono-sm mt-xs">B.Sc. Computer Science &middot; Second Honor &middot; Expected Jun 2026</p>
              </Card>

              {/* ═══════════════════════════════════════════
                  PROJECTS SECTION
                  ═══════════════════════════════════════════ */}
              <motion.div className="section-label" {...fade()}>
                <Label>The work</Label>
              </motion.div>

              {/* Nurliya — compressed to span-2 */}
              <Card className="span-2" glow="teal" delay={0}>
                <div className="flex-between" style={{ marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                  <span className="num-display num-teal">01</span>
                  <a href="https://github.com/taurusn/Nurliya" target="_blank" rel="noopener noreferrer" className="arrow-link" style={{ marginTop: '0.5rem' }}>
                    &#8599; Source
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="proj-logo-text">ن</span>
                  <h3 className="heading" style={{ fontSize: '1.3rem' }}>Nurliya</h3>
                </div>
                <p className="sub mt-xs">Review Intelligence Platform</p>
                <p className="body-sm mt-md">
                  Give it a Google Maps link and it scrapes every review, discovers what
                  customers talk about, classifies sentiment in Arabic dialect, and surfaces
                  what's going wrong across all branches, against competitors.
                </p>
                <div className="pills mt-md">
                  {['FastAPI', 'Next.js', 'Qdrant', 'Gemini', 'Go', 'HDBSCAN', 'MiniLM'].map(t => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Card>

              {/* SEET */}
              <Card className="span-2" glow="emerald" delay={0.06}>
                <div className="flex-between" style={{ marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                  <span className="num-display num-emerald">02</span>
                  <a href="https://github.com/taurusn/SEET" target="_blank" rel="noopener noreferrer" className="arrow-link" style={{ marginTop: '0.5rem' }}>
                    &#8599; Source
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/logos/seet.svg" alt="" className="proj-logo" />
                  <h3 className="heading" style={{ fontSize: '1.3rem' }}>SEET</h3>
                </div>
                <p className="sub mt-xs">Multi-Tenant Messaging Platform</p>
                <p className="body-sm mt-md">
                  Onboard a coffee shop, connect their socials, and the platform handles customer
                  conversations 24/7 in Najdi dialect. Includes sentiment tracking, automatic
                  handoff to humans when needed, digital vouchers, and white-label branding per tenant.
                </p>
                <div className="pills mt-md">
                  {['FastAPI', 'Next.js', 'Gemini 2.0', 'Docker', 'PostgreSQL'].map(t => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Card>

              {/* SADN — promoted to full-width hero */}
              <Card className="span-4" glow="teal" delay={0.08}>
                <div className="proj-split">
                  <div>
                    <div className="flex-between" style={{ marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                      <span className="num-display num-teal">03</span>
                      <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                        <a href="https://sadn.site" target="_blank" rel="noopener noreferrer" className="arrow-link">
                          &#8599; Visit
                        </a>
                        <a href="https://paper.sadn.site" target="_blank" rel="noopener noreferrer" className="arrow-link">
                          &#8599; Paper
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src="/logos/sadnxai.svg" alt="" className="proj-logo" />
                      <h3 className="heading" style={{ fontSize: '1.3rem' }}>
                        SADN
                      </h3>
                    </div>
                    <p className="sub mt-xs">The research, shipped. CS 511 Capstone.</p>
                    <p className="body-editorial mt-md">
                      A nine-service distributed system that anonymizes sensitive datasets at scale
                      per Saudi regulations (PDPL, SDAIA, NCA, NDMO, MOH). Five transformation
                      modules (generalization, pseudonymization, date shifting, suppression, NER
                      redaction) coordinated through an event-driven RabbitMQ pipeline. An
                      agentic classifier and validator (a Counsel agent on hybrid pgvector + BM25
                      retrieval across Saudi regulator PDFs) labels each column's privacy class,
                      then verifies the masked output against k / l / t thresholds, with
                      deterministic rules holding veto so every verdict cites a specific article.
                      <strong>LLM-agnostic</strong>, targeting local on-prem inference for PDPL
                      sovereignty. Cross-institutional sharing happens under enforced Data Use
                      Agreements via mTLS federation.
                    </p>
                  </div>
                  <div>
                    <div className="pills">
                      {['C# / .NET 8', 'FastAPI', 'RabbitMQ', 'PostgreSQL', 'MinIO', 'Vault', 'pgvector', 'BM25', 'mTLS', 'Docker'].map(t => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                    <div className="stats-grid">
                      <div>
                        <div className="stat-val" style={{ color: 'var(--teal)' }}>9</div>
                        <div className="stat-label">microservices shipped</div>
                      </div>
                      <div>
                        <div className="stat-val" style={{ color: 'var(--teal)' }}>5</div>
                        <div className="stat-label">transformation modules</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ═══════════════════════════════════════════
                  PRODUCT CREW — meta-tool, full width
                  ═══════════════════════════════════════════ */}
              <Card className="span-4" delay={0.1}>
                <div className="proj-split">
                  <div>
                    <div className="flex-between" style={{ marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                      <span className="num-display num-teal">04</span>
                      <span className="arrow-link" style={{ cursor: 'default', opacity: 0.7, marginTop: '0.5rem' }}>
                        Deployed in SADN &uarr;
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src="/logos/sonar.svg" alt="" className="proj-logo" />
                      <h3 className="heading" style={{ fontSize: '1.3rem' }}>
                        Product Crew
                      </h3>
                    </div>
                    <p className="sub mt-xs">The agent teams. Six specialists that ship products like SADN.</p>
                    <p className="body-sm mt-md">
                      Six specialized agent roles. Atlas leads, the rest own frontend, backend,
                      QA, design, and docs. They share context through a memory system, coordinate
                      through a protocol I wrote, and surface progress in <strong>Sonar</strong>,
                      a real-time mission control dashboard. The template I cloned into SADN to
                      ship it faster.
                    </p>
                  </div>
                  <div>
                    <div className="pills">
                      {['Atlas', 'Pixel', 'Core', 'Break', 'Eye', 'Ink', 'Sonar Dashboard', 'Memory System', 'Cost Tracking'].map(t => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                    <div className="stats-grid">
                      <div>
                        <div className="stat-val" style={{ color: 'var(--teal)' }}>6</div>
                        <div className="stat-label">specialized roles</div>
                      </div>
                      <div>
                        <div className="stat-val" style={{ color: 'var(--teal)' }}>1</div>
                        <div className="stat-label">in production · SADN</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ═══════════════════════════════════════════
                  THROUGHLINE — editorial interlude
                  ═══════════════════════════════════════════ */}
              <motion.div className="span-4 throughline" {...fade()}>
                <span className="throughline-mark">//</span>
                <p>
                  I tend to build for places where data sovereignty, Arabic dialect, and Saudi
                  regulation are the constraints, not the asterisks.
                </p>
              </motion.div>

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
                <div className="footer-rule" />
                <div className="footer-grid">
                  <div className="footer-col">
                    <p className="footer-mark">hatim-shehri.com</p>
                    <p className="footer-meta">Dammam &middot; Saudi Arabia</p>
                  </div>
                  <div className="footer-col footer-end">
                    <p className="footer-meta">
                      Want to build something? <a href="mailto:hatimalshehri.official@outlook.sa" className="footer-link">hatimalshehri.official@outlook.sa</a>
                    </p>
                    <p className="footer-meta">Built by hand &middot; React, GSAP, pure CSS</p>
                    <p className="footer-meta">No analytics &middot; No tracking &middot; No templates</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </main>
          <Dheeb />
        </motion.div>
      )}
    </>
  )
}
