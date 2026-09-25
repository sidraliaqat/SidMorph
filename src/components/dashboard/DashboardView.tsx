import React, { useState } from 'react';
import {
  Plus,
  Upload,
  FileText,
  Search,
  Copy,
  Trash2,
  Archive,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  Filter,
} from 'lucide-react';
import { Document } from '../../types';

interface DashboardViewProps {
  documents: Document[];
  onOpenDocument: (doc: Document) => void;
  onNewDocument: () => void;
  onUploadClick: () => void;
  onDuplicateDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onArchiveDocument: (id: string) => void;
  onRestoreDocument: (id: string) => void;
  onTryDemo: () => void;
  totalRewritesCount?: number;
  totalAnalysesCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  onOpenDocument,
  onNewDocument,
  onUploadClick,
  onDuplicateDocument,
  onDeleteDocument,
  onArchiveDocument,
  onRestoreDocument,
  onTryDemo,
  totalRewritesCount = 12,
  totalAnalysesCount = 18,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArchived, setFilterArchived] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'words'>('updated');

  const filteredDocs = documents
    .filter(doc => (filterArchived ? !!doc.archivedAt : !doc.archivedAt))
    .filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'words') return b.wordCount - a.wordCount;
      return 0;
    });

  const totalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Welcome & Stats Section */}
      <div className="bg-[#563727] border border-white/10 rounded-lg p-8 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D9E48A]">
            <span>Anonymous Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Session Active</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
            YOUR WORKSPACE
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-light">
            Transform your writing without losing your voice.
          </p>
        </div>

        {/* 4 Quantitative Metrics Grid */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">Documents</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {documents.length}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">Words Processed</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#D9E48A] tabular-nums">
              {totalWords.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">Rewrites Executed</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {totalRewritesCount}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">Analyses Performed</span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              {totalAnalysesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNewDocument}
            className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
          <button
            onClick={onUploadClick}
            className="px-4 py-2 text-xs font-medium text-white/90 hover:text-white bg-[#563727] hover:bg-[#563727]/80 border border-white/10 rounded transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#D9E48A]" />
            <span>Upload PDF / DOCX</span>
          </button>
          <button
            onClick={onTryDemo}
            className="px-4 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9E48A]" />
            <span>Load Demo Manuscript</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#563727]/50 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:border-[#D9E48A]"
            />
          </div>

          <div className="flex items-center bg-[#563727]/40 border border-white/10 rounded p-0.5">
            <button
              onClick={() => setFilterArchived(false)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                !filterArchived ? 'bg-white/15 text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterArchived(true)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                filterArchived ? 'bg-white/15 text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'} found</span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#563727] text-white/80 border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#D9E48A]"
            >
              <option value="updated">Recently Modified</option>
              <option value="title">Title (A-Z)</option>
              <option value="words">Word Count</option>
            </select>
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-20 bg-[#563727]/20 border border-dashed border-white/10 rounded-lg space-y-4">
            <FileText className="w-10 h-10 text-white/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base text-white font-medium">No documents in this view</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                {searchQuery
                  ? 'No documents matched your search query.'
                  : filterArchived
                  ? 'You have no archived documents.'
                  : 'Get started by creating a new document, uploading a file, or loading the demo manuscript.'}
              </p>
            </div>
            {!filterArchived && (
              <button
                onClick={onNewDocument}
                className="px-4 py-2 text-xs font-semibold text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Document</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const latestVer = doc.versions && doc.versions.length > 0 ? doc.versions[0] : null;
              return (
                <div
                  key={doc.id}
                  className="bg-[#563727]/40 border border-white/10 hover:border-[#D9E48A]/40 rounded-lg p-5 flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        onClick={() => onOpenDocument(doc)}
                        className="font-serif text-lg text-white font-semibold group-hover:text-[#D9E48A] cursor-pointer transition-colors line-clamp-1"
                      >
                        {doc.title || 'Untitled Document'}
                      </h3>
                      {latestVer && (
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0 bg-white/5 px-2 py-0.5 rounded">
                          v{latestVer.versionNumber}
                        </span>
                      )}
                    </div>

                    <p
                      onClick={() => onOpenDocument(doc)}
                      className="text-xs text-white/60 line-clamp-3 leading-relaxed cursor-pointer font-sans"
                    >
                      {doc.content || 'Empty document. Click to open and begin writing...'}
                    </p>
                  </div>

                  {/* Document Card Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-white/60 tabular-nums">{doc.wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateDocument(doc.id)}
                        title="Duplicate Document"
                        className="p-1 hover:text-white text-white/40 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {doc.archivedAt ? (
                        <button
                          onClick={() => onRestoreDocument(doc.id)}
                          title="Restore Document"
                          className="p-1 hover:text-[#D9E48A] text-white/40 rounded transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onArchiveDocument(doc.id)}
                          title="Archive Document"
                          className="p-1 hover:text-amber-400 text-white/40 rounded transition-colors"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        title="Delete Document"
                        className="p-1 hover:text-red-400 text-white/40 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="ml-1 px-2.5 py-1 text-[11px] font-medium text-[#372C2E] bg-[#D9E48A] hover:bg-[#c9d57a] rounded transition-colors flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
