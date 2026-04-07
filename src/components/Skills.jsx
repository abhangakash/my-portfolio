"use client";

import { motion } from "framer-motion";
import { Terminal, Award, ExternalLink, Code2, Layers, Wrench, Globe } from "lucide-react";

export default function Skills() {
  // Directly mapped from your Resume Images
  const expertises = [
    {
      title: "Programming Languages",
      icon: <Code2 size={20} className="text-indigo-600" />,
      description: "Core languages used for building logic, handling data, and styling modern applications.",
      skills: ["Java", "JavaScript", "SQL", "HTML", "CSS", "PHP"]
    },
    {
      title: "Frameworks & Tech",
      icon: <Layers size={20} className="text-indigo-600" />,
      description: "Modern frameworks used to architect scalable backends and interactive user interfaces.",
      skills: ["Spring Boot", "React", "Node.js", "JWT", "REST API", "MERN Stack"]
    },
    {
      title: "Tools & Infrastructure",
      icon: <Wrench size={20} className="text-indigo-600" />,
      description: "Essential development tools for version control, testing, and cloud deployment.",
      skills: ["Git", "Docker", "Postman", "AWS (S3)", "Render", "VS Code", "Eclipse"]
    },
    {
      title: "Databases & OS",
      icon: <Globe size={20} className="text-indigo-600" />,
      description: "Managing data integrity and working across diverse operating environments.",
      skills: ["MySQL", "MongoDB", "Linux", "Relational Design"]
    }
  ];

  const problemSolving = [
    { platform: "LeetCode", solved: "240+", rank: "Top 10%", link: "https://leetcode.com/u/akashabhang/", color: "text-amber-700" },
    { platform: "GeeksforGeeks & Hackerrank", solved: "100+", rank: "Active Solver", link: "https://www.hackerrank.com/profile/iakashabhang", color: "text-green-700" },
    { platform: "Total Solved", solved: "500+", rank: "Across Different Platforms", link: "#", color: "text-orange-700" }
  ];

  return (
    <section id="skills" className="bg-white py-2 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-2">
          <h2 className="text-sm font-black tracking-[0.3em] text-indigo-600 uppercase mb-4">
            Technical Stack
          </h2>
          <h3 className="text-4xl font-black text-slate-900 md:text-5xl lg:max-w-3xl leading-tight">
            Industry tools and <span className="text-indigo-600">algorithmic foundations.</span>
          </h3>
        </div>

        {/* Competency Rows */}
        <div className="divide-y divide-gray-100">
          {expertises.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-12 py-12 gap-8 items-start group"
            >
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-slate-500 leading-relaxed max-w-sm font-medium">
                  {item.description}
                </p>
              </div>
              <div className="md:col-span-7 flex flex-wrap gap-3">
                {item.skills.map((skill) => (
                  <span key={skill} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-500 hover:bg-indigo-50/30 hover:text-indigo-700 transition-all duration-300">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Problem Solving Stats */}
        <div className="mt-2 pt-2 border-t-2 border-dashed border-slate-100">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Terminal size={20} />
            </div>
            <h4 className="text-2xl font-black text-slate-900">Problem Solving Profile</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemSolving.map((plate, i) => (
              <motion.a 
                whileHover={{ y: -5 }}
                href={plate.link} 
                key={i}
                target="_blank"
                className="group p-8 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`font-black text-xs uppercase tracking-widest ${plate.color}`}>{plate.platform}</span>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2">{plate.solved}</div>
                <div className="text-sm text-slate-500 font-bold flex items-center gap-2">
                  <Award size={16} className="text-indigo-600" />
                  {plate.rank}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}