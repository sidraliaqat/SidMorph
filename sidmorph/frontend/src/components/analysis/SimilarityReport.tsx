import React from 'react';
import { SimilarityAnalysis } from '../../types';
import { AlertCircle, FileSearch, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface SimilarityReportProps {
  analysis: SimilarityAnalysis;
  onSelectMatch?: (matchId: string) => void;
}

export const SimilarityReport: React.FC<SimilarityReportProps> = ({ analysis, onSelectMatch }) => {
  return (
    <div className="bg-[#372C2E] border border-[#7A431D]/40 rounded-lg p-6 space-y-6 text-white">
      {/* Title & Core Stat */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-xl font-semibold">ORIGINALITY REVIEW</h3>
          </div>
          <p className="text-xs text-white/50">
            N-gram comparison and academic formulaic overlap analysis.
          </p>
        </div>

        {/* Big Overlap Metrics */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] font-mono uppercase text-white/40 block">Potential Overlap</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
              {analysis.potentialOverlapScore}%
            </div>
          </div>
          <ArrowDownRight className="w-5 h-5 text-white/30 hidden sm:block" />
          <div className="text-right">
            <span className="text-[11px] font-mono uppercase text-[#D9E48A]/70 block">After Approved Rewrites</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D9E48A] tabular-nums">
              {analysis.projectedOverlapAfterRewrite || Math.max(Math.round(analysis.potentialOverlapScore * 0.3), 3)}%
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Scholarly Explanation */}
      <div className="bg-[#563727]/60 border-l-2 border-[#D9E48A] p-4 rounded-r text-xs text-white/80 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#D9E48A] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Definition:</strong> Potential textual overlap measures lexical and syntactic resemblance to established literature patterns and standard academic phrasing. Similarity measurements identify textual resemblance and do not independently determine plagiarism.
        </p>
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-white/60">
            Identified Resemblance Passages ({analysis.matches.length})
          </span>
          <span className="text-[11px] text-white/40 font-mono">
            Click passage to inspect
          </span>
        </div>

        {analysis.matches.length === 0 ? (
          <div className="p-8 bg-[#563727]/20 border border-dashed border-white/10 rounded text-center text-xs text-white/50 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-[#D9E48A] mx-auto" />
            <p>No high-probability textual overlap patterns detected in current manuscript draft.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {analysis.matches.map((match, idx) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch?.(match.id)}
                className="p-4 bg-[#563727]/30 border border-white/10 hover:border-[#D9E48A]/40 rounded transition-all space-y-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#D9E48A] font-semibold">
                      Match {idx + 1}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/70 text-[11px]">{match.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-white/40">Resemblance:</span>
                    <span className="font-semibold text-amber-300 tabular-nums">
                      {Math.round(match.similarity * 100)}%
                    </span>
                    <span className="text-white/40">({match.confidence} Conf.)</span>
                  </div>
                </div>

                <p className="text-xs text-white/80 font-sans italic bg-black/20 p-2.5 rounded border border-white/5">
                  "{match.text}"
                </p>

                <p className="text-[11px] text-white/50 leading-relaxed">
                  <strong className="text-white/70 font-normal">Reason:</strong> {match.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
