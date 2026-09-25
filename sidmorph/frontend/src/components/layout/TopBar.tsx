import React from 'react';
import { Plus, Sparkles, BookOpen, Layers } from 'lucide-react';

interface TopBarProps {
  currentView: 'landing' | 'dashboard' | 'editor' | 'privacy';
  onNavigate: (view: 'landing' | 'dashboard' | 'editor' | 'privacy') => void;
  onNewDocument: () => void;
  onTryDemo: () => void;
  activeDocTitle?: string;
  workspaceId: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  onNewDocument,
  onTryDemo,
  activeDocTitle,
  workspaceId,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#372C2E]/95 backdrop-blur-md border-b border-white/8 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with minimal geometric logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D9E48A]"
            aria-label="SIDMORPH Home"
          >
            {/* Minimal geometric S/SM mark */}
            <div className="w-8 h-8 rounded-sm bg-[#563727] border border-[#7A431D] flex items-center justify-center font-mono font-bold text-xs tracking-wider text-[#D9E48A] group-hover:border-[#D9E48A]/50 transition-colors">
              SM
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-wider text-white font-semibold group-hover:text-[#D9E48A] transition-colors">
                SIDMORPH
              </span>
            </div>
          </button>

          {activeDocTitle && currentView === 'editor' && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-white/40 border-l border-white/10 pl-3">
              <span>Document</span>
              <span aria-hidden="true">/</span>
              <span className="text-white/80 font-medium truncate max-w-[200px]">{activeDocTitle}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors text-xs uppercase tracking-wider ${
              currentView === 'landing' ? 'text-[#D9E48A]' : 'text-white/70 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors text-xs uppercase tracking-wider ${
              currentView === 'dashboard' || currentView === 'editor' ? 'text-[#D9E48A]' : 'text-white/70 hover:text-white'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`transition-colors text-xs uppercase tracking-wider ${
              currentView === 'privacy' ? 'text-[#D9E48A]' : 'text-white/70 hover:text-white'
            }`}
          >
            Methodology & Privacy
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTryDemo}
            className="px-3.5 py-1.5 text-xs font-medium text-white/90 hover:text-white hover:bg-white/5 border border-white/15 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9E48A]" />
            <span>Try Demo</span>
          </button>
          <button
            onClick={onNewDocument}
            className="px-4 py-1.5 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm active:translate-y-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Document</span>
          </button>
        </div>
      </div>
    </header>
  );
};
