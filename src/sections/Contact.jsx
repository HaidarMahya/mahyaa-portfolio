"use client";

import React from "react";

const socialLinks = [
  { id: "01", name: "TWITTER [X]", href: "#" },
  { id: "02", name: "LINKEDIN", href: "#" },
  { id: "03", name: "SAVEE", href: "#" },
  { id: "04", name: "INSTAGRAM", href: "#" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      data-nav="light"
      className="relative bg-cream text-ink pt-12 pb-0 overflow-hidden min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20"
    >
      {/* Kontainer Tengah: Email & Social Links */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full mt-6 md:mt-10">
        {/* Kolom Kiri: Email */}
        <div className="flex flex-col gap-4">
          <p className="text-ink font-mono font-bold uppercase tracking-[0.2em] text-sm mb-2">
            // Let's collaborate
          </p>
          <a
            href="mailto:haidar@student.abudzar.sch.id"
            className="group inline-flex border-4 border-transparent hover:border-ink hover:bg-ink hover:text-cream px-2 -ml-2 transition-colors duration-300"
          >
            <span className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-tight py-2 flex items-center gap-4">
              <span className="font-mono text-xl md:text-3xl transition-transform group-hover:translate-x-2">
                ↳
              </span>
              haidar@student.abudzar.sch.id
            </span>
          </a>
        </div>

        {/* Kolom Kanan: Social Links (Gaya Indeks Direktori) */}
        <div className="w-full lg:max-w-md ml-auto border-t-4 border-ink pt-4">
          <ul className="flex flex-col">
            {socialLinks.map((link) => (
              <li
                key={link.id}
                className="border-b-2 border-ink border-dashed group"
              >
                <a
                  href={link.href}
                  className="flex items-center justify-between py-4 px-2 transition-all duration-300 hover:bg-ink hover:text-cream"
                >
                  <span className="font-mono text-xs md:text-sm w-12 tracking-widest font-bold">
                    [{link.id}]
                  </span>
                  <span className="font-serif text-xl md:text-2xl uppercase tracking-wider font-bold">
                    {link.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Kontainer Bawah: Teks "CONNECT" Raksasa */}
      <div className="relative z-10 w-full flex justify-center items-end mt-20 md:mt-auto">
        <h1
          className="font-serif uppercase text-[28vw] md:text-[20vw] leading-[0.75] text-ink tracking-tighter whitespace-nowrap select-none"
          aria-label="Connect"
        >
          {"Connect"
            .toUpperCase()
            .split("")
            .map((c, i) => (
              <span
                key={i}
                aria-hidden
                // Mengubah hover effect menjadi brutalism (offset bayangan kaku bukan rotasi halus)
                className="inline-block cursor-default transition-all duration-300 hover:-translate-y-[1vw] hover:-translate-x-[1vw] hover:text-sun hover:font-bold"
              >
                {c}
              </span>
            ))}
        </h1>
      </div>
    </footer>
  );
}
