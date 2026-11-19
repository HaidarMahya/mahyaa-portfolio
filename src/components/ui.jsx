import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'

export const Reveal = ({ children, delay = 0, y = 40, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
)

export const TextReveal = ({ text, className = '' }) => (
  <h2 className={className} aria-label={text.replace(/\n/g, ' ')}>
    {text.split('\n').map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden>
        <motion.span className="block" initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
      </span>
    ))}
  </h2>
)

export const Sticker = ({ children, className = '', rotate = -8, delay = 0 }) => (
  <motion.div aria-hidden className={`absolute z-10 select-none rounded-full border-2 border-ink px-4 py-2 font-hand text-xl font-bold shadow-[3px_3px_0_#0A1603] ${className}`}
    initial={{ rotate }} animate={{ y: [0, -10, 0], rotate: [rotate, rotate + 5, rotate] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>{children}</motion.div>
)

export const Placeholder = ({ src, label, className = '' }) => src
  ? <img src={src} alt={label} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  : <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,transparent_0_12px,rgba(10,22,3,.08)_12px_24px)] text-ink/70 ${className}`}>
      <ImagePlus size={32} /><span className="font-hand text-xl">{label}</span></div>

export const Squiggle = ({ className = '' }) => (
  <svg aria-hidden viewBox="0 0 200 20" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <path d="M4 10 Q 20 -2 36 10 T 68 10 T 100 10 T 132 10 T 164 10 T 196 10" /></svg>
)

export const Arrow = ({ className = '' }) => (
  <svg aria-hidden viewBox="0 0 120 80" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12 C 40 4, 90 20, 96 62" /><path d="M78 48 L 96 64 L 108 42" /></svg>
)

// Cursor: a ring that grows on links/buttons and says "View" on [data-cursor="view"]. Blends with any background.
export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 35 }), sy = useSpring(y, { stiffness: 500, damping: 35 })
  const [on, setOn] = useState(false)
  const [mode, setMode] = useState('idle') // idle | link | view
  const [down, setDown] = useState(false)
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    setOn(true); document.body.classList.add('has-cursor')
    const m = (e) => { x.set(e.clientX); y.set(e.clientY) }
    const o = (e) => {
      const t = e.target.closest?.('[data-cursor],a,button,[role=button]')
      setMode(!t ? 'idle' : t.dataset?.cursor === 'view' ? 'view' : 'link')
    }
    const d = () => setDown(true), u = () => setDown(false)
    addEventListener('mousemove', m); addEventListener('mouseover', o); addEventListener('mousedown', d); addEventListener('mouseup', u)
    return () => {
      removeEventListener('mousemove', m); removeEventListener('mouseover', o); removeEventListener('mousedown', d); removeEventListener('mouseup', u)
      document.body.classList.remove('has-cursor')
    }
  }, [])
  const size = mode === 'view' ? 88 : mode === 'link' ? 56 : 22
  return on ? (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference">
      <motion.div className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-night"
        animate={{ width: size, height: size, scale: down ? 0.85 : 1, backgroundColor: mode === 'idle' ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,1)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
        {mode === 'view' && <span className="text-[10px] font-extrabold uppercase tracking-widest">View</span>}
      </motion.div>
    </motion.div>
  ) : null
}

// Pulls its children slightly toward the mouse. Mouse only, off with reduced motion.
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null), reduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 }), sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const move = (e) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength); y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return <motion.div ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}>{children}</motion.div>
}

// 3D tilt that follows the pointer.
export function Tilt({ children, max = 9, className = '' }) {
  const ref = useRef(null), reduced = useReducedMotion()
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18 }), sry = useSpring(ry, { stiffness: 160, damping: 18 })
  const move = (e) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  const leave = () => { rx.set(0); ry.set(0) }
  return <motion.div ref={ref} className={className} style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} onPointerMove={move} onPointerLeave={leave}>{children}</motion.div>
}

// Torn paper strip in the NEXT section's colour, placed at the bottom of a section so sections flow into each other.
const tornPath = 'M0 40 L0 18 L40 26 L85 10 L130 24 L180 8 L235 22 L290 12 L340 26 L400 9 L450 21 L510 7 L560 24 L620 11 L675 25 L730 8 L790 22 L850 13 L905 27 L960 10 L1020 23 L1080 9 L1140 24 L1200 14 L1200 40 Z'
export const TornEdge = ({ color, className = '' }) => (
  <svg aria-hidden viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ color }}
    className={`pointer-events-none absolute inset-x-0 bottom-[-1px] z-20 h-6 w-full md:h-10 ${className}`}>
    <path d={tornPath} fill="currentColor" />
  </svg>
)

export const Loader = () => (
  <motion.div className="fixed inset-0 z-[200] grid place-items-center bg-sun" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
    <motion.p className="text-7xl font-extrabold tracking-tighter text-ink md:text-9xl" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>HAIDAR.</motion.p>
  </motion.div>
)
