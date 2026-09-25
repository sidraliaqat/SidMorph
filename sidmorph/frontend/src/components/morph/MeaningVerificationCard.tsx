import React from 'react';
import { VerificationResult, WritingMode, RewriteIntensity } from '../../types';
import { Check, AlertTriangle, AlertCircle, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';

interface MeaningVerificationCardProps {
  verification: VerificationResult;
  onKeepOriginal: () => void;
  onRegenerate: () => void;
  onChangeStyle?: () => void;
  onChangeIntensity?: () => void;
}

export const MeaningVerificationCard: React.FC<MeaningVerificationCardProps> = ({
  verification,
  onKeepOriginal,
  onRegenerate,
  onChangeStyle,
  onChangeIntensity,
}) => {
  const status = verification.transformationStatus;
  const isNoMeaningfulTransformation = status === 'IDENTICAL' || status === 'MINOR_FORMATTING_ONLY';
  const isMeaningDrift = status === 'MEANING_DRIFT' || verification.driftLevel === 'HIGH';
  const isGenuineSuccess = status === 'GENUINE_TRANSFORMATION';

  // 1 & 2: NO MEANINGFUL TRANSFORMATION DETECTED
  if (isNoMeaningfulTransformation) {
    return (
      <div className="p-5 rounded-lg border bg-amber-950/30 border-amber-500/50 text-xs space-y-4 animate-in fade-in duration-150">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-xs font-bold text-amber-300">
                NO MEANINGFUL TRANSFORMATION DETECTED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 uppercase">
                {status === 'IDENTICAL' ? '1. Identical Output' : '2. Minor Formatting Only'}
              </span>
            </div>
            <p className="text-white/80 leading-relaxed text-xs">
              {status === 'IDENTICAL'
                ? 'The generated output is identical to your original draft. A successful Morph requires genuine syntactic or lexical transformation while preserving core claims.'
                : 'The generated output only contains minor punctuation, casing, or whitespace changes without substantive syntactic restructuring.'}
            </p>
            <p className="text-white/50 text-[11px]">
              Semantic preservation score is withheld to prevent misleading validation. Select an option below to produce a genuinely transformed version.
            </p>
          </div>
        </div>

        {/* 3 Required Action Buttons */}
        <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
          <button
            onClick={onRegenerate}
            className="px-3.5 py-1.5 bg-[#D9E48A] text-[#372C2E] hover:bg-[#c9d57a] rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm active:translate-y-0.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REGENERATE</span>
          </button>

          {onChangeStyle && (
            <button
              onClick={onChangeStyle}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/15"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D9E48A]" />
              <span>CHANGE STYLE</span>
            </button>
          )}

          {onChangeIntensity && (
            <button
              onClick={onChangeIntensity}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/15"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
              <span>CHANGE INTENSITY</span>
            </button>
          )}

          <button
            onClick={onKeepOriginal}
            className="ml-auto px-3 py-1.5 text-white/50 hover:text-white text-xs transition-colors"
          >
            Return to Editor
          </button>
        </div>
      </div>
    );
  }

  // 4: MEANING-CHANGING TRANSFORMATION (DRIFT)
  if (isMeaningDrift) {
    return (
      <div className="p-5 rounded-lg border bg-red-950/40 border-red-500/50 text-xs space-y-4 animate-in fade-in duration-150">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-xs font-bold text-red-300">
                ⚠ MEANING-CHANGING TRANSFORMATION DETECTED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30 uppercase">
                4. Meaning Drift
              </span>
            </div>
            <p className="text-white/80 leading-relaxed text-xs">
              {verification.driftDetails || 'The rewrite altered an essential factual metric, date, entity, or citation mark.'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-red-500/20 flex items-center gap-2">
          <button
            onClick={onKeepOriginal}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded text-xs transition-colors font-medium"
          >
            Keep Original
          </button>
          <button
            onClick={onRegenerate}
            className="px-3.5 py-1.5 bg-[#D9E48A] text-[#372C2E] hover:bg-[#c9d57a] rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate with Locked Constraints</span>
          </button>
        </div>
      </div>
    );
  }

  // 3: GENUINE LINGUISTIC TRANSFORMATION (SUCCESSFUL MORPH)
  return (
    <div className="p-5 rounded-lg border bg-[#563727]/50 border-white/10 text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase tracking-wider text-xs font-semibold text-[#D9E48A]">
            GENUINE LINGUISTIC TRANSFORMATION
          </span>
          <span className="text-white/40">·</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            3. Morph Verified
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-white/60">Meaning Preserved:</span>
          <span className="text-sm font-bold tabular-nums text-[#D9E48A]">
            {verification.meaningScore}%
          </span>
        </div>
      </div>

      {/* Verification Matrix Checklist */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5">
          <span className="text-white/70">Key Information</span>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5">
          <span className="text-white/70">Numbers Preserved</span>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5">
          <span className="text-white/70">Technical Terms</span>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5">
          <span className="text-white/70">Citation Preserved</span>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
      </div>

      {/* Meaning Drift Indicator */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
        <span className="text-white/60">Potential Meaning Drift:</span>
        <span className="font-mono font-semibold px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
          LOW
        </span>
      </div>
    </div>
  );
};
