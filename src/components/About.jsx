"use client";

import { motion } from "framer-motion";
import { GraduationCap, Code2, Rocket, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="bg-white text-slate-900 py-16 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.4em] mb-4">
              The Professional
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Engineering with <span className="text-indigo-600 italic">Purpose.</span>
            </h3>
          </div>
          <div className="text-slate-400 font-mono text-sm hidden md:block">
            Based in Pune, India
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Bio & Impact */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                I am a <strong className="text-slate-900 font-bold">Full Stack Software Engineer</strong> with a foundation in Information Technology and a passion for building scalable digital infrastructure.
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                My engineering approach is defined by <strong className="text-indigo-600">Algorithmic Rigor</strong>. Having solved over <span className="font-bold text-slate-900">500+ data structure problems</span>, I possess a sharp eye for code efficiency and system optimization. 
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                I specialize in the <span className="text-slate-900 font-semibold">MERN Stack</span> and <span className="text-slate-900 font-semibold">Java Spring Boot</span>, focusing on creating secure, high-availability backends that power seamless user experiences.
              </p>
            </div>

            {/* Core Values for Recruiters */}
            <div className="grid sm:grid-cols-2 gap-8 pt-6">
              {[
                {
                  title: "Logic Driven",
                  desc: "Strong grasp of DS & Algo for writing performant, clean code.",
                  icon: <BrainCircuit size={20} />
                },
                {
                  title: "Full-Cycle Dev",
                  desc: "Experienced from database modeling to responsive UI deployment.",
                  icon: <Rocket size={20} />
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Education & Knowledge Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <GraduationCap className="text-indigo-600" size={24} />
                </div>
                <h4 className="text-xl font-black text-slate-900">Education</h4>
              </div>

              <div className="space-y-8">
                <div className="relative pl-6 border-l-2 border-indigo-200">
                  <div className="absolute -left-[7px] top-0 w-[12px] h-[12px] rounded-full bg-indigo-600 border-2 border-white" />
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Bachelor of Engineering</p>
                  <h5 className="font-bold text-slate-900 text-lg leading-tight">Information Technology (2025) </h5>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Sinhgad College of Engineering, Pune</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-indigo-700 bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100">
                    <CheckCircle2 size={14} />
                    <span className="font-bold text-xs uppercase">CGPA: 7.88</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Code2 size={14} /> Fundamental Domains
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Data Structures", 
                      "DBMS", 
                      "Cloud Computing", 
                      "OS", 
                      "Software Architecture"
                    ].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-white text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}