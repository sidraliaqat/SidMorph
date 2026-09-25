import React from 'react';

export const Footer: React.FC<{ onNavigate: (view: 'landing' | 'dashboard' | 'editor' | 'privacy') => void }> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-white/8 bg-[#372C2E] py-12 text-xs text-white/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-white font-semibold tracking-wider">SIDMORPH</span>
              <span className="text-[#D9E48A]">·</span>
              <span className="text-white/60">Rewrite. Refine. Preserve Meaning.</span>
            </div>
            <p className="text-white/40 max-w-lg leading-relaxed">
              An AI-assisted writing transformation, originality analysis, and semantic verification platform.
              Built for researchers, educators, and scholars seeking attribution integrity and independent prose.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white/80 font-medium text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-white/40">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-[#D9E48A] transition-colors">
                  Overview & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#D9E48A] transition-colors">
                  Document Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#D9E48A] transition-colors">
                  Attribution & Detection Ethics
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white/80 font-medium text-xs uppercase tracking-wider">Core Invariant</h4>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Anonymous Workspace model: No passwords, no login, zero tracking. Documents remain scoped to your active session with local-first persistence.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/35">
          <p>© {new Date().getFullYear()} SidMorph. Open Editorial Architecture.</p>
          <p>Similarity scores do not prove plagiarism · AI-likeness estimates do not prove machine authorship.</p>
        </div>
      </div>
    </footer>
  );
};
