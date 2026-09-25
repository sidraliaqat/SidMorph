import React, { useState } from 'react';
import { VoiceProfile } from '../../types';
import { X, SlidersHorizontal, Sparkles, Check, AlertCircle } from 'lucide-react';
import { analyzeVoiceProfile } from '../../lib/nlp/voiceProfile';

interface KeepMyVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: VoiceProfile | null;
  onSaveProfile: (profile: VoiceProfile) => void;
}

export const KeepMyVoiceModal: React.FC<KeepMyVoiceModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [sampleText, setSampleText] = useState('');
  const [profile, setProfile] = useState<VoiceProfile | null>(currentProfile);

  if (!isOpen) return null;

  const handleAnalyzeSample = () => {
    if (!sampleText.trim()) return;
    const extracted = analyzeVoiceProfile(sampleText);
    setProfile(extracted);
  };

  const handleSave = () => {
    if (profile) {
      onSaveProfile(profile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#372C2E] border border-[#7A431D] rounded-lg shadow-2xl text-white overflow-hidden space-y-6 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D9E48A]" />
              <h3 className="font-serif text-xl font-semibold">KEEP MY VOICE</h3>
            </div>
            <p className="text-xs text-white/50">
              Extract and enforce your personal stylistic cadence during AI transformations.
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:text-white text-white/40 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Sample */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-white/70">
            <label className="font-mono uppercase tracking-wider">Paste a representative writing sample (100–300 words):</label>
            <span className="font-mono text-white/40">
              {sampleText.trim() ? sampleText.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Paste a paragraph from a previous paper or essay you authored to capture your authentic sentence rhythm, vocabulary preferences, and punctuation habits..."
            rows={5}
            className="w-full bg-[#563727]/30 border border-white/10 rounded p-4 text-xs font-sans leading-relaxed text-white placeholder-white/30 focus:outline-none focus:border-[#D9E48A]"
          />

          <button
            onClick={handleAnalyzeSample}
            disabled={!sampleText.trim()}
            className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Style Sample</span>
          </button>
        </div>

        {/* Analysis Output Results */}
        {profile && (
          <div className="bg-[#563727]/40 border border-white/10 rounded-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono uppercase tracking-wider text-[#D9E48A] font-semibold">
                Extracted Style Characteristics
              </span>
              <span className="text-[11px] font-mono text-white/50">Cadence Profile</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-black/20 rounded border border-white/5">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Avg Sentence Length</span>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {profile.avgSentenceLength} words
                </span>
              </div>

              <div className="p-2.5 bg-black/20 rounded border border-white/5">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Vocab Complexity</span>
                <span className="font-mono font-semibold text-white">
                  {profile.vocabularyComplexity}
                </span>
              </div>

              <div className="p-2.5 bg-black/20 rounded border border-white/5">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Formality Level</span>
                <span className="font-mono font-semibold text-white">
                  {profile.formality}
                </span>
              </div>

              <div className="p-2.5 bg-black/20 rounded border border-white/5">
                <span className="text-[10px] font-mono uppercase text-white/40 block">Tone Archetype</span>
                <span className="font-mono font-semibold text-[#D9E48A] truncate block">
                  {profile.toneCharacteristics[0] || 'Balanced'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-white/70">
              <span className="font-mono text-[11px] text-white/50 block">Punctuation & Syntax Habits:</span>
              <p className="text-[11px] leading-relaxed bg-black/20 p-2.5 rounded border border-white/5">
                {profile.punctuationHabits}
              </p>
            </div>
          </div>
        )}

        {/* Ethical Disclaimer */}
        <div className="flex items-start gap-2.5 text-xs text-white/50 border-t border-white/10 pt-4">
          <AlertCircle className="w-4 h-4 text-[#D9E48A] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            SidMorph does not claim exact clone replication of individual authorship. This module extracts measurable stylistic metrics to help you preserve consistency across revisions.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-white/70 hover:text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!profile}
            className="px-5 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Style to Future Morphs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
