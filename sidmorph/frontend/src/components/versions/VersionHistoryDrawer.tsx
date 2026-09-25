import React, { useState } from 'react';
import { DocumentVersion } from '../../types';
import { X, History, RotateCcw, Eye, Clock, Check } from 'lucide-react';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: DocumentVersion[];
  currentVersionId?: string;
  onRestoreVersion: (version: DocumentVersion) => void;
  onSaveCurrentSnapshot: (label?: string) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersionId,
  onRestoreVersion,
  onSaveCurrentSnapshot,
}) => {
  const [selectedVer, setSelectedVer] = useState<DocumentVersion | null>(versions[0] || null);
  const [snapshotLabel, setSnapshotLabel] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#372C2E] border-l border-white/10 h-full flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-lg font-semibold">VERSION HISTORY</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:text-white text-white/50 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Snapshot Bar */}
        <div className="p-4 bg-[#563727]/40 border-b border-white/10 flex items-center gap-2 text-xs">
          <input
            type="text"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            placeholder="Snapshot label (e.g. Pre-Review Draft)..."
            className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-1.5 text-white placeholder-white/40 focus:outline-none focus:border-[#D9E48A]"
          />
          <button
            onClick={() => {
              onSaveCurrentSnapshot(snapshotLabel.trim() || undefined);
              setSnapshotLabel('');
            }}
            className="px-3 py-1.5 bg-[#D9E48A] text-[#372C2E] font-semibold rounded hover:bg-[#c9d57a] transition-colors whitespace-nowrap"
          >
            Save Snapshot
          </button>
        </div>

        {/* Content Body: List + Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-white/50">
              Recorded Snapshots ({versions.length})
            </span>

            <div className="space-y-2">
              {versions.map((ver) => {
                const isSelected = selectedVer?.id === ver.id;
                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVer(ver)}
                    className={`p-3.5 rounded border transition-colors cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#563727] border-[#D9E48A]/50'
                        : 'bg-[#563727]/20 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-[#D9E48A] font-bold">
                          v{ver.versionNumber}
                        </span>
                        <span className="text-white/80 font-sans font-medium">
                          {ver.label || `Version ${ver.versionNumber}`}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/40 tabular-nums">
                        {ver.wordCount} words
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(ver.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestoreVersion(ver);
                          onClose();
                        }}
                        className="px-2 py-0.5 bg-white/10 hover:bg-[#D9E48A] hover:text-[#372C2E] text-white/80 rounded transition-colors flex items-center gap-1 font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Version Preview */}
          {selectedVer && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span>Previewing: {selectedVer.label || `Version ${selectedVer.versionNumber}`}</span>
                <span>{selectedVer.wordCount} words</span>
              </div>
              <div className="bg-black/30 border border-white/10 rounded p-4 text-xs font-sans leading-relaxed text-white/70 max-h-60 overflow-y-auto">
                {selectedVer.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
