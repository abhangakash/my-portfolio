"use client";

import { GitHubCalendar } from "react-github-calendar";
import { Github, ExternalLink, Code2 } from "lucide-react";

export default function GithubActivity() {
  // Use a theme that matches your site's professional indigo/slate palette
  const theme = {
    light: ['#f1f5f9', '#6366f1'],
    dark: ['#1e293b', '#6366f1'],
  };

  return (
    <section className="bg-[#020617] text-white py-24 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-mono text-indigo-400 mb-2 uppercase tracking-widest italic font-bold">
              // Open Source & Activity
            </h2>
            <h3 className="text-4xl font-bold">
              Committed to <span className="text-slate-500 underline decoration-indigo-500/50">Shipping Code.</span>
            </h3>
          </div>
          <p className="text-gray-400 text-sm max-w-[300px] border-l border-indigo-500/30 pl-4">
            A real-time snapshot of my GitHub contributions, showcasing consistency in building and maintaining software.
          </p>
        </div>

        {/* Calendar Container with Professional Styling */}
        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Code2 size={20} />
            </div>
            <span className="font-semibold text-slate-300">Contribution Graph</span>
          </div>

          <div className="flex justify-center overflow-x-auto pb-4 scrollbar-hide">
            <GitHubCalendar 
              username="abhangakash" // Fixed: Applied your username
              blockSize={14}
              blockMargin={5}
              fontSize={14}
              theme={theme}
              style={{
                color: '#94a3b8',
              }}
            />
          </div>
          
          {/* Quick Stats Summary */}
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-wrap gap-10">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">Active</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Status</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">Public</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Repositories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">Daily</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Commits</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 flex justify-center">
          <a
            href="https://github.com/abhangakash"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-300 font-bold"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform" />
            Explore Full Profile
            <ExternalLink size={16} className="opacity-50" />
          </a>
        </div>

      </div>
    </section>
  );
}