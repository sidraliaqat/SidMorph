import React, { useState } from 'react';
import { WritingMode } from '../../types';
import { Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const InteractiveDemo: React.FC<{ onOpenEditor: () => void }> = ({ onOpenEditor }) => {
  const [selectedMode, setSelectedMode] = useState<WritingMode>('Academic');

  const demoScenarios: Record<WritingMode, { original: string; morphed: string; rationale: string }> = {
    Academic: {
      original:
        'Researchers found that the proposed model significantly improves accuracy (Vaswani et al., 2017), due to the fact that multi-head attention mechanisms capture long-range token dependencies more effectively.',
      morphed:
        'The empirical findings indicate that the developed architecture achieves substantial gains in predictive accuracy (Vaswani et al., 2017), as multi-head attention mechanisms capture distributed token relationships with greater fidelity.',
      rationale:
        'Preserved citation (Vaswani et al., 2017), restructured causal connector, elevated analytical precision.',
    },
    Research: {
      original:
        'Experiments prove that our system is much faster and reduces latency by 35% compared to standard recurrent methods.',
      morphed:
        'Quantitative benchmarks substantiate that the evaluated implementation achieves a 35% latency reduction relative to baseline recurrent architectures.',
      rationale:
        'Preserved quantitative metric (35%), replaced informal certainty claims with empirical rigor.',
    },
    Technical: {
      original:
        'The server runs the code and handles big batches of data very quickly without crashing.',
      morphed:
        'The system executes concurrent workloads and processes high-throughput data streams with fault-tolerant stability.',
      rationale:
        'Locked architectural terminology, eliminated conversational colloquialisms.',
    },
    Professional: {
      original:
        'We need to change our workflow in order to help the team get more work done each week.',
      morphed:
        'Streamlining our operational workflow will directly facilitate team productivity across weekly delivery cycles.',
      rationale:
        'Eliminated filler phrases, enhanced organizational focus.',
    },
    Natural: {
      original:
        'It is evident that the utilization of automated methods produces consequential outcomes across domains.',
      morphed:
        'Observations show that applying automated methods creates meaningful results across diverse fields.',
      rationale:
        'De-bloated stiff academic jargon for fluid, natural cadence.',
    },
    Simple: {
      original:
        'The epistemological framework delineates substantial divergence in pedagogical methodologies.',
      morphed:
        'The study shows clear differences in how teaching methods are structured.',
      rationale:
        'Translated complex conceptual jargon into accessible, clear prose.',
    },
    Concise: {
      original:
        'At this point in time, in order to address the aforementioned problem, we are conducting a study.',
      morphed:
        'Currently, to resolve this issue, we are investigating the underlying causes.',
      rationale:
        'Pruned 9 redundant tokens without losing key intent.',
    },
  };

  const current = demoScenarios[selectedMode] || demoScenarios.Academic;

  return (
    <section className="py-24 bg-[#563727] text-white border-b border-white/8 relative">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
            Real-Time Transformation Demonstration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            Explore Writing Transformation in Action
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            Select a mode to observe structural re-articulation, citation locking, and semantic verification.
          </p>
        </div>

        {/* Mode Selector Tabs (Interactive filter control - buttons allowed per frontend-design skill) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#372C2E] border border-white/10 rounded-md max-w-2xl mx-auto">
          {(['Academic', 'Research', 'Technical', 'Professional', 'Natural', 'Concise'] as WritingMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedMode === mode
                  ? 'bg-[#D9E48A] text-[#372C2E] font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Comparison Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#372C2E] border border-[#7A431D]/40 rounded-lg p-6 sm:p-8">
          {/* Original Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                Original Draft
              </span>
              <span className="text-xs text-white/40 font-mono">
                {current.original.split(' ').length} words
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans bg-[#563727]/30 p-4 rounded border border-white/5 min-h-[140px]">
              {current.original}
            </p>
            <div className="text-xs text-white/40 space-y-1">
              <span className="block font-medium text-white/60">Observations:</span>
              <p>Contains common formulaic clause structuring and candidate phrasing for refinement.</p>
            </div>
          </div>

          {/* SidMorph Morphed Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9E48A] font-semibold">
                  SidMorph Morphed
                </span>
                <span className="text-xs text-[#D9E48A]/70">· {selectedMode}</span>
              </div>
              <span className="text-xs text-[#D9E48A] font-mono">
                {current.morphed.split(' ').length} words
              </span>
            </div>
            <p className="text-sm sm:text-base text-white leading-relaxed font-sans bg-[#563727]/60 p-4 rounded border border-[#D9E48A]/30 min-h-[140px] shadow-sm">
              {current.morphed}
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <span className="block font-medium text-[#D9E48A]">Verification Highlights:</span>
              <p className="text-white/60">{current.rationale}</p>
            </div>
          </div>
        </div>

        {/* Verification Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#372C2E]/60 border border-white/10 rounded text-center">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-white/50 block">Potential Overlap</span>
            <div className="text-lg font-mono font-semibold text-[#D9E48A] tabular-nums">18% → 4%</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-white/50 block">Meaning Preserved</span>
            <div className="text-lg font-mono font-semibold text-white tabular-nums">97%</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-white/50 block">Key Citations</span>
            <div className="text-lg font-mono font-semibold text-emerald-400 tabular-nums">100% Locked</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-white/50 block">Meaning Drift</span>
            <div className="text-lg font-mono font-semibold text-[#D9E48A] tabular-nums">LOW</div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors shadow-sm"
          >
            <span>Open in Full Workspace Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
