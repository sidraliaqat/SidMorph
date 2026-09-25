import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CurvedLines } from '../layout/CurvedLines';

export const FinalCTA: React.FC<{ onStartWriting: () => void; onTryDemo: () => void }> = ({
  onStartWriting,
  onTryDemo,
}) => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#372C2E] text-white border-b border-white/8 text-center">
      <CurvedLines />
      <div className="relative max-w-4xl mx-auto px-6 space-y-8">
        <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
          Attribution · Originality · Voice
        </span>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight [text-wrap:balance]">
          Your ideas deserve your own voice.
        </h2>

        <p className="text-white/70 max-w-lg mx-auto text-sm sm:text-base leading-relaxed [text-wrap:balance]">
          Move beyond crude synonym spinners. Transform syntactic clarity, guard scholarly citations, and verify meaning without creating an account.
        </p>

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
      </div>
    </section>
  );
};
