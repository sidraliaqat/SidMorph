import React from 'react';
import { Sparkles, RefreshCw, GraduationCap, Scissors, BookOpen, Search } from 'lucide-react';
import { WritingMode } from '../../types';

interface FloatingToolbarProps {
  position: { top: number; left: number };
  onMorph: (mode?: WritingMode) => void;
  onExplain: () => void;
  onClose: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  position,
  onMorph,
  onExplain,
  onClose,
}) => {
  return (
    <div
      style={{
        top: `${Math.max(position.top - 54, 10)}px`,
        left: `${Math.max(position.left - 120, 20)}px`,
      }}
      className="fixed z-50 bg-[#372C2E] border border-[#7A431D] shadow-2xl rounded-md flex items-center p-1 gap-0.5 animate-in fade-in zoom-in-95 duration-150 text-white select-none backdrop-blur-md"
    >
      <button
        onClick={() => onMorph()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors"
        title="Morph with AI"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Morph</span>
      </button>

      <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

      <button
        onClick={() => onMorph('Natural')}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Rephrase into natural prose"
      >
        <RefreshCw className="w-3.5 h-3.5 text-white/60" />
        <span className="hidden sm:inline">Rephrase</span>
      </button>

      <button
        onClick={() => onMorph('Academic')}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Transform into formal academic tone"
      >
        <GraduationCap className="w-3.5 h-3.5 text-[#D9E48A]" />
        <span>Academic</span>
      </button>

      <button
        onClick={() => onMorph('Concise')}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Make concise and remove filler"
      >
        <Scissors className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Concise</span>
      </button>

      <button
        onClick={() => onMorph('Simple')}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Simplify and clarify"
      >
        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
        <span className="hidden sm:inline">Simplify</span>
      </button>

      <button
        onClick={onExplain}
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Explain paragraph and analyze wording"
      >
        <Search className="w-3.5 h-3.5 text-purple-400" />
        <span>Explain</span>
      </button>
    </div>
  );
};
