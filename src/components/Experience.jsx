"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2, Building2, Code2, Zap } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      company: "Bynaric Systems Pvt. Ltd.",
      role: "Junior Software Developer",
      type: "Full-time",
      duration: "March 2026 – Present",
      location: "Mumbai, India",
      isCurrent: true,
      color: "indigo",
      projects: ["FRA", "MSBTE", "RBTE"],
      description: "Developing core web modules and data management tools for Maharashtra state educational boards and regulatory authorities.",
      achievements: [
        "Developing and maintaining key features for the MSBTE and RBTE student portals to ensure smooth academic workflows.",
        "Contributing to the FRA project by building user-friendly forms and data-grid views for staff.",
        "Implementing responsive frontend components and integrating REST APIs to improve data accuracy across portals.",
        "Optimizing database queries and backend logic to improve system reliability and user response times."
      ],
      skills: ["React.js", "Node.js", "MySQL", "REST APIs", "HTML", "CSS"]
    },
    {
      company: "Bynaric Systems Pvt. Ltd.",
      role: "Software Developer Intern",
      type: "Internship",
      duration: "Nov 2025 – Feb 2026",
      location: "Pune, India",
      isCurrent: false,
      color: "emerald",
      projects: ["Polytechnic MIS", "Maharashtra Nursing Council"],
      description: "Contributed to the development of public sector management systems for nursing and technical education.",
      achievements: [
        "Worked on the student registration and profile modules for the Government Polytechnic MIS.",
        "Developed dashboard components for the Maharashtra Nursing Council to help automate document verification.",
        "Refactored existing code to improve frontend performance and maintainability across different modules.",
        "Collaborated with the QA team to identify and resolve critical UI/UX bugs before project deployment."
      ],
      skills: ["JavaScript", "React", "API Integration", "Git", "UI Design"]
    }
  ];

  return (
    <section id="experience" className="bg-slate-50 py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 border-l-4 border-slate-900 pl-6">
          <h2 className="text-xs font-black tracking-widest text-slate-500 uppercase mb-2">Professional Journey</h2>
          <h3 className="text-4xl font-black text-slate-900">Career <span className="text-indigo-600">Experience.</span></h3>
        </div>

        <div className="flex flex-col gap-8">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden bg-white border-2 rounded-3xl p-6 md:p-10 transition-all duration-300 ${
                exp.isCurrent ? 'border-indigo-600 shadow-xl scale-[1.01]' : 'border-slate-200 opacity-90'
              }`}
            >
              {/* Status Ribbon for Current Role */}
              {exp.isCurrent && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-1 rounded-bl-2xl font-black text-[10px] uppercase tracking-tighter">
                  Current Role
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Basic Info */}
                <div className="lg:w-1/3">
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${exp.isCurrent ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Building2 size={28} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{exp.company}</h4>
                  <div className="flex items-center gap-2 font-bold text-indigo-600 mb-4 uppercase text-xs tracking-wider">
                    <Briefcase size={14} /> {exp.role}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <Calendar size={14} /> {exp.duration}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <MapPin size={14} /> {exp.location}
                    </div>
                  </div>

                  {/* Project Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.projects.map(p => (
                      <span key={p} className={`px-2 py-1 rounded-md text-[10px] font-black border ${exp.isCurrent ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="lg:w-2/3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                  <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {exp.achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${exp.isCurrent ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
                          <Zap size={12} className={exp.isCurrent ? 'text-indigo-600' : 'text-emerald-600'} />
                        </div>
                        <p className="text-slate-700 text-sm font-semibold leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        <Code2 size={10} /> {skill}
                      </span>
                    ))}
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