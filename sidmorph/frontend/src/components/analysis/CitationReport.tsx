import React from 'react';
import { CitationIntegrityReport } from '../../types';
import { BookmarkCheck, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CitationReportProps {
  report: CitationIntegrityReport;
}

export const CitationReport: React.FC<CitationReportProps> = ({ report }) => {
  return (
    <div className="bg-[#372C2E] border border-[#7A431D]/40 rounded-lg p-6 space-y-6 text-white">
      {/* Title & Core Counts */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-xl font-semibold">CITATION INTEGRITY</h3>
          </div>
          <p className="text-xs text-white/50">
            Automated detection and preservation audit across APA, MLA, IEEE, and numbered styles.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] font-mono uppercase text-white/40 block">Citations Detected</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {report.detectedCount}
            </div>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <span className="text-[11px] font-mono uppercase text-[#D9E48A]/70 block">Preserved</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D9E48A] tabular-nums">
              {report.preservedCount}
            </div>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <span className="text-[11px] font-mono uppercase text-amber-400/80 block">Potential Missing</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
              {report.potentialMissingClaims.length}
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-[#563727]/60 border-l-2 border-[#D9E48A] p-4 rounded-r text-xs text-white/80 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#D9E48A] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Guardian Scope:</strong> Automated citation detection recognizes standard bibliographic formats (e.g. <em>(Smith, 2024)</em>, <em>Vaswani et al. (2017)</em>, <em>[12]</em>). Automated detection is an advisory aid and cannot replace rigorous peer attribution reviews.
        </p>
      </div>

      {/* Detected Citations List */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-white/60">
          Detected Citations ({report.citations.length})
        </span>

        {report.citations.length === 0 ? (
          <div className="p-6 bg-[#563727]/20 border border-dashed border-white/10 rounded text-center text-xs text-white/50">
            No formal citations detected in the manuscript text yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            {report.citations.map((cite) => (
              <div
                key={cite.id}
                className="p-3 bg-[#563727]/30 border border-white/5 rounded flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-white font-medium truncate">
                    {cite.citationText}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-white/50 shrink-0">
                  {cite.citationStyle}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Potential Uncited Claims Alerts */}
      {report.potentialMissingClaims.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Potential Uncited Empirical Assertions ({report.potentialMissingClaims.length})
            </span>
          </div>

          <div className="space-y-3">
            {report.potentialMissingClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-4 bg-amber-950/20 border border-amber-500/20 rounded space-y-2 text-xs"
              >
                <p className="italic text-white/90 font-sans bg-black/20 p-2.5 rounded border border-white/5">
                  "{claim.claimText}"
                </p>
                <p className="text-amber-200/80 leading-relaxed text-[11px]">
                  <strong>Notice:</strong> {claim.reason}
                </p>
                <p className="text-white/50 text-[11px]">
                  <strong>Recommendation:</strong> {claim.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
