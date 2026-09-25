# SidMorph REST API Reference

All requests must supply the `X-Workspace-Id: <uuid>` header to ensure tenant isolation.

## Document Endpoints
- `GET /api/documents`: List all active documents belonging to the workspace.
- `POST /api/documents`: Create a new document. Body: `{ title: string, content?: string }`.
- `GET /api/documents/:id`: Fetch document by ID with workspace verification.
- `PATCH /api/documents/:id`: Update document title or content.
- `DELETE /api/documents/:id`: Permanently delete document.
- `POST /api/documents/:id/duplicate`: Duplicate document within workspace.
- `POST /api/documents/:id/archive`: Move document to archive state.
- `POST /api/documents/:id/restore`: Restore document from archive.

## Version Control Endpoints
- `GET /api/documents/:id/versions`: List all snapshot versions for document.
- `POST /api/documents/:id/versions`: Create a new named version snapshot.
- `POST /api/versions/:id/restore`: Restore document content to specific version.

## Analytical Endpoints
- `POST /api/documents/:id/analyze`: Execute Similarity & Writing Quality analysis.
- `POST /api/documents/:id/ai-analysis`: Execute AI-writing indicator detection.
- `GET /api/documents/:id/metrics`: Get Flesch-Kincaid and passive voice metrics.

## Morph & Assistant Endpoints
- `POST /api/rewrite`: Execute Morph transformation. Body: `{ text: string, mode: WritingMode, intensity: RewriteIntensity, voiceProfile?: object }`.
- `POST /api/rewrite/verify`: Run Semantic Meaning Verification on original vs rewritten text.
- `POST /api/chat`: Contextual writing assistant conversation. Body: `{ message: string, contextSnippet?: string }`.
