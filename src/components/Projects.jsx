"use client";

import { useState } from "react";
import { Github, ExternalLink, Zap, Code2, Cpu, ImageOff, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "BookXchanger – Hybrid Marketplace",
    role: "Full Stack Development & ML Integration",
    imagePrefix: "bookx", 
    description: "Engineered a scalable peer-to-peer ecosystem for book commerce. Developed a hybrid rental/sale model integrated with an ML-driven price prediction engine.",
    features: [
      "Flask-based ML model for dynamic price estimation.",
      "End-to-end user lifecycle with secure AWS S3 storage.",
      "Admin Dashboard for listing moderation.",
    ],
    tech: ["React", "Node.js", "Flask", "AWS S3", "MongoDB"],
    github: "https://github.com/abhangakash/BookExchanger",
    live: "https://www.bookxchanger.shop",
  },
  {
    id: 2,
    title: "Enterprise PDF Invoice Engine",
    role: "Java Backend Engineering",
    imagePrefix: "invoice",
    description: "Architected a high-performance Spring Boot service for automated document generation focusing on multi-threaded processing and data integrity.",
    features: [
      "Spring Boot & JasperReports for dynamic generation.",
      "PostgreSQL schema design with JPA/Hibernate.",
      "RESTful APIs with centralized exception handling.",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Hibernate", "Maven"],
    github: "#",
    live: "#",
  },
  {
    id: 3,
    title: "EduStream – Learning Portal",
    role: "Full Stack Architecture",
    imagePrefix: "edu",
    description: "Developed a dual-module MERN platform featuring independent public and administrative ecosystems optimized for media delivery.",
    features: [
      "AWS S3 integration for secure media storage.",
      "Modular UI library with reusable React components.",
      "Streamlined data pipelines via Redux management.",
    ],
    tech: ["MERN Stack", "Redux", "AWS S3", "Tailwind CSS"],
    github: "https://github.com/abhangakash/fullstackproject",
    live: "https://www.abhang.site/",
  },
];

const ImageSlider = ({ projectId, prefix }) => {
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);

  const images = [1, 2, 3, 4, 5].map((n) => `/project/project${projectId}/${prefix}${n}.webp`);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
    setError(false);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setError(false);
  };

  return (
    <div className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center group/slider">
      <AnimatePresence mode="wait">
        {!error ? (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Background Blur for different aspect ratios */}
            <img
              src={images[index]}
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-125 select-none"
              alt=""
            />

            {/* Main Project Image - object-contain prevents cropping your 357x562 image */}
            <img
              src={images[index]}
              className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl"
              onError={() => setError(true)}
              alt={`Slide ${index + 1}`}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-slate-600">
            <ImageOff size={40} />
            <span className="text-[10px] mt-2 font-mono">Asset Not Found</span>
          </div>
        )}
      </AnimatePresence>
      
      {/* Side Navigation Arrows (Appear on hover) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 z-30 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/40"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 z-30 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/40"
      >
        <ChevronRight size={20} />
      </button>

      {/* Manual Dots Control */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center items-center gap-3 z-30">
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => { setIndex(i); setError(false); }}
            className={`transition-all duration-300 rounded-full border border-white/20 ${
              i === index ? "w-8 h-2 bg-indigo-500" : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Projects() {
  return (
    <section id="projects" className="bg-white text-slate-900 py-5 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[2px] w-8 bg-indigo-600"></span>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">Technical Portfolio</h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Project <span className="text-slate-400 font-light italic text-3xl md:text-4xl text-nowrap">Implementations.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row gap-12 lg:gap-20 group"
            >
              <div className="lg:w-[55%] relative">
                <div className="absolute -inset-2 bg-slate-50 rounded-[2rem] -z-10 group-hover:bg-indigo-50/50 transition-colors duration-500" />
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <ImageSlider projectId={project.id} prefix={project.imagePrefix} />
                </div>
              </div>

              <div className="lg:w-[45%] flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    {project.tech.includes("Java") ? (
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Cpu size={18} /></div>
                    ) : (
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Code2 size={18} /></div>
                    )}
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{project.role}</span>
                  </div>
                  
                  <h4 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h4>

                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    {project.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    {project.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Zap size={14} className="text-indigo-500 mt-1.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm font-semibold leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
                    <a href={project.live} target="_blank" className="group/link flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-900 hover:text-indigo-600 transition-all">
                      Live Deployment <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                    <a href={project.github} target="_blank" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-all">
                      <Github size={16} /> Source Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}