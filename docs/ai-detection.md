# AI-Writing Analysis & Detection Methodology

## Objective & Ethics Charter
SidMorph does **not** treat AI detection as definitive proof of authorship, nor does it provide "detector bypass" or "humanizer to 0%" mechanisms. Instead, it provides an analytical diagnostic mirror to help authors understand sentence rhythm, avoid formulaic writing habits, and cultivate an authentic scholarly voice.

## Extracted Linguistic Features

### 1. Sentence Uniformity & Burstiness
- **Metric**: Coefficient of Variation ($CV = \sigma / \mu$) of sentence token lengths.
- **Principle**: Human authors write with high burstiness—interleaving brief sentences (4–8 words) with expansive, multi-clause arguments (28–45 words). AI language models typically exhibit lower variance ($CV < 0.35$), clustering sentences in a narrow 18–24 word band.

### 2. Lexical Diversity: Root Type-Token Ratio (RTTR)
- **Metric**: $RTTR = V / \sqrt{N}$, where $V$ is unique vocabulary tokens and $N$ is total tokens.
- **Principle**: Measures lexical entropy across paragraphs to differentiate expansive natural vocabulary from uniform token distributions.

### 3. Discourse Marker & Formulaic Transition Density
- **Metric**: Frequency of stereotyped connectors per 1,000 words.
- **Keywords**: "delve", "pivotal role", "serves as a testament", "tapestry of", "fosters an environment", "navigating the complexities".

### 4. Structural Repetition
- **Metric**: Clustering of identical clause openers (e.g., repeated sentences opening with "The proposed...", "Furthermore, this...", "In order to...").

## Transparent Disclaimers & Known Limitations
- **False Positives**: Non-native English scholars often write with disciplined, uniform syntax that statistical models may incorrectly flag with elevated AI-likeness.
- **False Negatives**: Highly prompted or edited synthetic drafts can mimic natural variance.
- **Definitive Rule**: Detection results are probabilistic estimates, not proof of machine authorship.
