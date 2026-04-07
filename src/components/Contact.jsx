"use client";

import { Mail, Github, Linkedin, MapPin, Copy, Check, FileText } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "abhangakash222@gmail.com"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="bg-white py-24 px-6 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header - Formal and Direct */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
            Contact & Professional Engagement
          </h2>
          <hr className="w-12 border-2 border-slate-900 mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Column 1: Core Contact Data */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
              
              {/* Email Block */}
              <div className="bg-white p-8">
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <Mail size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Email Address</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">{email}</span>
                  <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-300" />}
                  </button>
                </div>
              </div>

              {/* Location Block */}
              <div className="bg-white p-8">
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <MapPin size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Current Location</span>
                </div>
                <span className="text-lg font-semibold text-slate-900">Pune, Maharashtra, India</span>
              </div>

              {/* LinkedIn Block */}
              <a 
                href="https://www.linkedin.com/in/akash-abhang-a6a29822b" 
                target="_blank" 
                className="bg-white p-8 hover:bg-slate-50 transition-colors block"
              >
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <Linkedin size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Professional Network</span>
                </div>
                <span className="text-lg font-semibold text-slate-900 underline decoration-slate-200 underline-offset-4">
                  linkedin.com/in/akash-abhang
                </span>
              </a>

              {/* GitHub Block */}
              <a 
                href="https://github.com/abhangakash" 
                target="_blank" 
                className="bg-white p-8 hover:bg-slate-50 transition-colors block"
              >
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <Github size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Source Code</span>
                </div>
                <span className="text-lg font-semibold text-slate-900 underline decoration-slate-200 underline-offset-4">
                  github.com/abhangakash
                </span>
              </a>

            </div>
          </div>

          {/* Column 2: Status & Availability */}
          <div className="bg-slate-50 p-8 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
              Recruitment Status
            </h3>
            
            <ul className="space-y-6">
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Availability</span>
                <span className="text-sm font-semibold text-slate-800">Immediate </span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Preferred Roles</span>
                <span className="text-sm font-semibold text-slate-800">SDE-1, Full Stack Developer, Backend Developer, Analyst</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Work Model</span>
                <span className="text-sm font-semibold text-slate-800">On-site / Remote / Hybrid</span>
              </li>
            </ul>

            <a 
              href="/resume.pdf" download target="_blank"
              className="mt-8 flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              <FileText size={16} /> Download Formal CV
            </a>
          </div>

        </div>


      </div>
    </section>
  );
}