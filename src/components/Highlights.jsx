"use client";

import { motion } from "framer-motion";
import { Search, GitBranch, Terminal, ShieldCheck, Cpu } from "lucide-react";

export default function Highlights() {
  const readiness = [
    {
      icon: <Search size={22} />,
      title: "Debugging & Optimization",
      desc: "Proficient in using Chrome DevTools and Spring Boot logs to trace bottlenecks. I prioritize writing efficient queries to keep latency low.",
      tag: "Problem Solver"
    },
    {
      icon: <GitBranch size={22} />,
      title: "Team-First Workflow",
      desc: "Experienced with Git branching, PR reviews, and Agile methodologies. Ready to integrate into production sprint cycles immediately.",
      tag: "Agile Ready"
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Secure & Validated Code",
      desc: "Focused on preventing vulnerabilities like SQL injection. I consistently implement server-side validation and JWT-based auth.",
      tag: "Security Minded"
    },
    {
      icon: <Cpu size={22} />,
      title: "Modern Stack Proficiency",
      desc: "Fast learner across the MERN and Spring Boot ecosystems. Capable of switching between Frontend and Backend tasks as needed.",
      tag: "Adaptable"
    },
  ];

  return (
    <section className="bg-white text-slate-900 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl border-l-4 border-indigo-600 pl-6">
           
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Ready to <span className="text-indigo-600">Contribute.</span>
            </h2>
            <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
              Equipped with a production-focused mindset. I specialize in building reliable Java & JavaScript applications that follow industry best practices.
            </p>
          </div>
          <div className="hidden lg:block">
             <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <Terminal className="text-indigo-600 h-10 w-10" />
             </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {readiness.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-500 flex flex-col h-full group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed flex-grow font-medium">
                {item.desc}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}