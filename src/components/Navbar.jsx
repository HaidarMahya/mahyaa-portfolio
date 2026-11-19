import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Magnetic } from './ui'
import { nav } from '../data'

const notes = { Home: 'Start here', About: 'Who I am', Skills: 'What I love', Projects: 'Things I made', Contact: "Let's connect" }
const ids = { Home: 'home', Projects: 'archive' } // everything else: lowercase name
const idOf = (n) => ids[n] ?? n.toLowerCase()

// The bar follows the colour of whatever section is under it (each <section> declares data-nav).
const tones = {
  light: { bar: 'bg-cream/80 text-ink backdrop-blur', line: 'border-ink', btn: 'bg-ink', dot: 'bg-cream', prog: 'bg-ink' },
  sun: { bar: 'bg-sun/85 text-ink backdrop-blur', line: 'border-ink', btn: 'bg-ink', dot: 'bg-sun', prog: 'bg-ink' },
  dark: { bar: 'bg-night/80 text-cream backdrop-blur', line: 'border-cream/30', btn: 'bg-sun', dot: 'bg-ink', prog: 'bg-sun' },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [tone, setTone] = useState('light')
  const [active, setActive] = useState('home')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const k = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k)
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open])

  // scroll-spy: which section sits under the bar right now?
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const els = [...document.querySelectorAll('main > [data-nav]')]
      const cur = els.find((e) => { const r = e.getBoundingClientRect(); return r.top <= 48 && r.bottom > 48 }) || els[0]
      if (cur) { setTone(cur.dataset.nav); setActive(cur.id) }
    }
    const tick = () => { if (!raf) raf = requestAnimationFrame(read) }
    read()
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick)
    return () => { removeEventListener('scroll', tick); removeEventListener('resize', tick); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const t = open ? tones.dark : tones[tone]
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${open ? 'text-cream' : t.bar}`}>
        <nav aria-label="Main" className={`mx-auto flex max-w-[1600px] items-center justify-between border-b px-5 py-3 transition-colors duration-500 ${t.line}`}>
          <a href="#home" onClick={() => setOpen(false)} className="text-2xl font-extrabold tracking-tighter">HAIDAR.</a>
          <p className="hidden items-center gap-2 text-[10px] font-bold uppercase leading-tight sm:flex">
            <span className="h-2 w-2 rounded-full bg-sun ring-1 ring-ink" /><span>Student<br />Portfolio '26</span>
          </p>
          <Magnetic strength={0.25}>
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-panel"
              className="group flex items-center gap-3 text-sm font-bold uppercase">
              {open ? 'Close' : 'Menu'}
              <span className={`grid h-9 w-9 place-items-center rounded-full transition-colors duration-500 group-hover:scale-110 ${t.btn}`}>
                <span className="flex gap-1"><i className={`h-1.5 w-1.5 rounded-full ${t.dot}`} /><i className={`h-1.5 w-1.5 rounded-full ${t.dot}`} /></span>
              </span>
            </button>
          </Magnetic>
        </nav>
        {/* reading progress */}
        <motion.i aria-hidden style={{ scaleX: progress }} className={`absolute inset-x-0 bottom-0 h-[3px] origin-left transition-colors duration-500 ${t.prog}`} />
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40" style={{ perspective: 1400 }}>
            <motion.div id="menu-panel" role="dialog" aria-label="Menu"
              initial={{ rotateX: -35, y: '-100%', opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} exit={{ rotateX: 25, y: '-100%', opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} style={{ transformOrigin: 'top center' }}
              className="flex h-full flex-col overflow-y-auto bg-night px-5 pb-6 pt-20 text-cream md:rounded-b-3xl">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-cream/50">
                <span>2.4 — Navigation</span><span>{nav.length} Sections</span>
              </div>
              <ul className="my-auto py-6">
                {nav.map((n, i) => {
                  const here = active === idOf(n)
                  return (
                    <motion.li key={n} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08, duration: 0.6 }}
                      className="border-t border-cream/30 last:border-b">
                      <a href={`#${idOf(n)}`} onClick={() => setOpen(false)} aria-current={here ? 'location' : undefined}
                        className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-2 py-3 md:grid-cols-[4rem_1fr_auto]">
                        <span className={`text-sm ${here ? 'text-sun' : 'text-cream/40'}`}>0{i + 1}</span>
                        <span className={`text-[clamp(2.5rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.95] tracking-tighter transition-all duration-300 group-hover:translate-x-4 group-hover:text-sun ${here ? 'text-sun' : ''}`}>{n}</span>
                        <span className="hidden text-xs uppercase text-cream/50 md:block">{here ? '● You are here' : `↳ ${notes[n]}`}</span>
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
              <div className="flex flex-wrap justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-cream/50">
                <span>Pondok Tahfizh Plus IT Abudzar</span><span>Grade 10A · Generation 03</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
