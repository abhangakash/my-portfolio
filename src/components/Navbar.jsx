"use client";

import { useState, useEffect, useCallback } from "react";
import { Github, Linkedin, Menu, X, FileText } from "lucide-react";

const navLinks = [
  { name: "Background", href: "#about" },
  { name: "Technologies", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Main nav bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm py-3"
            : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
<a
  href="#"
  onClick={closeMenu}
  className="group flex-shrink-0 outline-none focus:ring-0 focus:outline-none"
  aria-label="Akash Abhang – home"
>
  <h1 className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 flex items-center gap-1 uppercase">
    Akash{" "}
    <span className="text-indigo-600 italic underline decoration-2 underline-offset-4 group-hover:translate-x-0.5 transition-transform duration-200">
      Abhang
    </span>
  </h1>
</a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-5 lg:gap-7 list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 hover:text-slate-900 transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="w-px h-4 bg-slate-200 flex-shrink-0" />

            {/* Social icons + CV button */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/abhangakash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-400 hover:text-slate-900 transition-colors duration-200"
              >
                <Github size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/akash-abhang-a6a29822b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-400 hover:text-slate-900 transition-colors duration-200"
              >
                <Linkedin size={17} />
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 flex items-center gap-1.5 bg-slate-900 text-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors duration-200 rounded-sm whitespace-nowrap"
              >
                <FileText size={13} />
                CV
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden p-2 -mr-1 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer – slides in from top, sits behind the nav bar */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-white transition-transform duration-400 ease-in-out md:hidden ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Spacer so content starts below the nav bar */}
        <div className="h-16 sm:h-[60px]" />

        <div className="flex flex-col h-[calc(100%-64px)] px-6 sm:px-8 pt-8 pb-10 overflow-y-auto">

          {/* Nav links */}
          <nav className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-5">
              Navigation
            </p>
            <ul className="space-y-1 list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter py-2 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="mt-10 space-y-5">
            <div className="flex gap-3">
              <a
                href="https://github.com/abhangakash"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-200"
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/akash-abhang-a6a29822b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-200"
              >
                <Linkedin size={22} />
              </a>
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2.5 w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-indigo-600 transition-colors duration-200"
            >
              <FileText size={18} />
              View Formal Resume
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop – tapping it closes the menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}