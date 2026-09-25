import React from 'react';
import { AIAnalysis } from '../../types';
import { AlertTriangle, Activity, Sliders, BarChart2, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface AIDetectionReportProps {
  analysis: AIAnalysis;
  onSelectParagraph?: (index: number) => void;
  onTransformToHuman?: (paragraphText?: string) => void;
}

export const AIDetectionReport: React.FC<AIDetectionReportProps> = ({
  analysis,
  onSelectParagraph,
  onTransformToHuman,
}) => {
  return (
    <div className="bg-[#372C2E] border border-[#7A431D]/40 rounded-lg p-6 space-y-6 text-white">
      {/* Title & Core AI Likeness Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-xl font-semibold">AI WRITING ANALYSIS</h3>
          </div>
          <p className="text-xs text-white/50">
            Statistical burstiness, sentence uniformity, and discourse entropy evaluation.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] font-mono uppercase text-white/40 block">AI-Likeness Estimate</span>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums ${
              analysis.aiLikeness > 65 ? 'text-amber-400' : analysis.aiLikeness > 35 ? 'text-[#D9E48A]' : 'text-emerald-400'
            }`}>
              {analysis.aiLikeness}%
            </div>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <span className="text-[11px] font-mono uppercase text-white/40 block">Confidence</span>
            <div className="text-sm font-mono font-semibold text-white/80 uppercase">
              {analysis.confidence}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Humanization & Correction Call-to-Action */}
      {onTransformToHuman && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-[#563727] to-[#7A431D]/40 border border-[#D9E48A]/40 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9E48A]" />
              <span className="font-serif text-sm font-semibold text-white">
                Correct AI-Likeness & Humanize Cadence
              </span>
            </div>
            <p className="text-xs text-white/70">
              Eliminate synthetic discourse markers, break uniform sentence lengths, and reconstruct authentic human rhythm.
            </p>
          </div>
          <button
            onClick={() => onTransformToHuman()}
            className="px-4 py-2 bg-[#D9E48A] text-[#372C2E] hover:bg-[#c9d57a] rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm active:translate-y-0.5 transition-all"
          >
            <span>Morph & Humanize Draft</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mandatory Prominent Transparency Notice */}
      <div className="bg-[#563727]/70 border-l-2 border-[#D9E48A] p-4 rounded-r text-xs text-white/80 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#D9E48A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold block text-white">Probabilistic Methodology Disclaimer</span>
          <p className="text-white/70 leading-relaxed">
            {analysis.disclaimer}
          </p>
        </div>
      </div>

      {/* 5 Core Linguistic Indicators Grid */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-white/60">
          Detected Stylistic Characteristics
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-[#563727]/30 border border-white/5 rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Sentence Uniformity</span>
            <div className={`text-xs font-mono font-semibold ${
              analysis.indicators.sentenceUniformity === 'High' ? 'text-amber-400' : 'text-white'
            }`}>
              {analysis.indicators.sentenceUniformity}
            </div>
          </div>

          <div className="p-3 bg-[#563727]/30 border border-white/5 rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Predictability</span>
            <div className={`text-xs font-mono font-semibold ${
              analysis.indicators.predictability === 'High' ? 'text-amber-400' : 'text-white'
            }`}>
              {analysis.indicators.predictability}
            </div>
          </div>

          <div className="p-3 bg-[#563727]/30 border border-white/5 rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Vocab Diversity</span>
            <div className={`text-xs font-mono font-semibold ${
              analysis.indicators.vocabularyVariation === 'Low' ? 'text-amber-400' : 'text-white'
            }`}>
              {analysis.indicators.vocabularyVariation}
            </div>
          </div>

          <div className="p-3 bg-[#563727]/30 border border-white/5 rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Structural Repetition</span>
            <div className={`text-xs font-mono font-semibold ${
              analysis.indicators.structuralRepetition === 'High' ? 'text-amber-400' : 'text-white'
            }`}>
              {analysis.indicators.structuralRepetition}
            </div>
          </div>

          <div className="p-3 bg-[#563727]/30 border border-white/5 rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-white/40 block">Stylistic Variation</span>
            <div className={`text-xs font-mono font-semibold ${
              analysis.indicators.stylisticVariation === 'Low' ? 'text-amber-400' : 'text-white'
            }`}>
              {analysis.indicators.stylisticVariation}
            </div>
          </div>
        </div>
      </div>

      {/* Paragraph-Level Analysis Breakdown */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono uppercase tracking-wider text-white/60">
          Paragraph-Level Analysis Review
        </span>

        {analysis.paragraphs.length === 0 ? (
          <div className="p-6 bg-[#563727]/20 border border-dashed border-white/10 rounded text-center text-xs text-white/50">
            Write or paste a longer paragraph to display section-by-section breakdown.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {analysis.paragraphs.map((p) => (
              <div
                key={p.index}
                onClick={() => onSelectParagraph?.(p.index)}
                className="p-4 bg-[#563727]/30 border border-white/10 hover:border-[#D9E48A]/40 rounded transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#D9E48A] font-semibold">
                      Paragraph {p.index}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-white/40">AI-Likeness:</span>
                    <span className={`font-semibold ${
                      p.aiLikeness === 'High' ? 'text-amber-400' : p.aiLikeness === 'Medium' ? 'text-[#D9E48A]' : 'text-emerald-400'
                    }`}>
                      {p.aiLikeness} ({p.score}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/70 italic bg-black/20 p-2.5 rounded border border-white/5 line-clamp-2">
                  "{p.text}"
                </p>

                <p className="text-[11px] text-white/50 leading-relaxed">
                  <strong className="text-white/70 font-normal">Reason:</strong> {p.reason}
                </p>

                {onTransformToHuman && p.score > 30 && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransformToHuman(p.text);
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#D9E48A] hover:bg-white/10 rounded transition-colors flex items-center gap-1 border border-[#D9E48A]/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Humanize this paragraph</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
