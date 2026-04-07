"use client";

import { useState } from "react";
import Image from "next/image"; // Essential for the image size fix
import { Github, Zap, Code2, Cpu, ImageOff, ChevronRight, ChevronLeft } from "lucide-react";
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

  const nextSlide = () => { setIndex((prev) => (prev + 1) % images.length); setError(false); };
  const prevSlide = () => { setIndex((prev) => (prev - 1 + images.length) % images.length); setError(false); };

  return (
    <div className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center group/slider">
      <AnimatePresence mode="wait">
        {!error ? (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {/* BACKGROUND BLUR - Next.js Image optimized to 100px width for performance */}
            <Image
              src={images[index]}
              alt=""
              fill
              sizes="100px" 
              className="object-cover blur-3xl opacity-30 scale-125 select-none"
              priority={false}
            />

            {/* MAIN IMAGE - Uses 'sizes' to prevent downloading 2500px images on small screens */}
            <Image
              src={images[index]}
              alt={`Project slide ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
              className="relative z-10 object-contain drop-shadow-2xl p-2 md:p-4"
              onError={() => setError(true)}
              priority={projectId === 1}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <ImageOff size={40} />
            <span className="text-xs mt-2 font-mono">Asset Not Found</span>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation - Larger touch targets for mobile (48px) */}
      <button
        onClick={prevSlide}
        className="absolute left-2 z-30 p-3 md:p-2 rounded-full bg-black/40 text-white md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 z-30 p-3 md:p-2 rounded-full bg-black/40 text-white md:opacity-0 md:group-hover/slider:opacity-100 transition-opacity"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots - Easy to tap */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center items-center gap-3 z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setError(false); }}
            className={`transition-all duration-300 rounded-full ${
              i === index ? "w-8 h-2 bg-indigo-500" : "w-2.5 h-2.5 bg-white/40"
            } min-h-[12px] min-w-[12px] md:min-h-0 md:min-w-0`} 
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Projects() {
  return (
    <main id="projects" className="bg-white text-slate-900 py-12 px-4 md:px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[2px] w-8 bg-indigo-600"></span>
            <h2 className="text-indigo-700 font-bold text-xs uppercase tracking-[0.3em]">Technical Portfolio</h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Project <span className="text-slate-500 font-light italic text-3xl md:text-4xl block md:inline">Implementations.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-16 md:gap-24">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row gap-8 lg:gap-16 group"
            >
              {/* Image Side */}
              <div className="w-full lg:w-[55%] relative">
                <div className="absolute -inset-2 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] -z-10 group-hover:bg-indigo-50/50 transition-colors duration-500" />
                <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-lg group-hover:shadow-xl transition-all duration-500">
                  <ImageSlider projectId={project.id} prefix={project.imagePrefix} />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="space-y-5 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${project.tech.includes("Java") ? "bg-orange-100 text-orange-700" : "bg-indigo-100 text-indigo-700"}`}>
                      {project.tech.includes("Java") ? <Cpu size={18} /> : <Code2 size={18} />}
                    </div>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{project.role}</span>
                  </div>
                  
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-700 transition-colors">
                    {project.title}
                  </h4>

                  <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                    {project.description}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Zap size={14} className="text-indigo-600 mt-1.5 flex-shrink-0" />
                        <span className="text-slate-800 text-sm font-medium leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Buttons - Improved touch targets and high contrast */}
                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-indigo-700 transition-all py-2">
                      Live Demo <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all py-2">
                      <Github size={18} /> Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}