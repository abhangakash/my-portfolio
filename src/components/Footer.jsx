"use client";

import { Github, Linkedin, Mail, Phone, FileText, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Professional Identity */}
          <div className="md:col-span-1">
            <h3 className="text-slate-900 font-bold text-xl tracking-tight mb-4">
              Akash Abhang
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Full Stack Developer specializing in high-performance web applications and scalable backend systems.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Open to Opportunities
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#about" className="hover:text-blue-600 transition-colors">About Background</a></li>
              <li><a href="#projects" className="hover:text-blue-600 transition-colors">Portfolio Projects</a></li>
              <li><a href="#skills" className="hover:text-blue-600 transition-colors">Technical Stack</a></li>
              <li><a href="#experience" className="hover:text-blue-600 transition-colors">Work Experience</a></li>
            </ul>
          </div>

          {/* Column 3: Professional Assets */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-6">Professional Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="/resume.pdf" download target="_blank" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <FileText size={16} /> Download Resume
                </a>
              </li>
              <li>
                <a href="https://github.com/abhangakash" target="_blank" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Github size={16} /> GitHub Profile
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/akash-abhang-a6a29822b" target="_blank" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Linkedin size={16} /> LinkedIn Network
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-6">Contact Me</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="mailto:abhangakash222@gmail.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Mail size={16} /> abhangakash222@gmail.com
                </a>
              </li>
              
              <li className="pt-4">
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-slate-900 transition-all uppercase tracking-widest"
                >
                  Back to Top <ArrowUp size={14} />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
          <p>© {new Date().getFullYear()} Akash Abhang • B.E. Information Technology</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Pune, Maharashtra
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Next.js & Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}