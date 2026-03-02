"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2, Building2 } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      company: "Bynaric Systems Pvt. Ltd.",
      role: "Software Developer Intern",
      duration: "Nov 2025 – Present",
      location: "Pune, India",
      description: "Contributing to the development of enterprise-level Management Information Systems (MIS), focusing on data-driven decision tools and scalable full-stack architecture.",
      achievements: [
        "Architected and maintained modular MIS components to streamline business operations and analytics reporting.",
        "Engineered robust backend logic and optimized APIs to ensure seamless data flow across high-availability modules.",
        "Collaborated in an Agile environment to translate complex system requirements into scalable, production-ready software.",
        "Enhanced system performance by analyzing user needs and refactoring legacy data structures for better efficiency."
      ],
      skills: ["Full Stack", "MIS Systems", "API Design", "Database Optimization"]
    }
  ];

  return (
    <section id="experience" className="bg-white py-24 px-6 border-y border-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 border-l-4 border-indigo-600 pl-6">
          <h2 className="text-xs font-black tracking-[0.3em] text-indigo-600 uppercase mb-2">
            Professional Journey
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Work <span className="text-slate-400 font-light italic">Experience.</span>
          </h3>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 group"
            >
              {/* Job Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                <div className="flex gap-5">
                  <div className="hidden sm:flex w-14 h-14 bg-white rounded-2xl border border-slate-200 items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <Briefcase size={14} className="fill-indigo-50" />
                      <span className="font-black uppercase tracking-widest text-[10px]">{exp.role}</span>
                    </div>
                    <h4 className="text-3xl font-bold text-slate-900 tracking-tight">{exp.company}</h4>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end text-slate-500 text-xs font-bold gap-2">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <Calendar size={14} className="text-indigo-500" /> {exp.duration}
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <MapPin size={14} className="text-slate-400" /> {exp.location}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="relative mb-10">
                <p className="text-slate-600 text-lg leading-relaxed font-medium relative z-10">
                  {exp.description}
                </p>
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-100 rounded-full" />
              </div>

              {/* Achievements List */}
              <div className="grid gap-5 mb-10">
                {exp.achievements.map((point, i) => (
                  <div key={i} className="flex items-start gap-4 group/point">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover/point:bg-emerald-500 transition-colors">
                      <CheckCircle2 size={12} className="text-emerald-600 group-hover/point:text-white transition-colors" />
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold text-sm md:text-base">{point}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Used in this Job */}
              <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-200">
                {exp.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}