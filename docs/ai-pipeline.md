# SidMorph AI & NLP Pipeline

## Pipeline Workflow

```
INPUT DRAFT
   ↓
Preprocessing & Segmentation (Sentences, Tokens, Paragraphs)
   ↓
Feature Extraction & Factual Anchor Locking (Entities, Numbers, Dates, Citations)
   ↓
Similarity & Overlap Analysis (N-grams, Boilerplate, Structural Paraphrase)
   ↓
AI-Writing Statistical Classification (Burstiness CV, RTTR, Transition Entropy)
   ↓
Contextual LLM Morph / Rewrite Engine (Academic, Research, Technical, Natural, Concise)
   ↓
Semantic Consistency Verification (Entity preservation, Numerical integrity)
   ↓
Citation Guardian Audit (APA, MLA, IEEE, Missing citation risk)
   ↓
QUALITY GATE (Evaluates Meaning Drift: LOW / MEDIUM / HIGH)
   ↓
RETURN VERIFIED RESULT & DIFFS
```

## Quality Gate & Meaning Drift Verification
Before presenting an AI transformation to the user, the quality gate validates 5 invariants:
1. **Key Information Check**: Verifies central thesis preservation.
2. **Numbers & Dates Integrity**: Confirms all numerical metrics (e.g. `24.5%`, `1998`) are retained without hallucination or loss.
3. **Technical Terms & Proper Nouns**: Confirms disciplinary nomenclature is preserved.
4. **Citation Locking**: Confirms parenthetical references (e.g. `(Smith et al., 2024)`) remain present.
5. **Drift Level**:
   - `LOW`: Factual consistency score $\ge 88\%$.
   - `MEDIUM`: Nuance shift ($75\% - 87\%$), advisory note displayed.
   - `HIGH`: Critical shift ($<75\%$), triggers `⚠ REVIEW REQUIRED` with option to keep original or regenerate.
