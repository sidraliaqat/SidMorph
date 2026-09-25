import React from 'react';
import { AlertCircle, Sliders, Activity, Sparkles, BarChart2 } from 'lucide-react';

export const AIDetectionSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#372C2E] border-b border-white/8 text-white">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-mono text-[#D9E48A] uppercase tracking-widest">
            Responsible Linguistic Analysis
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium leading-snug">
            AI-Writing Analysis Built on Measurable Linguistic Features
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            SidMorph evaluates statistical burstiness, sentence length distribution, vocabulary entropy, and transition uniformity rather than generating arbitrary black-box scores.
          </p>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="bg-[#563727]/80 border-l-2 border-[#D9E48A] p-5 rounded-r text-xs text-white/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D9E48A] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white block">Methodological Notice & Ethics Policy</span>
            <p className="leading-relaxed text-white/70">
              AI-writing analysis provides a probabilistic estimate of stylistic indicators and may produce false positives and false negatives. 
              SidMorph does not market detection as definitive proof of machine authorship, nor does it provide evasion tools. 
              Our analysis exists to help authors understand rhythm, reduce formulaic prose, and cultivate distinctive personal voice.
            </p>
          </div>
        </div>

        {/* Features Evaluated */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#563727]/40 border border-white/5 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <Activity className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Sentence Uniformity</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Calculates the coefficient of variation (CV) in clause length. Machine-generated prose frequently defaults to uniform 18-24 word sentences.
            </p>
          </div>

          <div className="bg-[#563727]/40 border border-white/5 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <BarChart2 className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Vocabulary Entropy</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Analyzes Root Type-Token Ratio (RTTR) across paragraphs to measure lexical diversity against scholarly corpora.
            </p>
          </div>

          <div className="bg-[#563727]/40 border border-white/5 p-6 rounded space-y-3">
            <div className="flex items-center gap-2 text-[#D9E48A]">
              <Sliders className="w-4 h-4" />
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Discourse Predictability</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Detects overuse of formulaic connective markers ("tapestry", "pivotal role", "serves as a testament") characteristic of early LLM defaults.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
