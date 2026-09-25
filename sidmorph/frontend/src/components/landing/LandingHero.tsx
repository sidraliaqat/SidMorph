import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { CurvedLines } from '../layout/CurvedLines';

interface LandingHeroProps {
  onStartWriting: () => void;
  onTryDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartWriting, onTryDemo }) => {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-[#563727] text-white border-b border-white/10 grain-overlay">
      <CurvedLines />

      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8">
        {/* Editorial Subheader Kicker - Zero-Pill text */}
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-[#D9E48A] uppercase font-mono">
          <span>Attribution Integrity</span>
          <span aria-hidden="true">·</span>
          <span>Semantic Consistency</span>
          <span aria-hidden="true">·</span>
          <span>Anonymous Workspace</span>
        </div>

        {/* Primary Hero Statement */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white leading-[1.05] max-w-4xl mx-auto [text-wrap:balance]">
          YOUR WORDS. <br />
          <span className="italic font-light text-[#D9E48A]">A BETTER FORM.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed [text-wrap:balance]">
          Transform academic and professional writing while preserving meaning, citations, and your original voice.
        </p>

        {/* CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartWriting}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold tracking-wide text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group active:translate-y-0.5"
          >
            <span>START WRITING</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-medium text-white hover:text-white hover:bg-white/10 border border-white/20 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D9E48A]" />
            <span>TRY DEMO</span>
          </button>
        </div>

        {/* Trust & Ethics Micro-bar */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 border-t border-white/10 max-w-xl mx-auto">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9E48A]" />
            No registration or account required
          </span>
          <span aria-hidden="true">·</span>
          <span>Zero plagiarism-bypass marketing</span>
          <span aria-hidden="true">·</span>
          <span>Preserves APA, MLA & IEEE citations</span>
        </div>
      </div>
    </section>
  );
};
