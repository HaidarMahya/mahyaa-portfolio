import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import { Cursor, Loader } from './components/ui'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Journey from './sections/Journey'
import Contact from './sections/Contact'

export default function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t) }, [])
  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <main><Hero /><About /><Skills /><Journey /><Contact /></main>
    </>
  )
}
