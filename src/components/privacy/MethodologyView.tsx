import React from 'react';
import { ShieldCheck, BookOpen, AlertTriangle, Layers, Cpu, HardDrive } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-white space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D9E48A]">
          <span>Transparency & Scholarly Ethics</span>
          <span aria-hidden="true">·</span>
          <span>Methodological Disclosure</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
          ATTRIBUTION INTEGRITY & SCIENTIFIC METHODOLOGY
        </h1>
        <p className="text-white/70 max-w-2xl text-sm sm:text-base leading-relaxed">
          SidMorph is engineered as an honest originality assistant, not a cheating or evasion system. 
          Here we disclose the mathematical foundations and ethical boundaries governing our platform.
        </p>
      </div>

      {/* Principle 1: Product Positioning & Anti-Evasion */}
      <section className="bg-[#563727]/30 border border-white/10 rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-[#D9E48A]">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-serif text-2xl font-semibold">1. Scholarly Positioning & Ethical Boundaries</h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          SidMorph does not market itself as "Beat Turnitin", "Bypass AI Detectors", or "0% Plagiarism Guaranteed". 
          Automated writing analysis exists solely to help authors identify formulaic boilerplate, understand sentence rhythm, 
          verify factual preservation, and maintain precise citations.
        </p>
        <div className="p-4 bg-black/20 rounded border border-white/5 text-xs text-white/70 space-y-2">
          <strong className="text-white block font-mono uppercase">Key Invariant:</strong>
          <p>
            A similarity score is never presented as definitive proof of plagiarism. Similarity measurements simply identify textual resemblance to published or formulaic sequences. Similarly, AI detection scores provide statistical estimates, not definitive proof of authorship.
          </p>
        </div>
      </section>

      {/* Principle 2: Similarity Methodology */}
      <section className="bg-[#563727]/30 border border-white/10 rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-[#D9E48A]">
          <Layers className="w-5 h-5" />
          <h2 className="font-serif text-2xl font-semibold">2. Potential Textual Overlap Pipeline</h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Our originality engine decomposes submitted manuscripts into contiguous 3-grams, 4-grams, and 5-grams. 
          Passages are evaluated against a benchmark corpus of ubiquitous academic formulaic phrasing (e.g., <em>"in recent years, there has been an increasing interest in"</em>) and scanned for internal structural mirroring.
        </p>
        <ul className="list-disc list-inside text-xs text-white/70 space-y-1 pl-2">
          <li><strong>Lexical n-gram matching:</strong> Identifies consecutive verbatim phrase sequences.</li>
          <li><strong>Structural Paraphrase detection:</strong> Measures Jaccard token set similarity across sentences.</li>
          <li><strong>Formulaic Transition clustering:</strong> Flags standard literature boilerplate that inflates similarity indexes without adding substantive intellectual value.</li>
        </ul>
      </section>

      {/* Principle 3: AI Writing Analysis */}
      <section className="bg-[#563727]/30 border border-white/10 rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-[#D9E48A]">
          <Cpu className="w-5 h-5" />
          <h2 className="font-serif text-2xl font-semibold">3. AI-Writing Analysis & Linguistic Feature Extraction</h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Instead of relying blindly on single-prompt black-box LLM queries, SidMorph evaluates statistical and distributional features:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-black/20 rounded border border-white/5 space-y-1">
            <span className="font-mono text-[#D9E48A] block font-semibold">Sentence Length Variance (CV)</span>
            <p className="text-white/60">
              Human writing exhibits natural burstiness (alternating short and complex clauses). Synthetic prose concentrates heavily in uniform 18–24 word lengths with low coefficient of variation.
            </p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-white/5 space-y-1">
            <span className="font-mono text-[#D9E48A] block font-semibold">Root Type-Token Ratio (RTTR)</span>
            <p className="text-white/60">
              Measures lexical entropy and vocabulary diversity across paragraphs to identify synthetic repetition loops.
            </p>
          </div>
        </div>
      </section>

      {/* Principle 4: Anonymous Workspace */}
      <section className="bg-[#563727]/30 border border-white/10 rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-[#D9E48A]">
          <HardDrive className="w-5 h-5" />
          <h2 className="font-serif text-2xl font-semibold">4. Anonymous Workspace Architecture</h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          SidMorph requires no account registration, login, email verification, or password storage. 
          Workspaces are generated client-side and saved with cryptographic identifiers in your browser's local storage.
        </p>
        <p className="text-xs text-white/60 leading-relaxed">
          All document modifications, versions, and analyses remain linked solely to your session workspace. You can export your final manuscripts at any time or delete your records entirely with a single click.
        </p>
      </section>
    </div>
  );
};
