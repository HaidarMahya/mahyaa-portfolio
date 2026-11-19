import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal, TornEdge } from "../components/ui";

const menu = [
  ["Home", "#home"],
  ["The Archive", "#archive"],
  ["My Skills", "#skills"],
  ["Contacts", "#contact"],
];

// Data lokal khusus untuk 4 karya dengan gambar baru
const myWorks = [
  { no: "01", name: "Rebel", src: "/images/about-rebel.jpg", alt: "Rebel Concept" },
  {
    no: "02",
    name: "Sign Up UI",
    src: "/images/Sign up.png",
    alt: "Sign Up Interface",
  },
  {
    no: "03",
    name: "Greeners Nusa",
    src: "/images/Green.jpg",
    alt: "Greeners Nusa Branding",
  },
  {
    no: "04",
    name: "Gadget Banners",
    src: "/images/Smaller Banners.png",
    alt: "Gadget Banners",
  },
];

const Polaroid = ({ p, i, onOpen }) => (
  <motion.figure
    className="mx-auto w-full cursor-pointer group"
    data-cursor="view"
    role="button"
    tabIndex={0}
    aria-label={`View ${p.name}`}
    onClick={() => onOpen(i)}
    onKeyDown={(e) =>
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(i))
    }
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{
      delay: (i % 3) * 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    <div className="relative bg-transparent group-hover:bg-cream/10 transition-colors duration-300">
      <div className="relative z-10">
        {/* Gambar dipanggil secara dinamis dari data myWorks */}
        <img
          src={p.src}
          alt={p.alt}
          loading="lazy"
          className="block w-full object-cover aspect-square transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  </motion.figure>
);

const ease = [0.22, 1, 0.36, 1];

function Lightbox({ i, set }) {
  const open = i !== null;
  useEffect(() => {
    if (!open) return;
    const n = myWorks.length;
    const k = (e) => {
      if (e.key === "Escape") set(null);
      else if (e.key === "ArrowRight") set((v) => (v + 1) % n);
      else if (e.key === "ArrowLeft") set((v) => (v - 1 + n) % n);
    };
    addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [open, set]);

  const p = open ? myWorks[i] : null;

  const btn =
    "grid h-12 w-12 place-items-center bg-transparent border-4 border-cream text-cream transition hover:bg-cream hover:text-night";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={p.name}
          className="fixed inset-0 z-[60] grid place-items-center bg-night p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => set(null)}
        >
          {/* Halftone / Retro Pattern Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          <motion.figure
            key={i}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-w-[min(92vw,64rem)] w-full"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="relative bg-night p-4 md:p-6">
              {/* Gambar Lightbox */}
              <img
                src={p.src}
                alt={p.alt}
                className="max-h-[70svh] w-full object-cover"
              />

              <figcaption className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-cream/30 pt-4 gap-4">
                <div>
                  <span className="block font-mono text-cream/70 uppercase tracking-[0.2em] text-sm mb-2">
                    Project Name
                  </span>
                  <span className="block font-serif text-3xl md:text-5xl uppercase tracking-tight text-cream">
                    {p.name}
                  </span>
                </div>
                <div className="bg-cream text-night font-mono font-bold px-4 py-2">
                  ARCHIVE NO. {p.no}
                </div>
              </figcaption>
            </div>
          </motion.figure>

          {/* Tombol Navigasi */}
          <button
            type="button"
            autoFocus
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              set(null);
            }}
            className={`${btn} absolute right-6 top-6 md:right-10 md:top-10`}
          >
            <X strokeWidth={3} />
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              set((v) => (v - 1 + myWorks.length) % myWorks.length);
            }}
            className={`${btn} hidden md:grid absolute left-6 top-1/2 -translate-y-1/2`}
          >
            <ChevronLeft strokeWidth={3} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              set((v) => (v + 1) % myWorks.length);
            }}
            className={`${btn} hidden md:grid absolute right-6 top-1/2 -translate-y-1/2`}
          >
            <ChevronRight strokeWidth={3} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function About() {
  const [sel, setSel] = useState(null);

  return (
    <section
      id="archive"
      data-nav="dark"
      className="relative bg-night px-6 pb-32 pt-20 text-cream md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="grid gap-16 md:grid-cols-[1fr_2fr] items-start">
        {/* Left Headline Area */}
        <Reveal className="sticky top-24 border-l-4 border-cream pl-6">
          <h2 className="font-serif text-[clamp(4rem,8vw,10rem)] uppercase leading-[0.8] tracking-tighter mb-6">
            My
            <br />
            Works
          </h2>
          <p className="font-serif text-lg md:text-xl text-cream/90 leading-relaxed text-justify max-w-sm">
            I'm Haidar, a student at Pondok Tahfizh Plus IT Abudzar, exploring
            technology, creativity and Islamic values. Learning by building, one
            idea at a time.
          </p>
        </Reveal>

        {/* Right Gallery Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-16">
          {/* Mapping diganti menjadi myWorks, membatasi hingga 4 item saja */}
          {myWorks.map((p, i) => (
            <Polaroid key={p.no} p={p} i={i} onOpen={setSel} />
          ))}
        </div>
      </div>

      <TornEdge color="var(--color-cream)" />
      <Lightbox i={sel} set={setSel} />
    </section>
  );
}
