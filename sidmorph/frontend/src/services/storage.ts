import { Document, DocumentVersion, VoiceProfile } from '../types';

const WORKSPACE_KEY = 'sidmorph_workspace_id';
const LOCAL_DOCS_KEY = 'sidmorph_local_documents';
const VOICE_PROFILE_KEY = 'sidmorph_voice_profile';

export const DEMO_SAMPLE_DOCUMENT = {
  id: 'doc-demo-sample',
  workspaceId: 'demo-workspace',
  title: 'Neural Language Models & Attribution Integrity',
  content: `In recent years, there has been an increasing interest in natural language processing and deep learning architectures. Studies have shown that large language models plays a crucial role in the development of automated writing systems (Vaswani et al., 2017). However, extensive experiments demonstrate that our proposed method outperforms traditional recurrent approaches by 24.5% on standard benchmark datasets.

Researchers found that the proposed model significantly improves accuracy, due to the fact that multi-head attention mechanisms capture long-range token dependencies more effectively. It is important to note that the transformer architecture serves as a testament to the power of self-supervised representation learning [4].

Furthermore, as shown in figure, the data reveals that lexical predictability remains high across formulaic academic prose (Smith & Doe, 2024). Ultimately, future research should focus on exploring the underlying mechanisms of meaning preservation and citation integrity.`,
  wordCount: 135,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versions: [
    {
      id: 'ver-demo-1',
      documentId: 'doc-demo-sample',
      versionNumber: 1,
      label: 'Original Draft',
      content: `In recent years, there has been an increasing interest in natural language processing and deep learning architectures. Studies have shown that large language models plays a crucial role in the development of automated writing systems (Vaswani et al., 2017). However, extensive experiments demonstrate that our proposed method outperforms traditional recurrent approaches by 24.5% on standard benchmark datasets.

Researchers found that the proposed model significantly improves accuracy, due to the fact that multi-head attention mechanisms capture long-range token dependencies more effectively. It is important to note that the transformer architecture serves as a testament to the power of self-supervised representation learning [4].

Furthermore, as shown in figure, the data reveals that lexical predictability remains high across formulaic academic prose (Smith & Doe, 2024). Ultimately, future research should focus on exploring the underlying mechanisms of meaning preservation and citation integrity.`,
      wordCount: 135,
      createdAt: new Date().toISOString(),
    }
  ]
};

export function getOrCreateWorkspaceId(): string {
  let wsId = localStorage.getItem(WORKSPACE_KEY);
  if (!wsId) {
    wsId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(WORKSPACE_KEY, wsId);
  }
  return wsId;
}

export function getLocalDocuments(): Document[] {
  try {
    const raw = localStorage.getItem(LOCAL_DOCS_KEY);
    if (!raw) {
      // Initialize with demo sample document
      const initial = [{ ...DEMO_SAMPLE_DOCUMENT, workspaceId: getOrCreateWorkspaceId() }];
      localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading local documents', e);
    return [{ ...DEMO_SAMPLE_DOCUMENT, workspaceId: getOrCreateWorkspaceId() }];
  }
}

export function saveLocalDocuments(docs: Document[]) {
  try {
    localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed saving local documents', e);
  }
}

export function getLocalVoiceProfile(): VoiceProfile | null {
  try {
    const raw = localStorage.getItem(VOICE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalVoiceProfile(profile: VoiceProfile) {
  try {
    localStorage.setItem(VOICE_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed saving voice profile', e);
  }
}
