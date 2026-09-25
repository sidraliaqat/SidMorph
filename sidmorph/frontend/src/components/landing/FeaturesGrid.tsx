import React from 'react';
import {
  Shuffle,
  Search,
  Activity,
  CheckCircle,
  BookmarkCheck,
  FileText,
  History,
  BarChart,
  Lock,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Shuffle,
      title: 'AI Morph Engine',
      desc: 'Deconstructs sentences and transforms wording across Academic, Research, Technical, and Natural modes while preserving factual claims.',
    },
    {
      icon: Search,
      title: 'Similarity Analysis',
      desc: 'Pinpoints formulaic literature boilerplate, 5-gram token overlap, and repetitive structures with human-readable explanations.',
    },
    {
      icon: Activity,
      title: 'AI Writing Analysis',
      desc: 'Evaluates structural uniformity, burstiness, Type-Token Ratio, and transition distribution with a transparent probabilistic disclaimer.',
    },
    {
      icon: CheckCircle,
      title: 'Semantic Verification Gate',
      desc: 'Verifies numerical data, dates, proper entities, and relationships before changes are shown as approved.',
    },
    {
      icon: BookmarkCheck,
      title: 'Citation Guardian',
      desc: 'Detects APA, MLA, and IEEE references, guarantees citation preservation, and alerts for uncited empirical claims.',
    },
    {
      icon: FileText,
      title: 'Document Processing',
      desc: 'Direct drag-and-drop extraction for PDF, DOCX, and TXT manuscripts with format validation and size checks.',
    },
    {
      icon: History,
      title: 'Version History',
      desc: 'Automated snapshots before major morphs. Compare historical drafts, restore earlier versions, and track progressive refinements.',
    },
    {
      icon: BarChart,
      title: 'Writing Analytics',
      desc: 'Real-time metrics: Flesch Reading Ease, passive voice percentages, sentence complexity, and filler word detection.',
    },
    {
      icon: Lock,
      title: 'Anonymous Workspace',
      desc: 'Zero account or registration requirement. Documents belong to your session workspace with local-first persistence.',
    },
  ];

  return (
    <section className="py-24 bg-[#372C2E] border-b border-white/8 text-white">
      <div className="max-w-5xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
            Comprehensive Scholarly Toolkit
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            Engineered for Editorial Integrity
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            Every component designed to support honest, distinctive, well-attributed academic and professional prose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#563727]/30 border border-white/5 hover:border-[#D9E48A]/30 p-6 rounded space-y-3 transition-colors"
              >
                <div className="w-9 h-9 rounded bg-[#563727] border border-[#7A431D]/50 flex items-center justify-center text-[#D9E48A]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-white font-semibold">{feat.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
