import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// NLP modules
import { localMorphRewrite } from './src/lib/nlp/morphEngine';
import { verifySemanticIntegrity } from './src/lib/nlp/verifier';
import { analyzeSimilarity } from './src/lib/nlp/similarity';
import { detectAIWriting } from './src/lib/nlp/aiDetector';
import { analyzeWritingQuality } from './src/lib/nlp/quality';
import { generateCitationReport } from './src/lib/nlp/citation';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// In-memory data store for anonymous workspaces & documents
interface StoredDoc {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  wordCount: number;
  currentVersionId?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  versions: {
    id: string;
    documentId: string;
    versionNumber: number;
    label?: string;
    content: string;
    wordCount: number;
    createdAt: string;
  }[];
}

const memoryStore: {
  workspaces: Record<string, { id: string; createdAt: string; updatedAt: string }>;
  documents: Record<string, StoredDoc>;
  analyses: Record<string, any>;
  aiAnalyses: Record<string, any>;
} = {
  workspaces: {},
  documents: {},
  analyses: {},
  aiAnalyses: {},
};

// Workspace Isolation Middleware (Section 37)
const requireWorkspace = (req: Request, res: Response, next: NextFunction) => {
  const wsId = (req.headers['x-workspace-id'] as string) || req.query.workspaceId as string || 'default-workspace';
  if (!memoryStore.workspaces[wsId]) {
    memoryStore.workspaces[wsId] = {
      id: wsId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  (req as any).workspaceId = wsId;
  next();
};

// Initialize Gemini Client safely
let geminiClient: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({});
  }
} catch (e) {
  console.log('Gemini client initialized in rule-based fallback mode.');
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------
const apiRouter = express.Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'SidMorph Express REST API v1.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Workspace Documents: GET list
apiRouter.get('/documents', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const docs = Object.values(memoryStore.documents)
    .filter(d => d.workspaceId === wsId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  res.json(docs);
});

// Workspace Documents: POST create
apiRouter.post('/documents', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const { title, content } = req.body;
  const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const text = content || '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const initialVersion = {
    id: `ver-${Date.now()}`,
    documentId: docId,
    versionNumber: 1,
    label: 'Original Draft',
    content: text,
    wordCount,
    createdAt: new Date().toISOString(),
  };

  const newDoc: StoredDoc = {
    id: docId,
    workspaceId: wsId,
    title: title || 'Untitled Manuscript',
    content: text,
    wordCount,
    currentVersionId: initialVersion.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archivedAt: null,
    versions: [initialVersion],
  };

  memoryStore.documents[docId] = newDoc;
  res.status(201).json(newDoc);
});

// Document: GET single with workspace validation (Section 37)
apiRouter.get('/documents/:id', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }
  res.json(doc);
});

// Document: PATCH updates
apiRouter.patch('/documents/:id', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }

  const { title, content, archivedAt } = req.body;
  if (title !== undefined) doc.title = title;
  if (content !== undefined) {
    doc.content = content;
    doc.wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  }
  if (archivedAt !== undefined) doc.archivedAt = archivedAt;
  doc.updatedAt = new Date().toISOString();

  res.json(doc);
});

// Document: DELETE
apiRouter.delete('/documents/:id', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }
  delete memoryStore.documents[req.params.id];
  res.json({ success: true });
});

// Document: Duplicate
apiRouter.post('/documents/:id/duplicate', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }

  const dupId = `doc-${Date.now()}`;
  const dup: StoredDoc = {
    ...doc,
    id: dupId,
    title: `${doc.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.documents[dupId] = dup;
  res.status(201).json(dup);
});

// Document Versions: GET
apiRouter.get('/documents/:id/versions', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }
  res.json(doc.versions || []);
});

// Document Versions: POST (create new version snapshot)
apiRouter.post('/documents/:id/versions', requireWorkspace, (req, res) => {
  const wsId = (req as any).workspaceId;
  const doc = memoryStore.documents[req.params.id];
  if (!doc || doc.workspaceId !== wsId) {
    return res.status(404).json({ error: 'Document not found in workspace' });
  }

  const { content, label } = req.body;
  const text = content !== undefined ? content : doc.content;
  const nextNum = (doc.versions?.length || 0) + 1;
  const newVer = {
    id: `ver-${Date.now()}`,
    documentId: doc.id,
    versionNumber: nextNum,
    label: label || `Version ${nextNum}`,
    content: text,
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    createdAt: new Date().toISOString(),
  };

  doc.versions = [newVer, ...(doc.versions || [])];
  doc.currentVersionId = newVer.id;
  doc.updatedAt = new Date().toISOString();

  res.status(201).json(newVer);
});

// Run Manuscript Similarity & Quality Analysis: POST
apiRouter.post('/documents/:id/analyze', requireWorkspace, (req, res) => {
  const { text } = req.body;
  const contentToAnalyze = text || memoryStore.documents[req.params.id]?.content || '';
  const similarity = analyzeSimilarity(contentToAnalyze, req.params.id);
  const quality = analyzeWritingQuality(contentToAnalyze, req.params.id);
  const citations = generateCitationReport(contentToAnalyze);

  memoryStore.analyses[req.params.id] = { similarity, quality, citations };
  res.json({ similarity, quality, citations });
});

// AI-Writing Analysis: POST
apiRouter.post('/documents/:id/ai-analysis', requireWorkspace, (req, res) => {
  const { text } = req.body;
  const contentToAnalyze = text || memoryStore.documents[req.params.id]?.content || '';
  const aiReport = detectAIWriting(contentToAnalyze, req.params.id);
  memoryStore.aiAnalyses[req.params.id] = aiReport;
  res.json(aiReport);
});

// Writing Metrics: GET
apiRouter.get('/documents/:id/metrics', requireWorkspace, (req, res) => {
  const doc = memoryStore.documents[req.params.id];
  const content = doc ? doc.content : '';
  const metrics = analyzeWritingQuality(content, req.params.id);
  res.json(metrics);
});

// AI Morph Engine: POST /api/rewrite
apiRouter.post('/rewrite', requireWorkspace, async (req, res) => {
  const { text, mode, intensity, voiceProfile } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required for transformation' });
  }

  // If Gemini API is available and configured, utilize LLM with precise system instructions
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the SidMorph Academic Originality and Human Cadence Engine.
Your objective is to execute a genuine linguistic transformation into the "${mode || 'Academic'}" style (${intensity || 'Balanced'} intensity) that reads like authentic, articulate, and naturally written HUMAN scholarship—actively eliminating synthetic AI-writing patterns.

CRITICAL ANTI-AI HUMAN CADENCE INSTRUCTIONS:
1. BAN ALL AI CLICHÉS AND STEROTYPED DISCOURSE FILLER:
   - NEVER use the following AI-associated buzzwords or clichés:
     "delve", "delves", "delving", "tapestry", "rich tapestry", "testament", "serves as a testament", "pivotal role", "beacon", "crucial", "vital", "paramount", "multifaceted", "nuanced", "seamlessly", "fosters", "fostering", "landscape of", "ever-evolving", "comprehensive", "furthermore", "moreover", "notably", "underscores", "poised to", "harnessing", "navigating the complexities", "in conclusion", "it is important to note", "it is worth noting", "sheds light on", "holistic approach".
   - Replace any existing synthetic boilerplate in the text with direct, natural academic phrasing.
2. ENFORCE HIGH BURSTINESS (HUMAN SENTENCE RHYTHM):
   - AI drafts suffer from uniform, monotonous sentence lengths (~18-22 words per sentence). Humans do not write like this.
   - You MUST vary sentence lengths organically: interleave short, direct sentences (6–10 words) with nuanced, multi-clause analytical explanations (22–34 words).
   - Use organic transitions: "Yet,", "In contrast,", "Consequently,", "Specifically,", "Indeed,", "To that end,", along with natural punctuation (em dashes, semicolons).
3. CONVERT PASSIVE FORMULAS INTO CRISP ACTIVE SCHOLARSHIP:
   - Prefer active, clear attribution over robotic passive drones.
4. PRESERVE ALL FACTUAL METRICS, CITATIONS & ENTITIES:
   - Retain ALL empirical numbers, percentages, dates, proper nouns, and citations (APA, MLA, IEEE, e.g. (Smith, 2024), [12]) VERBATIM. Do not alter, invent, or relocate citations.
5. EXECUTE SUBSTANTIVE SYNTACTIC RESTRUCTURING:
   - Do NOT simply swap words with thesaurus synonyms. Substantively re-order dependent clauses, invert sentence openings, and re-frame arguments while preserving the exact core meaning.
${voiceProfile ? `6. Voice Guidance: Target sentence length ~${voiceProfile.avgSentenceLength} words, formality: ${voiceProfile.formality}.` : ''}

Original Text:
"""
${text}
"""

Output ONLY the rewritten text without quotation marks, conversational introductions, or meta-commentary.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const rewrittenText = response.text ? response.text.trim() : '';
      if (rewrittenText) {
        const verification = verifySemanticIntegrity(text, rewrittenText);
        return res.json({
          id: `rw-${Date.now()}`,
          originalText: text,
          rewrittenText,
          mode: mode || 'Academic',
          intensity: intensity || 'Balanced',
          verification,
          transformationStatus: verification.transformationStatus,
          transformationDetails: verification.transformationDetails,
          changes: [],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.log('Gemini request failed, falling back to local morph engine:', err);
    }
  }

  // Local rule-based NLP Morph Engine Fallback
  const result = localMorphRewrite(text, mode, intensity, voiceProfile);
  res.json(result);
});

// Semantic Verification: POST /api/rewrite/verify
apiRouter.post('/rewrite/verify', (req, res) => {
  const { originalText, rewrittenText } = req.body;
  const verification = verifySemanticIntegrity(originalText || '', rewrittenText || '');
  res.json(verification);
});

// Contextual AI Writing Assistant: POST /api/chat
apiRouter.post('/chat', requireWorkspace, async (req, res) => {
  const { message, contextSnippet } = req.body;

  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are the SidMorph Academic and Technical Writing Assistant.
User question: "${message}"
${contextSnippet ? `Passage context: """${contextSnippet}"""` : ''}

Provide a concise, scholarly, and constructive response explaining writing mechanics, attribution, or clarity without generic filler.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return res.json({ reply: response.text ? response.text.trim() : 'I am here to assist your writing.' });
    } catch (err) {
      // Fall through to standard responses
    }
  }

  // Contextual fallback response
  const lower = (message || '').toLowerCase();
  let reply = 'Regarding this passage: consider balancing clause complexity and ensuring proper attribution for any quantitative assertions.';
  if (lower.includes('academic')) {
    reply = 'To elevate academic tone, substitute conversational phrases with disciplinary nomenclature and frame claims with objective empirical terminology.';
  } else if (lower.includes('citation') || lower.includes('cite')) {
    reply = 'Verify that all empirical findings, percentages, and methodological references are attributed in standard APA, MLA, or IEEE format.';
  } else if (lower.includes('similar') || lower.includes('overlap')) {
    reply = 'The potential overlap flags standard literature boilerplate. Deconstructing sentence syntax will reduce mechanical resemblance while preserving core claims.';
  }
  res.json({ reply });
});

app.use('/api', apiRouter);

// -------------------------------------------------------------
// VITE MIDDLEWARE INTEGRATION (Full-Stack Dev)
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIDMORPH full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
