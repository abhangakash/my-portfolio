"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileText, ArrowRight, Download } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const techStack = [
  { label: "MERN Stack",       num: "01" },
  { label: "Java Spring Boot", num: "02" },
  { label: "AWS & Cloud",      num: "03" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[10svh] flex items-center bg-white text-slate-900 selection:bg-indigo-100 overflow-hidden">

      {/* Grid decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">

        {/* Status badge */}
        <motion.div {...fadeUp(0)} className="mb-5 sm:mb-7">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open to Full-Time Roles
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-black tracking-tight leading-[1.05] text-slate-900 mb-3 sm:mb-5"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 6.5rem)' }}
        >
          Akash Abhang.
        </motion.h1>

        {/* Tagline */}
        <motion.h2
          {...fadeUp(0.2)}
          className="font-semibold leading-snug text-slate-500 max-w-2xl mb-7 sm:mb-9"
          style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.9rem)' }}
        >
          Software Engineer specializing in{" "}
          <span className="text-slate-900">Scalable Systems</span> &amp;{" "}
          Distributed Architectures.
        </motion.h2>

        {/* Tech snapshot */}
        <motion.ul
          {...fadeUp(0.3)}
          className="flex flex-wrap gap-x-5 sm:gap-x-8 gap-y-2 mb-8 sm:mb-10 list-none p-0 m-0"
        >
          {techStack.map(({ label, num }) => (
            <li key={label} className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-slate-500">
              <span className="text-indigo-600 font-bold select-none">{num}</span>
              {label}
            </li>
          ))}
        </motion.ul>

        {/* CTA row */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:flex-wrap"
        >
          {/* Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 sm:mr-8">

            <a href="#projects" className="group">
              <button className="w-full xs:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-indigo-600 transition-colors duration-200 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-bold text-sm leading-none shadow-lg shadow-slate-200/70">
                View Projects
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </a>

            <div className="flex gap-2.5">
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex-1 xs:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors duration-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-bold text-xs leading-none">
                  <FileText size={13} strokeWidth={2.2} />
                  View CV
                </button>
              </a>
              <a href="/resume.pdf" download className="flex-1 xs:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 transition-colors duration-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-bold text-xs leading-none">
                  <Download size={13} strokeWidth={2.2} />
                  Download
                </button>
              </a>
            </div>
          </div>

          {/* Vertical divider */}
          <div aria-hidden="true" className="hidden sm:block self-stretch w-px bg-slate-200 mx-1" />

          {/* Social icons */}
          <div className="flex items-center gap-5 sm:pl-7">
            <a
              href="https://github.com/abhangakash"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-slate-400 hover:text-slate-900 transition-colors duration-200"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/akash-abhang-a6a29822b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-slate-900 transition-colors duration-200"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}