import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import * as Icons from "lucide-react";
import { Arrow, Reveal, TextReveal } from "../components/ui";
import { archive, interests, skills } from "../data";

const { ChevronLeft, ChevronRight, X, BookOpen, MousePointerClick } = Icons;

/* ───────────────────────── constants & helpers ───────────────────────── */

// 1. Dibatasi menjadi 4 halaman
const TOTAL = 4;
const EASE = [0.645, 0.045, 0.355, 1];
const PAD = (n) => String(n).padStart(2, "0");
const LETTERS = "ABCD";

// 2. Daftar gambar kustom untuk disisipkan ke DALAM buku
const customArchive = [
  { src: "/images/Green.jpg", name: "Greeners Nusa", alt: "Greeners Design" },
  { src: "/images/Sign up.png", name: "Sign Up UI", alt: "Sign up screen" },
  { src: "/images/about-rebel.jpg", name: "Rebel Design", alt: "Rebel poster" },
  { src: "/images/Smaller Banners.png", name: "Tech Devices", alt: "Banners" },
];

const paperBg = (c = "var(--color-cream)") => ({
  backgroundColor: c,
  backgroundImage: "radial-gradient(rgba(10,22,3,0.1) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
});

const notes = [
  "one component at a time",
  "clear & human",
  "shape · color · type",
  "how does it work?",
  "what if…?",
  "values first",
];

const relatedMap = {
  "Web Development": ["Web Development"],
  "UI/UX Design": ["Design"],
  "Graphic Design": ["Design"],
  Technology: ["Web Development"],
  "Creative Thinking": ["Creative Thinking"],
  "Islamic Learning": ["Islamic Values"],
};
const related = (s) =>
  (relatedMap[s.t] || []).filter((r) => interests.includes(r));

const useMedia = (q) => {
  const [m, setM] = useState(
    () => typeof matchMedia !== "undefined" && matchMedia(q).matches,
  );
  useEffect(() => {
    const mq = matchMedia(q),
      f = () => setM(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
};

/* ───────────────────────── small paper props ───────────────────────── */

const Tape = ({ className = "" }) => (
  <i aria-hidden className={`absolute bg-ink/80 ${className}`} />
);

const Clip = ({ className = "" }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 60"
    className={className}
    fill="none"
    stroke="var(--color-ink)"
    strokeWidth="3.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    <path d="M16 14v32a6 6 0 0 1-12 0V12a9 9 0 0 1 18 0v30" />
  </svg>
);

const Stamp = ({ children, className = "" }) => (
  <span
    className={`inline-block px-[.6em] py-[.3em] font-mono text-[.72em] font-bold uppercase tracking-[.2em] text-ink bg-white ${className}`}
  >
    {children}
  </span>
);

const Sheet = ({ tone, children }) => (
  <div
    className="relative h-full w-full overflow-hidden text-ink"
    style={paperBg(tone)}
  >
    {children}
  </div>
);

/* ───────────────────────── notebook pages ───────────────────────── */

function Cover() {
  return (
    <div className="relative h-full w-full overflow-hidden text-ink bg-sun">
      <div className="absolute inset-y-0 left-0 w-[2.4em] bg-ink/10" />
      <div className="absolute inset-[1.2em] left-[3.4em] bg-cream/90" />
      <div className="absolute inset-0 flex flex-col items-center justify-between py-[2.6em] pl-[4.6em] pr-[2.4em] text-center">
        <p className="text-[20px] font-mono font-bold uppercase tracking-[.3em] text-ink/60">
          My projects
        </p>
        <div className="relative w-full bg-butter px-[1em] py-[1.4em] text-ink">
          <Tape className="-top-[.7em] left-1/2 h-[1.4em] w-[6em] -translate-x-1/2" />
          <p className="text-[.62em] font-mono font-bold uppercase tracking-[.22em] bg-ink text-cream inline-block px-2 mb-2">
            Restricted Access
          </p>
          <h3 className="my-[.5em] font-serif text-[2.5em] font-bold leading-[.9] tracking-tighter uppercase">
            Subject
            <br />
            Capabilities
          </h3>
          <p className="font-mono text-[.8em] font-bold tracking-[.1em] uppercase">
            Haidar Mahya
          </p>
        </div>
        <span className="flex animate-pulse items-center gap-[.6em] bg-ink px-[1.1em] py-[.55em] text-[.8em] font-mono font-bold uppercase tracking-widest text-cream">
          <MousePointerClick className="h-[1.2em] w-[1.2em]" />
          Access File
        </span>
      </div>
    </div>
  );
}

const BookPlate = () => (
  <Sheet tone="var(--color-cream)">
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[.8em] px-[2em] text-center bg-white m-4">
      <p className="font-mono text-[.8em] font-bold uppercase tracking-[.1em] text-ink/70">
        File Ownership
      </p>
      <p className="font-serif text-[3.8em] font-bold uppercase leading-none">
        Haidar
      </p>
      <Stamp className="mt-4 bg-sun">Classified</Stamp>
      <p className="mt-[1em] text-[.65em] font-mono font-bold uppercase tracking-[.2em] text-ink bg-ink/10 px-2 py-1">
        IT Abudzar · Generation 03
      </p>
    </div>
  </Sheet>
);

const Verso = ({ n }) => (
  <Sheet tone="var(--color-cream)">
    <div
      aria-hidden
      className="absolute inset-[2em] opacity-30"
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent 0 1.9em, var(--color-ink) 1.9em calc(1.9em + 1px))",
      }}
    />
    <p className="absolute bottom-[1.6em] right-[2em] bg-ink text-cream px-2 py-1 font-mono text-[.8em] font-bold uppercase">
      Log // {PAD(n)}
    </p>
  </Sheet>
);

const Ghost = ({ n, className }) => (
  <span
    aria-hidden
    className={`absolute select-none font-serif font-bold uppercase leading-none text-ink opacity-5 ${className}`}
  >
    {PAD(n)}
  </span>
);

const Badge = ({ s, size = "3.8em", icon = "1.8em" }) => {
  const Icon = Icons[s?.i || "Circle"];
  return (
    <div
      className={`grid shrink-0 place-items-center ${s?.c || ""}`}
      style={{ width: size, height: size }}
    >
      <Icon
        style={{ width: icon, height: icon }}
        strokeWidth={2}
        className="text-ink"
      />
    </div>
  );
};

const Tags = ({ s }) => {
  return (
    <div className="flex flex-wrap items-center gap-[.5em]">
      <span className="font-mono text-[.8em] font-bold uppercase text-ink/70">
        Linked:
      </span>
      <span className="bg-butter px-[.8em] py-[.3em] text-[.78em] font-bold uppercase font-mono">
        UI/UX Design
      </span>
    </div>
  );
};

function TextPage({ i }) {
  const s = skills[i];
  if (!s) return null;
  return (
    <Sheet>
      <div className="absolute inset-0 flex flex-col p-[2em] pl-[2.4em] bg-white">
        <div className="flex items-start justify-between">
          <Badge s={s} />
          <div className="flex flex-col items-end gap-[.5em]">
            <Stamp className="bg-sun">Log File {PAD(i + 1)}</Stamp>
            <span className="font-mono text-[.8em] font-bold uppercase leading-none text-ink bg-ink/5 px-2 py-1">
              pg {PAD(i + 1)} / {PAD(TOTAL)}
            </span>
          </div>
        </div>
        <h3 className="mt-[1.6em] text-[2.6em] font-serif font-bold uppercase leading-[.9] tracking-tighter">
          {s.t}
        </h3>
        <p className="mt-[1em] max-w-[17em] font-mono text-[.9em] font-medium leading-[1.4] text-ink/80 pl-3 bg-ink/5 py-2">
          {s.d}
        </p>
        <div className="mt-[1.5em]">
          <Tags s={s} />
        </div>
        <p className="mt-auto font-mono text-[1em] font-bold uppercase bg-ink text-cream inline-block self-start px-2 py-1">
          {notes[i]}
        </p>
        <div className="mt-[.8em] flex justify-between pt-[.6em] text-[.66em] font-bold uppercase tracking-widest text-ink/60">
          <span>Haidar Archive</span>
          <span>{PAD(i + 1)}</span>
        </div>
      </div>
      <Tape className="-right-[1.4em] top-[1.2em] h-[1.5em] w-[5em]" />
    </Sheet>
  );
}

function VisualPage({ i }) {
  const s = skills[i];
  if (!s) return null;

  const Icon = Icons[s.i || "Circle"];
  // 3. Menggunakan customArchive untuk mengganti gambar bawaan
  const a = customArchive[i] || archive[i];

  return (
    <Sheet tone="var(--color-cream)">
      <Ghost n={i + 1} className="left-[.12em] top-[.05em] text-[12em]" />

      <div className="absolute left-[3em] top-[6em] w-[15em] bg-white p-[.9em] pb-[3em]">
        <img
          src={a?.src}
          alt={a?.alt}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
        <p className="absolute inset-x-[1em] bottom-[.8em] font-mono text-[.7em] font-bold uppercase leading-none text-ink bg-sun px-2 py-2">
          fig. {PAD(i + 1)} — {a?.name}
        </p>
        <Tape className="-top-[.9em] left-1/2 h-[1.7em] w-[5.5em] -translate-x-1/2" />
        <Clip className="absolute -top-[1.8em] right-[1.6em] h-[4.2em] w-[1.7em]" />
      </div>

      <div className="absolute bottom-[3.4em] right-[1.4em] w-[8.6em]">
        <div className={`grid aspect-square place-items-center ${s.c}`}>
          <Icon className="h-[3.6em] w-[3.6em] text-ink" strokeWidth={2} />
        </div>
      </div>

      <div className="absolute right-[1.6em] top-[2.2em] flex w-[7em] flex-col items-end text-ink">
        <p className="font-mono text-[1em] font-bold uppercase bg-butter px-2 py-1 leading-none">
          Ref {LETTERS[i]}
        </p>
        <Arrow
          className="mt-[.4em] h-[3.4em] w-[4.6em] rotate-[15deg] stroke-ink"
          strokeWidth={2}
        />
      </div>
      <span className="absolute bottom-[1.6em] left-[1.6em] grid h-[2.3em] w-[2.3em] place-items-center bg-ink text-[1em] font-bold text-cream">
        {i + 1}
      </span>
      <span className="absolute bottom-[1.2em] right-[1.8em] text-[.64em] font-bold uppercase tracking-widest text-ink bg-white px-2 py-1">
        fig. {PAD(i + 1)}
      </span>
    </Sheet>
  );
}

function SinglePage({ i }) {
  const s = skills[i];
  if (!s) return null;

  // 4. Menggunakan customArchive untuk view mobile
  const a = customArchive[i] || archive[i];

  return (
    <Sheet>
      <Ghost n={i + 1} className="-left-[.05em] top-[5.2em] text-[10em]" />
      <div className="absolute inset-0 flex flex-col p-[1.6em] bg-white">
        <div className="relative flex items-start justify-between">
          <div className="flex flex-col items-start gap-[.8em]">
            <Stamp>Log No. {PAD(i + 1)}</Stamp>
            <Badge s={s} size="3.4em" icon="1.6em" />
            <p className="font-mono text-[.8em] font-bold uppercase bg-butter px-2 py-1 text-ink">
              Ref {LETTERS[i]}
            </p>
          </div>
          <div className="relative w-[10em] bg-cream p-[.7em] pb-[2.1em]">
            <img
              src={a?.src}
              alt={a?.alt}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <p className="absolute inset-x-[.8em] bottom-[.5em] font-mono text-[.7em] font-bold uppercase bg-sun px-2 py-1 leading-none text-ink">
              fig. {PAD(i + 1)}
            </p>
            <Tape className="-top-[.8em] left-1/2 h-[1.4em] w-[4.4em] -translate-x-1/2" />
          </div>
        </div>
        <h3 className="mt-[1.1em] text-[2.2em] font-serif font-bold uppercase leading-[.9] tracking-tighter">
          {s.t}
        </h3>
        <p className="mt-[.6em] font-mono text-[.85em] font-medium leading-[1.4] text-ink/80 bg-ink/5 p-2">
          {s.d}
        </p>
        <div className="mt-[.8em]">
          <Tags s={s} />
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="font-mono text-[.9em] font-bold uppercase bg-ink text-cream px-2 py-1 leading-none">
            {notes[i]}
          </p>
          <span className="text-[.64em] font-bold uppercase tracking-widest text-ink/60">
            pg {PAD(i + 1)} / {PAD(TOTAL)}
          </span>
        </div>
      </div>
    </Sheet>
  );
}

/* ───────────────────────── 3D leaf ───────────────────────── */

const Face = ({ back, shade, children }) => (
  <div
    className="absolute inset-0"
    style={{
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: back ? "rotateY(180deg)" : undefined,
    }}
  >
    {children}
    <i
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-[14%] from-black/20 to-transparent ${back ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"}`}
    />
    <motion.i
      aria-hidden
      style={{ opacity: shade }}
      className={`pointer-events-none absolute inset-0 from-black/40 via-black/5 to-transparent ${back ? "bg-gradient-to-l" : "bg-gradient-to-r"}`}
    />
  </div>
);

function Leaf({ j, flipped, peek, delay, spread, reduced, front, back }) {
  const target = flipped ? -180 : peek && !reduced ? -12 : 0;
  const mv = useMotionValue(target);
  const shade = useTransform(mv, [-180, -90, 0], [0, 0.4, 0]);
  const prev = useRef(target);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prev.current === target) return;
    const big = Math.abs(target - prev.current) > 20;
    prev.current = target;
    setBusy(big);
    const c = animate(mv, target, {
      duration: reduced ? 0.01 : big ? 1.05 : 0.4,
      delay: big && !reduced ? delay : 0,
      ease: EASE,
      onComplete: () => setBusy(false),
    });
    return () => c.stop();
  }, [target, reduced, delay]);

  return (
    <motion.div
      className="absolute top-0 h-full"
      style={{
        left: spread ? "50%" : 0,
        width: spread ? "50%" : "100%",
        rotateY: mv,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        zIndex: busy ? 40 : flipped ? j : 20 - j,
        visibility: !spread && flipped && !busy ? "hidden" : "visible",
      }}
    >
      <Face shade={shade}>{front}</Face>
      {back && (
        <Face back shade={shade}>
          {back}
        </Face>
      )}
    </motion.div>
  );
}

/* ───────────────────────── the notebook ───────────────────────── */

const CtrlBtn = ({ label, className = "", ...p }) => (
  <button
    type="button"
    aria-label={label}
    {...p}
    className={`grid h-12 w-12 place-items-center bg-white text-ink transition hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-30 ${className}`}
  />
);

function Notebook() {
  const spread = useMedia("(min-width: 768px)");
  const reduced = useReducedMotion();
  const [{ p, from }, setSt] = useState({ p: 0, from: 0 });
  const [peek, setPeek] = useState(false);
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const swipe = useRef(null);

  const move = useCallback(
    (fn) =>
      setSt((s) => {
        const n = Math.max(0, Math.min(TOTAL, fn(s.p)));
        return n === s.p ? s : { p: n, from: s.p };
      }),
    [],
  );

  const isOpen = p > 0;
  useEffect(() => {
    if (!isOpen || !inView) return;
    const k = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      if (document.body.style.overflow === "hidden") return;
      if (e.key === "ArrowRight") move((v) => v + 1);
      else if (e.key === "ArrowLeft") move((v) => Math.max(1, v - 1));
      else if (e.key === "Escape") move(() => 0);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [isOpen, inView, move]);

  const leaves = useMemo(() => {
    const L = [
      { front: <Cover />, back: spread ? <VisualPage i={0} /> : <BookPlate /> },
    ];
    for (let j = 1; j <= TOTAL; j++) {
      L.push({
        front: spread ? <TextPage i={j - 1} /> : <SinglePage i={j - 1} />,
        back:
          j < TOTAL ? spread ? <VisualPage i={j} /> : <Verso n={j} /> : null,
      });
    }
    return L;
  }, [spread]);

  const delayFor = (j) => {
    if (j >= from && j < p) return (j - from) * 0.09;
    if (j < from && j >= p) return (from - 1 - j) * 0.09;
    return 0;
  };
  const closing = p === 0 && from > 0;

  const width = spread
    ? "max(28rem, min(100%, 52rem, calc((100svh - 6rem) * 1.5)))"
    : "max(15rem, min(100%, 24rem, calc((100svh - 11rem) * .75)))";
  const edge = { top: "-.6em", bottom: "-.6em" };
  const boardCls = "absolute bg-ink/90";

  return (
    <div ref={rootRef} className="flex flex-col items-center">
      <div
        className="relative touch-pan-y"
        style={{ containerType: "inline-size", width }}
        onPointerDown={(e) => {
          swipe.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipe.current == null || !isOpen) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 60)
            move((v) => (dx < 0 ? v + 1 : Math.max(1, v - 1)));
        }}
      >
        <motion.div
          aria-hidden="true"
          className="relative w-full"
          initial={false}
          style={{
            aspectRatio: spread ? "3 / 2" : "3 / 4",
            fontSize: spread ? "2.08cqw" : "4.16cqw",
          }}
          animate={{ x: spread && p === 0 ? "-25%" : "0%" }}
          transition={{
            duration: reduced ? 0 : 0.9,
            delay: closing && !reduced ? 0.45 + (from - 1) * 0.09 : 0,
            ease: EASE,
          }}
        >
          <div
            className={boardCls}
            style={{ ...edge, left: spread ? "50%" : "-.4em", right: "-.6em" }}
          />
          {spread && (
            <motion.div
              className={boardCls}
              style={{ ...edge, left: "-.6em", width: "50%" }}
              initial={false}
              animate={{ opacity: p > 0 ? 1 : 0 }}
              transition={{
                duration: 0.5,
                delay: reduced ? 0 : p > 0 ? 0.3 : 0.6,
              }}
            />
          )}
          <div className="absolute inset-0" style={{ perspective: "2600px" }}>
            {leaves.map((l, j) => (
              <Leaf
                key={j}
                j={j}
                flipped={j < p}
                peek={j === 0 && p === 0 && peek}
                delay={delayFor(j)}
                spread={spread}
                reduced={reduced}
                front={l.front}
                back={l.back}
              />
            ))}
          </div>
          {p === 0 && (
            <button
              type="button"
              aria-hidden="false"
              aria-label="Open the creative journal"
              onClick={() => move(() => 1)}
              onMouseEnter={() => setPeek(true)}
              onMouseLeave={() => setPeek(false)}
              onFocus={() => setPeek(true)}
              onBlur={() => setPeek(false)}
              className={`absolute top-0 z-50 h-full cursor-pointer ${spread ? "left-1/2 w-1/2" : "left-0 w-full"}`}
            />
          )}
        </motion.div>
      </div>

      <div className="mt-12 flex min-h-12 flex-wrap items-center justify-center gap-3">
        {p === 0 ? (
          <button
            type="button"
            onClick={() => move(() => 1)}
            className="flex h-12 items-center gap-3 bg-sun px-6 text-sm font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-cream"
          >
            <BookOpen size={20} strokeWidth={2} />
            ACCESS FILE
          </button>
        ) : (
          <>
            <CtrlBtn
              label="Previous page"
              disabled={p <= 1}
              onClick={() => move((v) => Math.max(1, v - 1))}
            >
              <ChevronLeft strokeWidth={2} />
            </CtrlBtn>
            <div
              role="group"
              aria-label="Pages"
              className="flex items-center gap-2"
            >
              {skills.slice(0, TOTAL).map((s, i) => (
                <button
                  key={s.t}
                  type="button"
                  aria-label={`Page ${i + 1}: ${s.t}`}
                  aria-current={p === i + 1 ? "page" : undefined}
                  onClick={() => move(() => i + 1)}
                  className="grid h-10 w-8 place-items-center"
                >
                  <span
                    className={`block h-2 transition-all ${p === i + 1 ? "w-8 bg-ink" : "w-4 bg-ink/30 hover:bg-ink/60"}`}
                  />
                </button>
              ))}
            </div>
            <CtrlBtn
              label="Next page"
              disabled={p >= TOTAL}
              onClick={() => move((v) => v + 1)}
            >
              <ChevronRight strokeWidth={2} />
            </CtrlBtn>
            <button
              type="button"
              onClick={() => move(() => 0)}
              className="ml-2 flex h-12 items-center gap-2 bg-white px-5 text-sm font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-cream"
            >
              <X size={20} strokeWidth={2} />
              CLOSE
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── evidence board pieces ───────────────────────── */

function Float({
  progress,
  depth = 1,
  rot = 0,
  delay = 0,
  reduced,
  className = "",
  children,
}) {
  const y = useTransform(
    progress,
    [0, 1],
    reduced || !depth ? [0, 0] : [34 * depth, -34 * depth],
  );
  return (
    <motion.div style={{ y }} className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: rot - 8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: rot }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: rot + 3, scale: 1.04 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{
            duration: 5 + delay * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const Snap = ({
  src,
  cap,
  pos = "50% 25%",
  tape = "-top-3 left-1/2 -translate-x-1/2",
}) => (
  <div className="relative bg-white p-2.5 pb-10 text-ink">
    <img
      src={src}
      alt=""
      loading="lazy"
      className="aspect-[4/5] w-full object-cover"
      style={{ objectPosition: pos }}
    />
    <p className="absolute inset-x-3 bottom-2 font-mono font-bold uppercase text-[.7em] leading-none text-ink/80 bg-sun px-2 py-1">
      {cap}
    </p>
    <Tape className={`h-4 w-12 ${tape}`} />
  </div>
);

const Sticky = () => (
  <div className="relative w-44 bg-butter p-4 pt-6 text-ink">
    <i
      aria-hidden
      className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 bg-ink/80"
    />
    <p className="font-mono text-[1.1em] font-bold uppercase leading-[1.2]">
      ask "what if?" before asking "how?"
    </p>
    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-ink bg-white px-2 py-1 w-fit">
      — Haidar
    </p>
  </div>
);

const Scrap = () => (
  <div className="w-44">
    <div className="relative px-5 py-7 text-ink bg-white">
      <p className="font-serif text-[1.8em] font-bold uppercase leading-[1.05]">
        4 Files.
        <br />1 Mind.
      </p>
      <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-widest text-cream bg-ink px-2 py-1 w-fit">
        No. 001—004
      </p>
    </div>
  </div>
);

const RoundStamp = () => (
  <div className="grid h-28 w-28 place-items-center rounded-full bg-sun text-center text-ink">
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[.25em]">
        Verified
      </p>
      <p className="my-1 font-serif text-2xl font-bold leading-none">001—004</p>
      <p className="text-[8px] font-bold uppercase tracking-[.25em]">
        Vol. 01 · 2026
      </p>
    </div>
  </div>
);

/* ───────────────────────── section ───────────────────────── */

export default function Skills() {
  const reduced = useReducedMotion();
  const stage = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start end", "end start"],
  });
  const f = { progress: scrollYProgress, reduced };

  return (
    <section
      id="skills"
      data-nav="dark"
      aria-label="My interests and skills"
      className="relative overflow-hidden bg-cream text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[1]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(10,22,3,0.1) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <header className="relative mx-auto max-w-[1500px] px-5 pt-20 md:px-10 lg:px-28">
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <h1 className="mt-2 text-[clamp(2.5rem,8vw,7rem)] font-serif font-extrabold uppercase leading-[0.85] tracking-tighter text-ink">
              Mahya
            </h1>
          </div>
          <Reveal delay={0.25} className="pl-4">
            <p className="font-mono text-[.9rem] font-bold uppercase leading-snug text-ink bg-sun px-2 py-1 w-fit mb-2">
              System Log
            </p>
            <p className="font-serif text-lg md:text-2xl font-bold uppercase leading-tight text-ink/90">
              A record of tools, methods, and creative disciplines.
            </p>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
              [ {interests.join(" · ").toUpperCase()} ]
            </p>
          </Reveal>
        </div>
      </header>

      <div
        ref={stage}
        className="relative mx-auto max-w-[1500px] px-4 pb-24 pt-14 md:px-10 lg:px-28 lg:pb-32 lg:pt-20"
      >
        <div className="mb-10 flex items-start justify-center gap-6 lg:hidden">
          <Float {...f} depth={0} rot={-4} className="scale-90 sm:scale-100">
            <Sticky />
          </Float>
          <Float
            {...f}
            depth={0}
            rot={5}
            delay={0.15}
            className="hidden sm:block"
          >
            <RoundStamp />
          </Float>
        </div>

        <div aria-hidden className="hidden lg:block">
          <Float
            {...f}
            depth={1.2}
            rot={-6}
            className="absolute left-[1%] top-[3%] z-0 w-40"
          >
            <Snap src="/images/HTML.jpg" pos="50% 50%" />
          </Float>
          <Float
            {...f}
            depth={0.8}
            rot={4}
            delay={0.1}
            className="absolute right-[2%] top-[6%] z-0"
          >
            <Sticky />
          </Float>
          <Float
            {...f}
            depth={1.4}
            rot={-3}
            delay={0.2}
            className="absolute bottom-[7%] left-[1.5%] z-0"
          >
            <Scrap />
          </Float>
          <Float
            {...f}
            depth={1}
            rot={5}
            delay={0.3}
            className="absolute bottom-[4%] right-[1%] z-0 w-40"
          >
            <Snap
              src="/images/Tailwindcss.jpg"
              pos="50% 50%"
              tape="-top-3 left-1/2 -translate-x-1/2"
            />
          </Float>
          <Float
            {...f}
            depth={0.6}
            rot={-8}
            delay={0.35}
            className="absolute left-[3%] top-[47%] z-0"
          >
            <RoundStamp />
          </Float>

          <Float
            {...f}
            depth={1.1}
            rot={3}
            delay={0.4}
            className="absolute right-[4%] top-[40%] z-0 w-36"
          >
            <Snap src="/images/JS2.png" pos="50% 50%" />
          </Float>

          <Float
            {...f}
            depth={0.9}
            rot={-5}
            delay={0.25}
            className="absolute left-[18%] bottom-[2%] z-0 w-44 hidden xl:block"
          >
            <Snap
              src="/images/Figma.jpg"
              pos="50% 50%"
              tape="-top-3 left-1/4"
            />
          </Float>
        </div>

        <Notebook />
      </div>
    </section>
  );
}
