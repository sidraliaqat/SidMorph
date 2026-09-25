import React from 'react';
import { Search, Shuffle, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DETECT',
      desc: 'Identify potentially overlapping phrasing, formulaic boilerplate, and indicators associated with synthetic writing.',
      icon: Search,
      highlight: 'Textual Overlap & AI Indicators',
    },
    {
      num: '02',
      title: 'MORPH',
      desc: 'Transform syntactic structure, rhythm, and tone according to selected academic or professional modes while locking core entities.',
      icon: Shuffle,
      highlight: 'Deep Syntactic Reconstruction',
    },
    {
      num: '03',
      title: 'VERIFY',
      desc: 'Execute automated semantic verification: confirm factual consistency, verify quantitative values, and audit citation preservation.',
      icon: CheckCircle2,
      highlight: 'Semantic & Citation Quality Gate',
    },
  ];

  return (
    <section className="py-24 bg-[#563727] text-white border-b border-white/8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
            The Three-Stage Engine
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            DETECT <span className="text-[#D9E48A] mx-2">→</span> MORPH <span className="text-[#D9E48A] mx-2">→</span> VERIFY
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            A closed-loop pipeline ensuring every transformation is verified before it reaches your manuscript.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#372C2E]/60 border border-[#7A431D]/40 p-8 rounded space-y-5 relative group hover:border-[#D9E48A]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-[#D9E48A]/80 tracking-tighter">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded bg-[#563727] border border-white/10 flex items-center justify-center text-[#D9E48A]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-white font-semibold tracking-wide">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#D9E48A] block">
                    {step.highlight}
                  </span>
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
