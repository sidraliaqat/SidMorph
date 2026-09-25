import {
  AIAnalysis,
  ChatMessage,
  CitationIntegrityReport,
  Document,
  DocumentVersion,
  RewriteIntensity,
  RewriteResult,
  SimilarityAnalysis,
  VoiceProfile,
  WritingMetric,
  WritingMode,
} from '../types';
import { detectAIWriting } from '../lib/nlp/aiDetector';
import { generateCitationReport } from '../lib/nlp/citation';
import { localMorphRewrite } from '../lib/nlp/morphEngine';
import { analyzeWritingQuality } from '../lib/nlp/quality';
import { analyzeSimilarity } from '../lib/nlp/similarity';
import { verifySemanticIntegrity } from '../lib/nlp/verifier';
import { analyzeVoiceProfile } from '../lib/nlp/voiceProfile';
import {
  getLocalDocuments,
  getOrCreateWorkspaceId,
  saveLocalDocuments,
} from './storage';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Workspace-Id': getOrCreateWorkspaceId(),
});

export const api = {
  // Document Operations
  async getDocuments(): Promise<Document[]> {
    try {
      const res = await fetch('/api/documents', {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveLocalDocuments(data);
          return data;
        }
      }
    } catch {
      // Backend unavailable, fallback to local store
    }
    return getLocalDocuments();
  },

  async createDocument(title: string, content: string = ''): Promise<Document> {
    const wsId = getOrCreateWorkspaceId();
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const initialVersion: DocumentVersion = {
      id: `ver-${Date.now()}`,
      documentId: '',
      versionNumber: 1,
      label: 'Original Draft',
      content,
      wordCount,
      createdAt: new Date().toISOString(),
    };

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      workspaceId: wsId,
      title: title || 'Untitled Document',
      content,
      wordCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [initialVersion],
    };
    initialVersion.documentId = newDoc.id;

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        const serverDoc = await res.json();
        const current = getLocalDocuments();
        saveLocalDocuments([serverDoc, ...current]);
        return serverDoc;
      }
    } catch {
      // Fallback
    }

    const current = getLocalDocuments();
    saveLocalDocuments([newDoc, ...current]);
    return newDoc;
  },

  async getDocument(id: string): Promise<Document | null> {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        headers: getHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const docs = getLocalDocuments();
    return docs.find(d => d.id === id) || null;
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const docs = getLocalDocuments();
    const index = docs.findIndex(d => d.id === id);
    const existing = index !== -1 ? docs[index] : null;

    const updated: Document = {
      ...(existing || {
        id,
        workspaceId: getOrCreateWorkspaceId(),
        title: 'Document',
        content: '',
        wordCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [],
      }),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.content !== undefined) {
      updated.wordCount = updates.content.trim() ? updates.content.trim().split(/\s+/).length : 0;
    }

    if (index !== -1) {
      docs[index] = updated;
      saveLocalDocuments(docs);
    }

    try {
      await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
    } catch {
      // Fallback updated locally
    }

    return updated;
  },

  async deleteDocument(id: string): Promise<void> {
    const docs = getLocalDocuments().filter(d => d.id !== id);
    saveLocalDocuments(docs);
    try {
      await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {
      // Handled
    }
  },

  async duplicateDocument(id: string): Promise<Document | null> {
    const doc = await this.getDocument(id);
    if (!doc) return null;
    const duplicated = await this.createDocument(`${doc.title} (Copy)`, doc.content);
    return duplicated;
  },

  // Version Control
  async saveVersion(documentId: string, content: string, label?: string): Promise<DocumentVersion> {
    const doc = await this.getDocument(documentId);
    const currentVersions = doc?.versions || [];
    const nextNum = currentVersions.length + 1;
    const newVersion: DocumentVersion = {
      id: `ver-${Date.now()}`,
      documentId,
      versionNumber: nextNum,
      label: label || `Version ${nextNum}`,
      content,
      wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
      createdAt: new Date().toISOString(),
    };

    if (doc) {
      doc.versions = [newVersion, ...currentVersions];
      await this.updateDocument(documentId, {
        content,
        versions: doc.versions,
        currentVersionId: newVersion.id,
      });
    }

    try {
      await fetch(`/api/documents/${documentId}/versions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, label }),
      });
    } catch {
      // Handled
    }

    return newVersion;
  },

  // AI Morph Rewrite Engine
  async morphRewrite(
    originalText: string,
    mode: WritingMode = 'Academic',
    intensity: RewriteIntensity = 'Balanced',
    voiceProfile?: VoiceProfile
  ): Promise<RewriteResult> {
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text: originalText, mode, intensity, voiceProfile }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Server offline, execute client-side NLP engine
    }
    return localMorphRewrite(originalText, mode, intensity, voiceProfile);
  },

  // Semantic Verification
  async verifyRewrite(originalText: string, rewrittenText: string) {
    try {
      const res = await fetch('/api/rewrite/verify', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ originalText, rewrittenText }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }
    return verifySemanticIntegrity(originalText, rewrittenText);
  },

  // Potential Textual Overlap / Similarity Analysis
  async analyzeSimilarity(text: string, documentId: string = 'current'): Promise<SimilarityAnalysis> {
    try {
      const res = await fetch(`/api/documents/${documentId}/analyze`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.similarity) return data.similarity;
      }
    } catch {
      // Local fallback
    }
    return analyzeSimilarity(text, documentId);
  },

  // AI Writing Analysis
  async analyzeAIWriting(text: string, documentId: string = 'current'): Promise<AIAnalysis> {
    try {
      const res = await fetch(`/api/documents/${documentId}/ai-analysis`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }
    return detectAIWriting(text, documentId);
  },

  // Writing Quality Metrics
  analyzeQuality(text: string, documentId: string = 'current'): WritingMetric {
    return analyzeWritingQuality(text, documentId);
  },

  // Citation Guardian
  analyzeCitations(text: string): CitationIntegrityReport {
    return generateCitationReport(text);
  },

  // Voice Profile Extraction
  extractVoiceProfile(sampleText: string): VoiceProfile {
    return analyzeVoiceProfile(sampleText);
  },

  // Contextual AI Assistant Chat
  async sendAssistantMessage(message: string, contextSnippet?: string): Promise<string> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, contextSnippet }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch {
      // Fallback
    }

    // Contextual responses if offline
    const lower = message.toLowerCase();
    if (lower.includes('academic') || lower.includes('formal')) {
      return `To elevate the academic tone of this passage, replace informal phrasing with precise disciplinary nomenclature and convert conversational assertions into evidence-grounded hypotheses.`;
    }
    if (lower.includes('citation') || lower.includes('cite')) {
      return `When evaluating attribution, look for empirical percentages, causal claims, or broad statements like "research shows" that lack source references. Ensure citations are formatted consistently in APA, MLA, or IEEE.`;
    }
    if (lower.includes('similarity') || lower.includes('overlap')) {
      return `The potential overlap detected typically arises from formulaic academic transitions or standard literature phrase sequences. Reconstructing clause order and expressing the core claim with your own conceptual emphasis will reduce textual resemblance.`;
    }
    if (lower.includes('ai') || lower.includes('indicator')) {
      return `AI writing indicators measure structural uniformity, low sentence length variance (low burstiness), and elevated transition frequency. Introducing varied sentence lengths, personal perspective, and nuanced argumentation will create natural rhythm.`;
    }
    return `Regarding your passage: the central concept can be articulated with greater clarity and precision while maintaining your original voice and attribution. Consider whether the key technical terms and relationships are clearly defined.`;
  },
};
