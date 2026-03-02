"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileText, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center bg-white text-slate-900 selection:bg-indigo-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 md:mb-8 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Open to Full-Time Roles
        </motion.div>

        {/* Name & Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 tracking-tight text-slate-900 leading-[1.1]">
            Akash Abhang.
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-4xl text-slate-500 mb-8 md:mb-10 font-semibold leading-snug max-w-3xl">
            Software Engineer specializing in <span className="text-slate-900">Scalable Systems</span> & Distributed Architectures.
          </h2>
        </motion.div>

        {/* Quick Tech Snapshot */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3 mb-10 md:mb-12"
        >
          {["MERN Stack", "Java Spring Boot", "AWS & Cloud"].map((tech, i) => (
            <div key={tech} className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm font-mono text-slate-500">
              <span className="text-indigo-600 font-bold">0{i + 1}</span> {tech}
            </div>
          ))}
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
            {/* Primary CTA */}
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-indigo-600 transition-all px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold shadow-xl shadow-slate-200 text-sm md:text-base">
              View Projects 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Resume Buttons Group */}
            <div className="flex flex-row gap-3 w-full sm:w-auto">
              <a href="/resume.pdf" target="_blank" className="flex-1 sm:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-5 md:px-7 py-3.5 md:py-4 rounded-full font-bold hover:bg-slate-200 transition text-xs md:text-sm">
                  <FileText size={16} /> View CV
                </button>
              </a>

              <a href="/resume.pdf" download className="flex-1 sm:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-900 transition-all px-5 md:px-7 py-3.5 md:py-4 rounded-full font-bold text-slate-700 text-xs md:text-sm">
                  Download
                </button>
              </a>
            </div>
          </div>

          {/* Social Access */}
          <div className="flex gap-6 items-center pt-4 sm:pt-0 sm:border-l sm:border-slate-200 sm:pl-8 w-fit">
            <a href="https://github.com/abhangakash" target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/akash-abhang-a6a29822b" target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}