import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown, Code2, Lightbulb, Sparkles } from "lucide-react";
import { heroPhotos as ph } from "../data";
import { Magnetic, TornEdge } from "../components/ui";

const grain = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.012 .02' numOctaves='4' seed='7'/><feDiffuseLighting lighting-color='#fff' surfaceScale='2'><feDistantLight azimuth='50' elevation='75'/></feDiffuseLighting></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>`;
const paper = {
  backgroundColor: "var(--color-paper)",
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(grain)}")`,
  backgroundBlendMode: "multiply",
  backgroundSize: "900px 900px",
};
const torn = {
  a: "polygon(4% 5%,18% 1%,33% 4%,50% 0,66% 3%,82% 0,97% 5%,100% 22%,96% 40%,100% 60%,97% 80%,100% 100%,0 100%,3% 78%,0 58%,4% 38%,0 20%)",
  b: "polygon(0 6%,15% 0,30% 5%,47% 1%,63% 5%,80% 1%,100% 4%,97% 24%,100% 44%,96% 62%,100% 82%,98% 100%,2% 100%,0 80%,3% 60%,0 40%,3% 22%)",
};
const lift = "shadow-[0_10px_16px_-6px_rgba(10,22,3,.4)]";
const u = (n) => `calc(var(--u)*${n})`;

const useWide = () => {
  const [w, setW] = useState(false);
  useEffect(() => {
    const q = matchMedia("(min-width:1024px)"),
      f = () => setW(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  return w;
};

// g = { w, l | r | c (offset from center), b, rot } in --u units. 1u = 16px on the 1600px reference.
// pointer position (-1..1) shared with every piece; each piece drifts by its own "depth"
const Mouse = createContext(null);
const depths = [0.4, 0.6, 1.2, 1.5, 1.9, 0.9, 1.3, 2.2, 1.7, 1.1, 1.4, 1.8];

function Piece({ g, i, z = 1, fs, children }) {
  const m = useContext(Mouse),
    d = depths[i] ?? 1;
  const px = useTransform(m.x, (v) => v * d * 14),
    py = useTransform(m.y, (v) => v * d * 10);
  if (!g) return null;
  return (
    <motion.div
      className="absolute"
      style={{
        zIndex: z,
        width: u(g.w),
        fontSize: fs ? u(fs) : undefined,
        bottom: `calc(${u(g.b)} - var(--drop))`,
        left:
          g.l != null
            ? u(g.l)
            : g.c != null
              ? `calc(50% + ${u(g.c)})`
              : undefined,
        right: g.r != null ? u(g.r) : undefined,
      }}
      initial={{ y: "45%", opacity: 0, rotate: g.rot - 8 }}
      animate={{ y: 0, opacity: 1, rotate: g.rot }}
      transition={{
        delay: 1.5 + i * 0.09,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        rotate: g.rot + 2.5,
        scale: 1.03,
        zIndex: 30,
        transition: { duration: 0.25 },
      }}
    >
      <motion.div style={{ x: px, y: py }}>{children}</motion.div>
    </motion.div>
  );
}

const Cut = ({ src, alt, rim, gray }) => (
  <div className="relative h-full w-full drop-shadow-[0_10px_12px_rgba(10,22,3,.3)]">
    <div
      className="absolute -inset-[7%]"
      style={{ background: rim, clipPath: torn.b }}
    />
    <img
      src={src}
      alt={alt}
      className={`relative h-full w-full object-cover ${gray ? "grayscale" : ""}`}
      style={{ clipPath: torn.a, objectPosition: "50% 30%" }}
    />
  </div>
);

const Tape = ({ className = "" }) => (
  <i
    aria-hidden
    className={`absolute h-[12%] w-[34%] bg-[#B8B5AD]/80 ${className}`}
  />
);

export default function Hero() {
  const wide = useWide(),
    pick = (d, m) => (wide ? d : m);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 70, damping: 18 }),
    sy = useSpring(ry, { stiffness: 70, damping: 18 });
  const mouse = useMemo(() => ({ x: sx, y: sy }), [sx, sy]);
  const onMove = (e) => {
    if (!wide || reduced || e.pointerType !== "mouse") return;
    rx.set((e.clientX / innerWidth) * 2 - 1);
    ry.set((e.clientY / innerHeight) * 2 - 1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <Mouse.Provider value={mouse}>
      <section
        id="home"
        data-nav="light"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          ...paper,
          "--u": wide ? "min(1vw, 1.8vh)" : "1vw",
          "--drop": wide
            ? "max(0px, calc(var(--u)*42 + 25rem - max(100svh, 44rem)))"
            : "0px",
        }}
        className="relative h-[max(100svh,44rem)] overflow-hidden px-[1.25vw] pt-20 lg:pt-16"
      >
        <div className="relative z-10 flex items-start justify-center gap-6 lg:justify-between lg:pt-10">
          <div className="hidden gap-[5vw] lg:flex">
            <p className="w-36 text-[11px] font-extrabold uppercase leading-snug">
              Exploring technology, creativity and continuous learning
            </p>
            <p className="w-32 font-hand text-sm font-semibold uppercase leading-snug tracking-widest">
              Web dev. UI/UX. Graphic design.
            </p>
          </div>

          {/* BAGIAN H1 YANG DIPERBARUI */}
          <h1 className="text-center">
            <span className="flex flex-wrap items-baseline justify-center font-serif text-[clamp(3.5rem,6.5vw,7.5rem)] font-bold leading-[0.85] tracking-tighter uppercase text-ink">
              {["Creative Mind", "·", "Future Builder"].map((t, k) => (
                <span
                  key={k}
                  aria-hidden={k === 1}
                  className={`overflow-hidden pb-[.05em] ${k === 1 ? "mx-[.2em] hidden sm:block text-sun" : ""}`}
                >
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 1.35 + k * 0.12,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {t}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
          {/* AKHIR BAGIAN H1 */}

          <div className="hidden gap-[4vw] lg:flex">
            <p className="w-28 font-hand text-sm font-semibold uppercase leading-snug tracking-widest">
              Class 10A. Generation 03. Abudzar.
            </p>
            <p className="w-40 text-right text-[11px] font-extrabold uppercase leading-snug">
              “Asking ‘what if?’ before asking ‘how?’” ~Haidar
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-10 w-fit lg:mt-8">
          <Magnetic strength={0.35}>
            <a
              href="#skills"
              className="group relative block w-fit px-14 py-4 text-sm font-extrabold uppercase transition hover:-rotate-2"
            >
              <svg
                aria-hidden
                viewBox="0 0 400 60"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-sun"
                fill="currentColor"
              >
                <filter id="rough" x="-5%" y="-20%" width="110%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency=".035 .12"
                    numOctaves="2"
                    seed="2"
                    result="t"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="t" scale="9" />
                </filter>
                <path
                  filter="url(#rough)"
                  d="M8 20 C60 6,140 14,210 8 S340 12,392 6 L396 24 L386 40 C330 36,250 50,190 46 S60 52,10 50 Z"
                />
              </svg>
              <span className="relative">View Skills</span>
            </a>
          </Magnetic>
        </div>

        <div className="absolute inset-0 z-0">
          {/* gray "image" block behind the right photo (the car slot in the reference) */}
          <Piece
            i={2}
            z={3}
            g={pick(
              { w: 21, l: -4, b: 7, rot: -2 },
              { w: 34, l: -7, b: 12, rot: -3 },
            )}
          >
            <div className="aspect-[3/4]">
              <Cut
                src={ph.left}
                alt="Haidar resting his head on his hand"
                rim="#F6E642"
              />
            </div>
          </Piece>
          <Piece
            i={3}
            z={4}
            fs={1.25}
            g={pick({ w: 18.5, c: -25.75, b: 3.4, rot: -3 })}
          >
            <div
              className={`aspect-[9/18] rounded-[2.2em] border-[.5em] border-ink bg-cream p-[.9em] text-ink ${lift}`}
            >
              <div className="flex justify-between font-bold">
                <span>12:22</span>
                <span>●●</span>
              </div>
              <p className="mt-[1.2em] text-[.7em] font-bold uppercase text-ink/50">
                Personal portfolio
              </p>
              <p className="text-[1.5em] font-extrabold leading-none">
                Haidar’s skills
              </p>
              {[
                ["Web", "bg-sun"],
                ["UI/UX", "bg-sky"],
                ["Graphic", "bg-butter"],
              ].map(([t, c]) => (
                <div
                  key={t}
                  className={`mt-[.7em] rounded-[.8em] border-2 border-ink px-[.8em] py-[1.6em] font-bold ${c}`}
                >
                  {t}
                </div>
              ))}
              <div className="mt-[1em] rounded-full bg-sun py-[.6em] text-center font-extrabold">
                View skills
              </div>
            </div>
          </Piece>
          <Piece
            i={4}
            z={5}
            fs={pick(1, 2)}
            g={pick(
              { w: 9.5, l: 12.5, b: 35.3, rot: 5 },
              { w: 19, l: 4, b: 92, rot: 6 },
            )}
          >
            <div className={`relative bg-white p-[8%] pb-[16%] ${lift}`}>
              <div className="flex aspect-square items-end bg-sun p-[10%] font-hand text-[1.4em] font-bold leading-none">
                <span>
                  #F6E642
                  <br />
                  Sunshine
                </span>
              </div>
              <Tape className="-top-[9%] left-1/2 -translate-x-1/2 rotate-[-18deg]" />
            </div>
          </Piece>
          <Piece
            i={5}
            z={6}
            g={pick(
              { w: 42, c: -21, b: 8.4, rot: 0 },
              { w: 70, l: 15, b: 37, rot: 0 },
            )}
          >
            <div className="aspect-[987/720]">
              <Cut
                src="/images/foto_1.png"
                alt="Deskripsi Foto Baru"
                rim="#EE7B47"
                gray
              />
            </div>
          </Piece>
          <Piece
            i={6}
            z={7}
            g={pick(
              { w: 22, r: -3, b: 9, rot: 3 },
              { w: 38, r: -9, b: 6, rot: 4 },
            )}
          >
            <div className="aspect-[3/4]">
              <Cut
                src={ph.right}
                alt="Haidar wearing a blue cap and sunglasses"
                rim="#315CA5"
              />
            </div>
          </Piece>
          <Piece
            i={7}
            z={8}
            fs={pick(1, 2.4)}
            g={pick(
              { w: 7, c: 12.2, b: 35.9, rot: -4 },
              { w: 17, r: 5, b: 100, rot: -6 },
            )}
          >
            <div
              className={`grid aspect-square place-items-center rounded-full border-[.3em] border-white bg-sun text-center font-hand text-[1.4em] font-bold leading-none ${lift}`}
            >
              what
              <br />
              if?
            </div>
          </Piece>
          <Piece
            i={8}
            z={9}
            fs={1.15}
            g={pick({ w: 10, c: 21.25, b: 31.9, rot: -8 })}
          >
            <div className={`border-[.35em] border-white bg-white ${lift}`}>
              <p className="border-2 border-ink px-[.8em] py-[.5em] text-center font-extrabold uppercase leading-[.95]">
                Pondok Tahfizh
                <br />
                Plus IT
                <br />
                Abudzar
              </p>
            </div>
          </Piece>
          <Piece
            i={9}
            z={10}
            g={pick(
              { w: 15, c: -8, b: -12, rot: -2 },
              { w: 30, l: 35, b: -24, rot: -3 },
            )}
          >
            <div className={`bg-white p-[5%] pb-[14%] ${lift}`}>
              <img
                src={ph.bottom}
                alt="Haidar with tousled hair"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Piece>
          <Piece i={10} z={10} fs={1} g={pick({ w: 9, l: 21, b: -8, rot: 3 })}>
            <div className={`bg-white p-[8%] ${lift}`}>
              <p className="flex items-center justify-between font-hand text-[1.5em] font-bold leading-none">
                est. ’26 <Sparkles size={16} />
              </p>
              <div className="aspect-[4/3]" />
            </div>
          </Piece>
          <Piece i={11} z={11} g={pick({ w: 12.5, r: 12.5, b: -2, rot: 4 })}>
            <div className="relative aspect-[1/.85]">
              <div
                className="absolute -inset-[8%]"
                style={{ background: "#315CA5", clipPath: torn.b }}
              />
              <div
                className="relative grid h-full place-items-center bg-white"
                style={{ clipPath: torn.a }}
              >
                <Code2 className="h-auto w-1/3" strokeWidth={2} />
              </div>
            </div>
          </Piece>
        </div>
        <TornEdge color="var(--color-sun)" />
      </section>
    </Mouse.Provider>
  );
}
