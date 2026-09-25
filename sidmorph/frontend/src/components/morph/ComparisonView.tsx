import React, { useState, useMemo } from 'react';
import { RewriteIntensity, RewriteResult, WritingMode } from '../../types';
import { Check, X, CheckCheck, RefreshCw, ArrowLeft, Sparkles, SlidersHorizontal, AlertCircle, Activity } from 'lucide-react';
import { MeaningVerificationCard } from './MeaningVerificationCard';
import { detectAIWriting } from '../../lib/nlp/aiDetector';
import confetti from 'canvas-confetti';

interface ComparisonViewProps {
  onAcceptAll: (finalText: string) => void;
  onRejectAll: () => void;
  onRegenerate: () => void;
  onChangeStyle?: (mode: WritingMode) => void;
  onChangeIntensity?: (intensity: RewriteIntensity) => void;
  rewriteResult: RewriteResult;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  rewriteResult,
  onAcceptAll,
  onRejectAll,
  onRegenerate,
  onChangeStyle,
  onChangeIntensity,
}) => {
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showIntensityPicker, setShowIntensityPicker] = useState(false);

  // Compute live AI likeness metrics for both original and transformed drafts
  const origAI = useMemo(() => detectAIWriting(rewriteResult.originalText), [rewriteResult.originalText]);
  const rewAI = useMemo(() => detectAIWriting(rewriteResult.rewrittenText), [rewriteResult.rewrittenText]);

  const status = rewriteResult.transformationStatus || rewriteResult.verification.transformationStatus;
  const isNoMeaningfulTransformation = status === 'IDENTICAL' || status === 'MINOR_FORMATTING_ONLY';
  const isGenuineTransformation = status === 'GENUINE_TRANSFORMATION';

  // Track accepted state for each individual change
  const [changeStates, setChangeStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    rewriteResult.changes.forEach((c) => {
      initial[c.id] = c.accepted !== false;
    });
    return initial;
  });

  const toggleChange = (id: string, accept: boolean) => {
    setChangeStates((prev) => ({ ...prev, [id]: accept }));
  };

  const handleApplyAll = () => {
    if (isNoMeaningfulTransformation) return;
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D9E48A', '#FFFFFF', '#7A431D'],
      });
    } catch {
      // Confetti fallback
    }
    onAcceptAll(rewriteResult.rewrittenText);
  };

  return (
    <div className="bg-[#372C2E] border border-[#7A431D]/40 rounded-lg p-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onRejectAll}
            className="p-1.5 text-white/50 hover:text-white rounded hover:bg-white/5 transition-colors"
            title="Cancel and return to editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-white font-semibold">
                BEFORE / AFTER COMPARISON
              </h3>
              {isGenuineTransformation ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                  3. Genuine Transformation
                </span>
              ) : isNoMeaningfulTransformation ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                  No Transformation Detected
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/30 uppercase font-semibold">
                  4. Meaning Drift
                </span>
              )}
            </div>
            <p className="text-xs text-white/50 font-mono">
              Current Settings: Mode: {rewriteResult.mode} · Intensity: {rewriteResult.intensity}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRejectAll}
            className="px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/15 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyAll}
            disabled={isNoMeaningfulTransformation}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-sm active:translate-y-0.5 ${
              isNoMeaningfulTransformation
                ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                : 'text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a]'
            }`}
            title={isNoMeaningfulTransformation ? 'Cannot accept: no meaningful transformation detected' : 'Accept verified transformation'}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isNoMeaningfulTransformation ? 'No Changes to Apply' : 'Accept All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Semantic Meaning Verification Quality Gate */}
      <MeaningVerificationCard
        verification={rewriteResult.verification}
        onKeepOriginal={onRejectAll}
        onRegenerate={onRegenerate}
        onChangeStyle={() => setShowStylePicker(!showStylePicker)}
        onChangeIntensity={() => setShowIntensityPicker(!showIntensityPicker)}
      />

      {/* Style & Intensity Quick Switchers when requested */}
      {showStylePicker && (
        <div className="p-4 bg-[#563727]/60 border border-[#D9E48A]/30 rounded-lg space-y-2 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[#D9E48A] uppercase font-semibold">
              Select Writing Style to Regenerate:
            </span>
            <button onClick={() => setShowStylePicker(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(['Academic', 'Research', 'Technical', 'Professional', 'Natural', 'Simple', 'Concise'] as WritingMode[]).map(
              (m) => (
                <button
                  key={m}
                  onClick={() => {
                    setShowStylePicker(false);
                    onChangeStyle?.(m);
                  }}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    rewriteResult.mode === m
                      ? 'bg-[#D9E48A] text-[#372C2E] font-semibold'
                      : 'bg-white/5 hover:bg-white/15 text-white/80 border border-white/10'
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {showIntensityPicker && (
        <div className="p-4 bg-[#563727]/60 border border-amber-500/30 rounded-lg space-y-2 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-mono text-amber-300 uppercase font-semibold">
              Select Rewrite Intensity to Force Deeper Transformation:
            </span>
            <button onClick={() => setShowIntensityPicker(false)} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            {(['Light', 'Balanced', 'Deep'] as RewriteIntensity[]).map((intensity) => (
              <button
                key={intensity}
                onClick={() => {
                  setShowIntensityPicker(false);
                  onChangeIntensity?.(intensity);
                }}
                className={`px-4 py-1.5 rounded transition-colors ${
                  rewriteResult.intensity === intensity
                    ? 'bg-amber-400 text-[#372C2E] font-semibold'
                    : 'bg-white/5 hover:bg-white/15 text-white/80 border border-white/10'
                }`}
              >
                {intensity} {intensity === 'Deep' && '(Recommended for Strong Transformation)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: ORIGINAL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/50">
                ORIGINAL DRAFT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                AI-Likeness: <strong className="text-amber-300 font-semibold">{origAI.aiLikeness}%</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-white/40 tabular-nums">
              {rewriteResult.originalText.trim().split(/\s+/).length} words
            </span>
          </div>

          <div className="p-5 rounded bg-[#563727]/30 border border-white/5 text-sm leading-relaxed text-white/80 font-sans min-h-[160px]">
            {rewriteResult.originalText}
          </div>
        </div>

        {/* Right Column: SIDMORPH OUTPUT */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-semibold uppercase tracking-wider ${
                isGenuineTransformation ? 'text-[#D9E48A]' : 'text-amber-400'
              }`}>
                {isGenuineTransformation ? 'SIDMORPH MORPHED' : 'GENERATED OUTPUT'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D9E48A]/10 border border-[#D9E48A]/30 text-[#D9E48A]">
                AI-Likeness: <strong className="font-semibold">{rewAI.aiLikeness}%</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-white/60 tabular-nums">
              {rewriteResult.rewrittenText.trim().split(/\s+/).length} words
            </span>
          </div>

          <div className={`p-5 rounded text-sm leading-relaxed font-sans min-h-[160px] shadow-sm space-y-2 border ${
            isGenuineTransformation
              ? 'bg-[#563727]/60 border-[#D9E48A]/30 text-white'
              : 'bg-[#563727]/20 border-amber-500/30 text-white/80'
          }`}>
            <p>{rewriteResult.rewrittenText}</p>
          </div>
        </div>
      </div>

      {/* Individual Change Review Segment */}
      {rewriteResult.changes.length > 0 && !isNoMeaningfulTransformation && (
        <div className="pt-2 space-y-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-white/60 tracking-wider">
              Individual Detected Modifications ({rewriteResult.changes.length})
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              Toggle specific substitutions
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {rewriteResult.changes.map((change) => {
              const isAccepted = changeStates[change.id];
              return (
                <div
                  key={change.id}
                  className={`p-2.5 rounded border text-xs flex items-center justify-between gap-3 transition-colors ${
                    isAccepted ? 'bg-[#563727]/40 border-white/10' : 'bg-red-950/20 border-red-500/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {change.original && (
                      <span className="line-through text-red-300 bg-red-950/40 px-1.5 py-0.5 rounded font-mono text-[11px] truncate max-w-[200px]">
                        {change.original}
                      </span>
                    )}
                    <span className="text-white/30">→</span>
                    <span className="text-[#D9E48A] bg-[#D9E48A]/10 px-1.5 py-0.5 rounded font-mono text-[11px] truncate max-w-[200px]">
                      {change.replacement || '[deleted]'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleChange(change.id, false)}
                      className={`p-1 rounded transition-colors ${
                        !isAccepted ? 'bg-red-500/20 text-red-300' : 'text-white/40 hover:text-white'
                      }`}
                      title="Reject change"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleChange(change.id, true)}
                      className={`p-1 rounded transition-colors ${
                        isAccepted ? 'bg-[#D9E48A]/20 text-[#D9E48A]' : 'text-white/40 hover:text-white'
                      }`}
                      title="Accept change"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
