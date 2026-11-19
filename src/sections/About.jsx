import { Magnetic, Reveal, Tilt, TornEdge } from "../components/ui";

const timeline = [
  ["SDIT", "2017 — 2022"],
  ["SMP", "2023 — 2025"],
  ["SMA", "2026 — 2028"],
];

const About = () => {
  return (
    <section
      id="about"
      data-nav="sun"
      className="bg-sun text-ink min-h-screen pt-12 pb-28 px-6 md:px-12 lg:px-20 font-display relative overflow-hidden"
    >
      {/* Main Editorial Headline */}
      <Reveal y={20}>
        <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-serif leading-[1] mb-12 text-ink tracking-tight border-b-4 border-ink pb-10 uppercase md:pt-13">
          I craft websites & experiences with attention to detail &
          determination.
        </h1>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column - Image (Gaya cetak retro, bayangan solid, border tebal) */}
        <div className="lg:col-span-5 relative">
          <Reveal
            delay={0.15}
            className="w-full flex justify-center lg:justify-start"
          >
            <Tilt className="inline-block w-full max-w-[400px]">
              <div className="relative">
                {/* Offset solid shadow khas 80s */}
                <div className="absolute inset-0 bg-ink translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-3 z-0" />

                <img
                  src="/images/hero-right.jpg"
                  alt="My Profile"
                  className="relative z-10 w-full aspect-[4/5] object-cover border-4 border-ink hover:transition-all duration-500"
                />
              </div>
            </Tilt>
          </Reveal>
        </div>

        {/* Right Column - Text & Experience */}
        <div className="lg:col-span-7 flex flex-col justify-center pt-8 lg:pt-0">
          <Reveal delay={0.1}>
            {/* Penggunaan Drop Cap (Huruf awal besar) bergaya majalah */}
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-ink/90 text-justify font-serif first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:mt-[-8px] first-letter:text-ink">
              I’m a Class 10 student at Pondok Tahfizh Plus IT Abudzar with a
              strong curiosity for web development, UI/UX, and graphic design. I
              love turning ideas into clean, functional websites and visual
              experiments.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl leading-relaxed mb-12 text-ink/90 text-justify font-serif">
              Currently, I’m focused on mastering modern frontend technologies
              while keeping Islamic values at the core of everything I build.
              Every project here is a step in my continuous learning journey.
            </p>
          </Reveal>

          {/* Experience List - Gaya Tabel Indeks/Daftar Isi */}
          <div className="mb-14 w-full border-t-4 border-ink pt-6">
            {timeline.map(([school, years], i) => (
              <Reveal key={school} delay={0.25 + i * 0.1}>
                <div className="flex justify-between items-center border-b-2 border-ink border-dashed px-0 py-3 transition-all duration-300 hover:bg-ink hover:px-4 hover:text-sun group cursor-default">
                  <span className="text-xl font-bold font-serif uppercase">
                    {school}
                  </span>
                  <span className="text-md font-mono tracking-widest group-hover:text-sun text-ink/70">
                    {years}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <div>
            <Magnetic>
              {/* Tombol bergaya kupon retro / brutalism */}
              <a
                href="#skills"
                className="inline-block border-4 border-ink py-4 px-10 uppercase tracking-[0.2em] font-black text-sm hover:bg-ink hover:text-sun transition-all duration-300 shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
              >
                Explore My Skills
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <TornEdge color="var(--color-night)" />
    </section>
  );
};

export default About;
