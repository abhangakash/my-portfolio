"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Menu, X, FileText } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Background", href: "#about" },
    { name: "Technologies", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${
        scrolled || isOpen ? "bg-white border-b border-slate-200 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center relative">
        
        {/* Logo / Name */}
        <a href="#" className="group z-101" onClick={() => setIsOpen(false)}>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2 uppercase">
            Akash <span className="text-indigo-600 group-hover:translate-x-1 transition-transform italic underline decoration-2 underline-offset-4">Abhang</span>
          </h1>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="h-4 w-1px bg-slate-200 mx-2"></div>

          {/* Desktop Action Icons */}
          <div className="flex items-center gap-5 text-slate-400">
            <a href="https://github.com/abhangakash" target="_blank" className="hover:text-slate-900 transition-colors">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/akash-abhang-a6a29822b" target="_blank" className="hover:text-slate-900 transition-colors">
              <Linkedin size={18} />
            </a>
            <a 
              href="/resume.pdf" 
              target="_blank"
              className="ml-2 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all rounded-sm"
            >
              <FileText size={14} /> CV
            </a>
          </div>
        </div>

        {/* Mobile Toggle Button - Moved to Z-index 101 to stay on top */}
        <button 
          className="md:hidden text-slate-900 z-[101] p-2 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[99] transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full justify-between pt-32 pb-12 px-8">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">Navigation</p>
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="block text-4xl font-black text-slate-900 tracking-tighter hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <a href="https://github.com/abhangakash" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Github size={24} /></a>
              <a href="https://www.linkedin.com/in/akash-abhang-a6a29822b" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Linkedin size={24} /></a>
            </div>
            
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              <FileText size={20} /> View Formal Resume
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}