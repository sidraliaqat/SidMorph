import React from 'react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#372C2E] border-b border-white/8 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
              The Fundamental Problem
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-snug [text-wrap:balance]">
              Improving writing is more than replacing words with synonyms.
            </h2>
          </div>

          <div className="md:col-span-7 space-y-6 text-white/70 leading-relaxed text-sm sm:text-base">
            <p>
              Traditional paraphrasing tools operate mechanically: they swap individual tokens with dictionary synonyms.
              In academic, technical, and scientific prose, this creates catastrophic meaning drift—converting domain-specific terminology into nonsense, mutating quantitative values, and stripping vital scholarly attribution.
            </p>
            <p>
              Real writing refinement requires deconstructing sentence logic, identifying the foundational premise, recognizing proper entities, and re-articulating the idea with authentic voice—all while verifying that citations and empirical numbers remain mathematically intact.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 border-t border-white/10 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-red-400 block font-semibold">Synonym Spinners</span>
                <p className="text-white/50">Mangles technical terms, deletes citations, alters quantitative claims.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#D9E48A] block font-semibold">SidMorph Architecture</span>
                <p className="text-white/50">Preserves entities, verifies core claims, guards citation integrity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
