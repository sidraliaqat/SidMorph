import React, { useState, useRef, useEffect } from 'react';
import {
  Document,
  RewriteResult,
  WritingMode,
  RewriteIntensity,
  SimilarityAnalysis,
  AIAnalysis,
  WritingMetric,
  CitationIntegrityReport,
  VoiceProfile,
} from '../../types';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Sparkles,
  Sliders,
  History,
  FileDown,
  Bot,
  Search,
  Activity,
  BarChart3,
  BookmarkCheck,
  Check,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { FloatingToolbar } from './FloatingToolbar';
import { ComparisonView } from '../morph/ComparisonView';
import { SimilarityReport } from '../analysis/SimilarityReport';
import { AIDetectionReport } from '../analysis/AIDetectionReport';
import { QualityReport } from '../analysis/QualityReport';
import { CitationReport } from '../analysis/CitationReport';

interface DocumentEditorProps {
  document: Document;
  onUpdateContent: (content: string) => void;
  onUpdateTitle: (title: string) => void;
  onMorph: (selectedText: string, mode: WritingMode, intensity: RewriteIntensity) => Promise<RewriteResult>;
  onRunAnalyses: () => Promise<void>;
  onOpenVersions: () => void;
  onOpenVoiceProfile: () => void;
  onOpenAssistant: (contextSnippet?: string) => void;
  onOpenExport: () => void;
  similarityAnalysis: SimilarityAnalysis | null;
  aiAnalysis: AIAnalysis | null;
  writingMetrics: WritingMetric | null;
  citationReport: CitationIntegrityReport | null;
  voiceProfile: VoiceProfile | null;
  isAnalyzing: boolean;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onUpdateContent,
  onUpdateTitle,
  onMorph,
  onRunAnalyses,
  onOpenVersions,
  onOpenVoiceProfile,
  onOpenAssistant,
  onOpenExport,
  similarityAnalysis,
  aiAnalysis,
  writingMetrics,
  citationReport,
  voiceProfile,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<
    'editor' | 'comparison' | 'similarity' | 'ai' | 'quality' | 'citations'
  >('editor');

  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Morph Controls
  const [morphMode, setMorphMode] = useState<WritingMode>('Academic');
  const [morphIntensity, setMorphIntensity] = useState<RewriteIntensity>('Balanced');
  const [useVoiceGuidance, setUseVoiceGuidance] = useState(true);
  const [isMorphing, setIsMorphing] = useState(false);
  const [currentRewrite, setCurrentRewrite] = useState<RewriteResult | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true);

  // Sync state if external document prop updates
  useEffect(() => {
    if (document.id) {
      setContent(document.content);
      setTitle(document.title);
    }
  }, [document.id, document.content, document.title]);

  // Debounced auto-save
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onUpdateContent(content);
    }, 600);
    return () => clearTimeout(timer);
  }, [content]);

  // Handle Text Selection in Editor to trigger floating toolbar
  const handleSelect = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value.substring(start, end).trim();

    if (text.length > 5) {
      setSelectedText(text);
      setSelectionRange({ start, end });
      // Estimate screen coordinates of selection
      const rect = el.getBoundingClientRect();
      setToolbarPos({
        top: rect.top + 20,
        left: rect.left + Math.min(rect.width / 2, 350),
      });
    } else {
      setSelectedText('');
      setSelectionRange(null);
      setToolbarPos(null);
    }
  };

  // Execute Morph
  const triggerMorph = async (modeOverride?: WritingMode, intensityOverride?: RewriteIntensity, textOverride?: string) => {
    const mode = modeOverride || morphMode;
    const intensity = intensityOverride || morphIntensity;
    if (modeOverride) setMorphMode(modeOverride);
    if (intensityOverride) setMorphIntensity(intensityOverride);

    const textToMorph = textOverride || selectedText || content;
    if (!textToMorph.trim()) return;

    setIsMorphing(true);
    try {
      const res = await onMorph(textToMorph, mode, intensity);
      setCurrentRewrite(res);
      setActiveTab('comparison');
    } catch (e) {
      console.error('Morph failed', e);
    } finally {
      setIsMorphing(false);
      setToolbarPos(null);
    }
  };

  // Accept Morphed Content into Text
  const handleAcceptMorph = (newText: string) => {
    if (selectionRange && selectedText) {
      // Replace only the selected passage in the document
      const before = content.substring(0, selectionRange.start);
      const after = content.substring(selectionRange.end);
      const updated = before + newText + after;
      setContent(updated);
      onUpdateContent(updated);
    } else {
      // Full document rewrite accepted
      setContent(newText);
      onUpdateContent(newText);
    }
    setCurrentRewrite(null);
    setActiveTab('editor');
  };

  // Rich Formatting Helpers (Markdown/Text structure)
  const applyFormat = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(nextContent);
    onUpdateContent(nextContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 0);
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const readTimeMin = Math.ceil(words / 200);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Top Document Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex-1 min-w-[280px]">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onUpdateTitle(e.target.value);
            }}
            placeholder="Document Title..."
            className="w-full bg-transparent font-serif text-2xl sm:text-3xl font-semibold text-white placeholder-white/30 focus:outline-none focus:border-b focus:border-[#D9E48A]"
          />
          <div className="flex items-center gap-3 text-xs text-white/40 pt-1 font-mono">
            <span>Autosaved</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{words} words</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{chars} characters</span>
            <span aria-hidden="true">·</span>
            <span>~{readTimeMin} min read</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenVoiceProfile}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              voiceProfile ? 'bg-[#563727] text-[#D9E48A] border-[#D9E48A]/40' : 'bg-white/5 text-white/70 border-white/15 hover:text-white'
            }`}
            title="Maintain your personal writing style during rewrites"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Keep My Voice {voiceProfile && '✓'}</span>
          </button>

          <button
            onClick={onOpenVersions}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded transition-colors flex items-center gap-1.5"
            title="Browse and restore version snapshots"
          >
            <History className="w-3.5 h-3.5" />
            <span>Versions ({document.versions?.length || 1})</span>
          </button>

          <button
            onClick={() => onOpenAssistant(selectedText || content.slice(0, 500))}
            className="px-3 py-1.5 text-xs font-medium bg-[#563727] hover:bg-[#563727]/80 text-[#D9E48A] border border-[#7A431D] rounded transition-colors flex items-center gap-1.5"
            title="Open contextual AI writing assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 rounded transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onRunAnalyses}
            disabled={isAnalyzing}
            className="px-4 py-1.5 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Manuscript</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Views */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-1 p-1 bg-[#563727]/40 border border-white/10 rounded-md overflow-x-auto">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'editor' ? 'bg-[#563727] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Editor
          </button>

          {currentRewrite && (
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'comparison' ? 'bg-[#D9E48A] text-[#372C2E] font-semibold' : 'text-[#D9E48A] hover:bg-white/5'
              }`}
            >
              <span>Before / After Review</span>
              <span className="w-2 h-2 rounded-full bg-[#372C2E]" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('similarity')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'similarity' ? 'bg-[#563727] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Potential Overlap</span>
            {similarityAnalysis && (
              <span className="font-mono text-[10px] text-amber-300">
                ({similarityAnalysis.potentialOverlapScore}%)
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-[#563727] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>AI Writing Indicators</span>
            {aiAnalysis && (
              <span className="font-mono text-[10px] text-[#D9E48A]">
                ({aiAnalysis.aiLikeness}%)
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quality' ? 'bg-[#563727] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Writing Quality</span>
            {writingMetrics && (
              <span className="font-mono text-[10px] text-white/60">
                ({writingMetrics.clarityScore}/100)
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'citations' ? 'bg-[#563727] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Citations</span>
            {citationReport && (
              <span className="font-mono text-[10px] text-emerald-400">
                ({citationReport.detectedCount})
              </span>
            )}
          </button>
        </div>

        {/* Morph Control Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono hidden sm:inline">Mode:</span>
          <select
            value={morphMode}
            onChange={(e) => setMorphMode(e.target.value as WritingMode)}
            className="bg-[#563727] text-white text-xs border border-white/10 rounded px-2.5 py-1 focus:outline-none focus:border-[#D9E48A]"
          >
            <option value="Academic">Academic</option>
            <option value="Research">Research</option>
            <option value="Technical">Technical</option>
            <option value="Professional">Professional</option>
            <option value="Natural">Natural</option>
            <option value="Simple">Simple</option>
            <option value="Concise">Concise</option>
          </select>

          <select
            value={morphIntensity}
            onChange={(e) => setMorphIntensity(e.target.value as RewriteIntensity)}
            className="bg-[#563727] text-white text-xs border border-white/10 rounded px-2.5 py-1 focus:outline-none focus:border-[#D9E48A]"
          >
            <option value="Light">Light</option>
            <option value="Balanced">Balanced</option>
            <option value="Deep">Deep</option>
          </select>

          <button
            onClick={() => triggerMorph()}
            disabled={isMorphing}
            className="px-3.5 py-1 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isMorphing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Morph {selectedText ? 'Selection' : 'Document'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Display */}
      {activeTab === 'editor' && (
        <div className="space-y-3">
          {/* Rich Editor Toolbar */}
          <div className="bg-[#563727]/60 border border-white/10 p-2 rounded-t-lg flex flex-wrap items-center gap-1 text-white/70">
            <button
              onClick={() => applyFormat('**', '**')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('*', '*')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('<u>', '</u>')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              onClick={() => applyFormat('\n# ', '\n')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('\n## ', '\n')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('\n### ', '\n')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              onClick={() => applyFormat('\n- ', '')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('\n1. ', '')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => applyFormat('\n> ', '\n')}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="ml-auto text-xs text-white/40 font-mono pr-2">
              Tip: Highlight any paragraph to reveal the Contextual Morph Toolbar
            </div>
          </div>

          {/* Text Editor Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onSelect={handleSelect}
              onMouseUp={handleSelect}
              onKeyUp={handleSelect}
              placeholder="Paste or write your manuscript, research paper, or essay here..."
              rows={22}
              className="w-full bg-[#563727]/30 border border-white/10 rounded-b-lg p-6 text-sm sm:text-base leading-relaxed text-white placeholder-white/25 focus:outline-none focus:border-[#D9E48A]/40 font-sans resize-y"
            />

            {/* Contextual Floating Selection Toolbar */}
            {toolbarPos && (
              <FloatingToolbar
                position={toolbarPos}
                onMorph={(mode) => triggerMorph(mode)}
                onExplain={() => onOpenAssistant(selectedText)}
                onClose={() => setToolbarPos(null)}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'comparison' && currentRewrite && (
        <ComparisonView
          rewriteResult={currentRewrite}
          onAcceptAll={handleAcceptMorph}
          onRejectAll={() => setActiveTab('editor')}
          onRegenerate={() => triggerMorph()}
          onChangeStyle={(newMode) => triggerMorph(newMode)}
          onChangeIntensity={(newIntensity) => triggerMorph(morphMode, newIntensity)}
        />
      )}

      {activeTab === 'similarity' && (
        similarityAnalysis ? (
          <SimilarityReport analysis={similarityAnalysis} />
        ) : (
          <div className="text-center py-16 bg-[#563727]/20 border border-white/10 rounded p-6 space-y-3">
            <p className="text-xs text-white/50">Run manuscript analysis to generate detailed potential textual overlap report.</p>
            <button
              onClick={onRunAnalyses}
              className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] rounded"
            >
              Run Similarity Analysis
            </button>
          </div>
        )
      )}

      {activeTab === 'ai' && (
        aiAnalysis ? (
          <AIDetectionReport
            analysis={aiAnalysis}
            onTransformToHuman={(paragraphText) => {
              triggerMorph('Natural', 'Deep', paragraphText);
            }}
          />
        ) : (
          <div className="text-center py-16 bg-[#563727]/20 border border-white/10 rounded p-6 space-y-3">
            <p className="text-xs text-white/50">Run manuscript analysis to generate AI-writing indicator metrics.</p>
            <button
              onClick={onRunAnalyses}
              className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] rounded"
            >
              Run AI-Writing Analysis
            </button>
          </div>
        )
      )}

      {activeTab === 'quality' && (
        writingMetrics ? (
          <QualityReport metrics={writingMetrics} />
        ) : (
          <div className="text-center py-16 bg-[#563727]/20 border border-white/10 rounded p-6 space-y-3">
            <p className="text-xs text-white/50">Run manuscript analysis to view readability, clarity, and repetition metrics.</p>
            <button
              onClick={onRunAnalyses}
              className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] rounded"
            >
              Evaluate Writing Quality
            </button>
          </div>
        )
      )}

      {activeTab === 'citations' && (
        citationReport ? (
          <CitationReport report={citationReport} />
        ) : (
          <div className="text-center py-16 bg-[#563727]/20 border border-white/10 rounded p-6 space-y-3">
            <p className="text-xs text-white/50">Audit APA, MLA, and IEEE citation integrity for this manuscript.</p>
            <button
              onClick={onRunAnalyses}
              className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] rounded"
            >
              Audit Citations
            </button>
          </div>
        )
      )}
    </div>
  );
};
