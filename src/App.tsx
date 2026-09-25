import React, { useState, useEffect } from 'react';
import {
  Document,
  DocumentVersion,
  RewriteResult,
  WritingMode,
  RewriteIntensity,
  SimilarityAnalysis,
  AIAnalysis,
  WritingMetric,
  CitationIntegrityReport,
  VoiceProfile,
} from './types';
import { api } from './services/api';
import {
  getOrCreateWorkspaceId,
  getLocalVoiceProfile,
  saveLocalVoiceProfile,
  DEMO_SAMPLE_DOCUMENT,
} from './services/storage';

import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';

// Landing Page Components
import { LandingHero } from './components/landing/LandingHero';
import { ProblemSection } from './components/landing/ProblemSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { AIDetectionSection } from './components/landing/AIDetectionSection';
import { InteractiveDemo } from './components/landing/InteractiveDemo';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { PrivacySection } from './components/landing/PrivacySection';
import { FinalCTA } from './components/landing/FinalCTA';

// Dashboard & Editor
import { DashboardView } from './components/dashboard/DashboardView';
import { DocumentEditor } from './components/editor/DocumentEditor';
import { MethodologyView } from './components/privacy/MethodologyView';

// Modals & Drawers
import { VersionHistoryDrawer } from './components/versions/VersionHistoryDrawer';
import { KeepMyVoiceModal } from './components/voice/KeepMyVoiceModal';
import { AIAssistantDrawer } from './components/assistant/AIAssistantDrawer';
import { FileUploadModal } from './components/upload/FileUploadModal';
import { ExportModal } from './components/export/ExportModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'editor' | 'privacy'>('landing');
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);

  // Analyses State for the Active Document
  const [similarityAnalysis, setSimilarityAnalysis] = useState<SimilarityAnalysis | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [writingMetrics, setWritingMetrics] = useState<WritingMetric | null>(null);
  const [citationReport, setCitationReport] = useState<CitationIntegrityReport | null>(null);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals & Drawers State
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Statistics counters
  const [rewritesCount, setRewritesCount] = useState(14);
  const [analysesCount, setAnalysesCount] = useState(21);

  // Initialize Workspace & Documents
  useEffect(() => {
    const wsId = getOrCreateWorkspaceId();
    setWorkspaceId(wsId);

    const savedProfile = getLocalVoiceProfile();
    if (savedProfile) setVoiceProfile(savedProfile);

    // Fetch initial documents
    api.getDocuments().then((docs) => {
      setDocuments(docs);
      if (docs.length > 0 && !activeDoc) {
        setActiveDoc(docs[0]);
      }
    });
  }, []);

  // When activeDoc changes or updates content, run live dynamic analyses
  useEffect(() => {
    if (activeDoc && activeDoc.content && activeDoc.content.trim().length > 15) {
      const q = api.analyzeQuality(activeDoc.content, activeDoc.id);
      setWritingMetrics(q);
      const c = api.analyzeCitations(activeDoc.content);
      setCitationReport(c);

      // Dynamically compute continuous AI Likeness and Similarity for the current text
      const sim = api.analyzeSimilarity(activeDoc.content, activeDoc.id);
      const ai = api.analyzeAIWriting(activeDoc.content, activeDoc.id);
      Promise.all([sim, ai]).then(([simRes, aiRes]) => {
        setSimilarityAnalysis(simRes);
        setAiAnalysis(aiRes);
      });
    } else if (activeDoc && (!activeDoc.content || activeDoc.content.trim().length <= 15)) {
      setWritingMetrics(api.analyzeQuality('', activeDoc?.id));
      setCitationReport(api.analyzeCitations(''));
      setSimilarityAnalysis(null);
      setAiAnalysis(null);
    }
  }, [activeDoc?.id, activeDoc?.content]);

  // Run full 4-stage analyses on manuscript
  const handleRunAnalyses = async () => {
    if (!activeDoc || !activeDoc.content) return;
    setIsAnalyzing(true);
    setAnalysesCount((c) => c + 1);

    try {
      const [simRes, aiRes] = await Promise.all([
        api.analyzeSimilarity(activeDoc.content, activeDoc.id),
        api.analyzeAIWriting(activeDoc.content, activeDoc.id),
      ]);
      setSimilarityAnalysis(simRes);
      setAiAnalysis(aiRes);
      const q = api.analyzeQuality(activeDoc.content, activeDoc.id);
      setWritingMetrics(q);
      const c = api.analyzeCitations(activeDoc.content);
      setCitationReport(c);
    } catch (e) {
      console.error('Analysis execution failed', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Execute Morph Rewrite
  const handleMorph = async (
    textToMorph: string,
    mode: WritingMode,
    intensity: RewriteIntensity
  ): Promise<RewriteResult> => {
    setRewritesCount((c) => c + 1);
    // Automatic snapshot version creation before morphing
    if (activeDoc) {
      await api.saveVersion(activeDoc.id, activeDoc.content, `Pre-Morph Snapshot (${mode})`);
    }

    const res = await api.morphRewrite(
      textToMorph,
      mode,
      intensity,
      voiceProfile || undefined
    );
    return res;
  };

  // Document Creation & Handlers
  const handleNewDocument = async () => {
    const newDoc = await api.createDocument('Untitled Manuscript', '');
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDoc(newDoc);
    setCurrentView('editor');
  };

  const handleOpenDocument = (doc: Document) => {
    setActiveDoc(doc);
    setCurrentView('editor');
  };

  const handleUpdateTitle = async (title: string) => {
    if (!activeDoc) return;
    const updated = await api.updateDocument(activeDoc.id, { title });
    setActiveDoc(updated);
    setDocuments((docs) => docs.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleUpdateContent = async (content: string) => {
    if (!activeDoc) return;
    const updated = await api.updateDocument(activeDoc.id, { content });
    setActiveDoc(updated);
    setDocuments((docs) => docs.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDuplicateDocument = async (id: string) => {
    const dup = await api.duplicateDocument(id);
    if (dup) {
      setDocuments((docs) => [dup, ...docs]);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments((docs) => docs.filter((d) => d.id !== id));
    if (activeDoc?.id === id) {
      const remaining = documents.filter((d) => d.id !== id);
      setActiveDoc(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleArchiveDocument = async (id: string) => {
    const updated = await api.updateDocument(id, { archivedAt: new Date().toISOString() });
    setDocuments((docs) => docs.map((d) => (d.id === id ? updated : d)));
  };

  const handleRestoreDocument = async (id: string) => {
    const updated = await api.updateDocument(id, { archivedAt: null });
    setDocuments((docs) => docs.map((d) => (d.id === id ? updated : d)));
  };

  // Demo manuscript loader
  const handleLoadDemo = async () => {
    const demo = await api.createDocument(DEMO_SAMPLE_DOCUMENT.title, DEMO_SAMPLE_DOCUMENT.content);
    setDocuments((prev) => [demo, ...prev]);
    setActiveDoc(demo);
    setCurrentView('editor');
    // Run analyses on demo immediately
    setTimeout(() => {
      const sim = api.analyzeSimilarity(demo.content, demo.id);
      const ai = api.analyzeAIWriting(demo.content, demo.id);
      Promise.all([sim, ai]).then(([s, a]) => {
        setSimilarityAnalysis(s);
        setAiAnalysis(a);
      });
      setWritingMetrics(api.analyzeQuality(demo.content, demo.id));
      setCitationReport(api.analyzeCitations(demo.content));
    }, 200);
  };

  // Upload Extraction
  const handleFileExtracted = async (title: string, content: string) => {
    const created = await api.createDocument(title, content);
    setDocuments((prev) => [created, ...prev]);
    setActiveDoc(created);
    setCurrentView('editor');
  };

  // Version Control Handlers
  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!activeDoc) return;
    const updated = await api.updateDocument(activeDoc.id, {
      content: version.content,
      currentVersionId: version.id,
    });
    setActiveDoc(updated);
    setDocuments((docs) => docs.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleSaveCurrentSnapshot = async (label?: string) => {
    if (!activeDoc) return;
    await api.saveVersion(activeDoc.id, activeDoc.content, label);
    const refreshed = await api.getDocument(activeDoc.id);
    if (refreshed) {
      setActiveDoc(refreshed);
      setDocuments((docs) => docs.map((d) => (d.id === refreshed.id ? refreshed : d)));
    }
  };

  // Save Voice Profile
  const handleSaveVoiceProfile = (profile: VoiceProfile) => {
    setVoiceProfile(profile);
    saveLocalVoiceProfile(profile);
  };

  return (
    <div className="min-h-screen bg-[#372C2E] text-white flex flex-col font-sans">
      {/* Editorial Top Bar (Adheres to 3-zone contract) */}
      <TopBar
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewDocument={handleNewDocument}
        onTryDemo={handleLoadDemo}
        activeDocTitle={activeDoc?.title}
        workspaceId={workspaceId}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div className="space-y-0">
            <LandingHero
              onStartWriting={() => {
                if (activeDoc) setCurrentView('editor');
                else handleNewDocument();
              }}
              onTryDemo={handleLoadDemo}
            />
            <ProblemSection />
            <HowItWorks />
            <AIDetectionSection />
            <InteractiveDemo
              onOpenEditor={() => {
                if (activeDoc) setCurrentView('editor');
                else handleLoadDemo();
              }}
            />
            <FeaturesGrid />
            <PrivacySection />
            <FinalCTA
              onStartWriting={() => {
                if (activeDoc) setCurrentView('editor');
                else handleNewDocument();
              }}
              onTryDemo={handleLoadDemo}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            documents={documents}
            onOpenDocument={handleOpenDocument}
            onNewDocument={handleNewDocument}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
            onArchiveDocument={handleArchiveDocument}
            onRestoreDocument={handleRestoreDocument}
            onTryDemo={handleLoadDemo}
            totalRewritesCount={rewritesCount}
            totalAnalysesCount={analysesCount}
          />
        )}

        {currentView === 'editor' && activeDoc && (
          <DocumentEditor
            document={activeDoc}
            onUpdateContent={handleUpdateContent}
            onUpdateTitle={handleUpdateTitle}
            onMorph={handleMorph}
            onRunAnalyses={handleRunAnalyses}
            onOpenVersions={() => setIsVersionDrawerOpen(true)}
            onOpenVoiceProfile={() => setIsVoiceModalOpen(true)}
            onOpenAssistant={(ctx) => {
              setAssistantContext(ctx || '');
              setIsAssistantOpen(true);
            }}
            onOpenExport={() => setIsExportModalOpen(true)}
            similarityAnalysis={similarityAnalysis}
            aiAnalysis={aiAnalysis}
            writingMetrics={writingMetrics}
            citationReport={citationReport}
            voiceProfile={voiceProfile}
            isAnalyzing={isAnalyzing}
          />
        )}

        {currentView === 'privacy' && <MethodologyView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentView} />

      {/* Modals & Drawers */}
      {activeDoc && (
        <VersionHistoryDrawer
          isOpen={isVersionDrawerOpen}
          onClose={() => setIsVersionDrawerOpen(false)}
          versions={activeDoc.versions || []}
          currentVersionId={activeDoc.currentVersionId}
          onRestoreVersion={handleRestoreVersion}
          onSaveCurrentSnapshot={handleSaveCurrentSnapshot}
        />
      )}

      <KeepMyVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentProfile={voiceProfile}
        onSaveProfile={handleSaveVoiceProfile}
      />

      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        contextSnippet={assistantContext}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileExtracted={handleFileExtracted}
      />

      {activeDoc && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          document={activeDoc}
        />
      )}
    </div>
  );
};

export default App;
