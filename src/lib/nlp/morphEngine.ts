import { diffWordsWithSpace } from 'diff';
import { RewriteIntensity, RewriteResult, WritingMode, VoiceProfile } from '../../types';
import { detectCitations } from './citation';
import { extractEntitiesAndTerms, extractNumbers, splitIntoSentences, tokenizeWords } from './tokenizer';
import { verifySemanticIntegrity } from './verifier';

// Intelligent transformation rules tailored by WritingMode & Intensity
const MODE_TRANSFORMATION_STYLES: Record<WritingMode, {
  openerPrefixes: string[];
  connectors: string[];
  adjectives: Record<string, string>;
  verbs: Record<string, string>;
}> = {
  Academic: {
    openerPrefixes: ['Empirical analysis indicates that', 'Observed data demonstrates that', 'Systematic evaluation shows that'],
    connectors: ['consequently', 'in this context', 'in contrast', 'specifically'],
    adjectives: {
      'good': 'effective',
      'bad': 'suboptimal',
      'big': 'substantial',
      'important': 'consequential',
      'a lot of': 'numerous',
      'very': 'distinctly',
    },
    verbs: {
      'show': 'indicate',
      'find': 'determine',
      'make': 'produce',
      'use': 'apply',
      'get': 'obtain',
    }
  },
  Research: {
    openerPrefixes: ['Experimental observations substantiate that', 'The resultant dataset reveals that', 'Quantitative analysis confirms that'],
    connectors: ['corroborating earlier hypotheses', 'in comparison with baseline metrics', 'according to observed parameters'],
    adjectives: {
      'good': 'robust',
      'new': 'novel',
      'clear': 'unambiguous',
      'different': 'divergent',
    },
    verbs: {
      'shows': 'substantiates',
      'proves': 'indicates strong correlation that',
      'improves': 'enhances',
    }
  },
  Technical: {
    openerPrefixes: ['System architectural benchmarks indicate that', 'Operational telemetry confirms that', 'The algorithmic implementation reveals that'],
    connectors: ['specifically', 'namely', 'with respect to runtime constraints'],
    adjectives: {
      'fast': 'low-latency',
      'slow': 'computationally intensive',
      'reliable': 'fault-tolerant',
    },
    verbs: {
      'runs': 'executes',
      'handles': 'processes',
      'fixes': 'resolves',
    }
  },
  Professional: {
    openerPrefixes: ['Key operational indicators demonstrate that', 'Strategic assessment confirms that', 'Our operational review reveals that'],
    connectors: ['in alignment with strategic objectives', 'measurably', 'in practice'],
    adjectives: {
      'good': 'impactful',
      'big': 'significant',
      'quick': 'streamlined',
    },
    verbs: {
      'help': 'facilitate',
      'work': 'collaborate',
      'start': 'initiate',
    }
  },
  Natural: {
    openerPrefixes: ['The evidence suggests that', 'Observations show that', 'In practical terms,'],
    connectors: ['as a result', 'meanwhile', 'similarly'],
    adjectives: {
      'suboptimal': 'ineffective',
      'efficacious': 'effective',
      'consequential': 'meaningful',
    },
    verbs: {
      'demonstrate': 'show',
      'leverage': 'apply',
      'facilitate': 'support',
    }
  },
  Simple: {
    openerPrefixes: ['The data shows that', 'In plain terms,', 'Clearly,'],
    connectors: ['so', 'also', 'because of this'],
    adjectives: {
      'substantial': 'large',
      'consequential': 'important',
      'suboptimal': 'poor',
    },
    verbs: {
      'demonstrate': 'show',
      'implement': 'use',
      'substantiate': 'support',
    }
  },
  Concise: {
    openerPrefixes: ['Notably,', 'Specifically,', 'Directly,'],
    connectors: ['thus', 'hence', 'therefore'],
    adjectives: {
      'in order to': 'to',
      'due to the fact that': 'because',
      'at this point in time': 'now',
    },
    verbs: {
      'is able to': 'can',
      'has the capacity to': 'can',
      'serves to demonstrate': 'demonstrates',
    }
  }
};

export function localMorphRewrite(
  originalText: string,
  mode: WritingMode = 'Academic',
  intensity: RewriteIntensity = 'Balanced',
  voiceProfile?: VoiceProfile
): RewriteResult {
  const sentences = splitIntoSentences(originalText);
  const citations = detectCitations(originalText);
  const entities = extractEntitiesAndTerms(originalText);
  const numbers = extractNumbers(originalText);

  const styleConfig = MODE_TRANSFORMATION_STYLES[mode] || MODE_TRANSFORMATION_STYLES.Academic;

  // Multi-pass sentence transformation with human burstiness & clause reconstruction
  const processedSentences: string[] = [];

  for (let idx = 0; idx < sentences.length; idx++) {
    let sentence = sentences[idx].trim();
    if (!sentence) continue;

    // 1. Preserve citations by indexing placeholders
    const sentenceCitations: { placeholder: string; text: string }[] = [];
    citations.forEach((c, cIdx) => {
      if (sentence.includes(c.citationText)) {
        const ph = `__CITE_${cIdx}__`;
        sentenceCitations.push({ placeholder: ph, text: c.citationText });
        sentence = sentence.replace(c.citationText, ph);
      }
    });

    // 2. Comprehensive Anti-AI Cliché & Formulaic Filler Elimination
    let cleaned = sentence
      .replace(/\bdelve(?:s)? into\b/gi, 'examine')
      .replace(/\bdelving into\b/gi, 'examining')
      .replace(/\ba rich tapestry of\b/gi, 'a broad spectrum of')
      .replace(/\btapestry of\b/gi, 'range of')
      .replace(/\bserves as a testament to\b/gi, 'attests to')
      .replace(/\ba testament to\b/gi, 'evidence of')
      .replace(/\bplays a pivotal role in\b/gi, 'is central to')
      .replace(/\bpivotal role\b/gi, 'central role')
      .replace(/\bpivotal\b/gi, 'critical')
      .replace(/\bmultifaceted\b/gi, 'complex')
      .replace(/\bnuanced\b/gi, 'detailed')
      .replace(/\bseamlessly\b/gi, 'directly')
      .replace(/\bfosters an environment of\b/gi, 'cultivates')
      .replace(/\bfosters\b/gi, 'supports')
      .replace(/\bin the ever-evolving landscape of\b/gi, 'across')
      .replace(/\bthe landscape of\b/gi, 'the field of')
      .replace(/\bnavigating the complexities of\b/gi, 'addressing')
      .replace(/\bit is important to note that\b/gi, 'specifically,')
      .replace(/\bit is worth noting that\b/gi, 'notably,')
      .replace(/\bit should be noted that\b/gi, 'in particular,')
      .replace(/\bmoreover,\s*/gi, idx % 2 === 0 ? 'yet, ' : 'in practice, ')
      .replace(/\bfurthermore,\s*/gi, 'in addition, ')
      .replace(/\bconsequently,\s*/gi, 'as a result, ')
      .replace(/\bunderscores the importance of\b/gi, 'highlights')
      .replace(/\bleverage\b/gi, 'use')
      .replace(/\bleverages\b/gi, 'uses')
      .replace(/\bleveraging\b/gi, 'using')
      .replace(/\bplays an important role\b/gi, 'remains key')
      .replace(/\btransformative potential\b/gi, 'significant impact')
      .replace(/\bholistic approach\b/gi, 'unified methodology')
      .replace(/\bsheds light on\b/gi, 'clarifies')
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bdue to the fact that\b/gi, 'because')
      .replace(/\bat this point in time\b/gi, 'presently');

    // 3. Human Burstiness Injection (Breaking Monotonous Clause Uniformity)
    // If a sentence is long (>20 words) and has a natural break clause, split into two sentences
    const sWords = tokenizeWords(cleaned);
    let splitCandidate = false;

    if (sWords.length > 20) {
      // Split on clauses like ", which ", ", while ", ", whereas ", or ", but "
      const matchClause = cleaned.match(/^(.*?),\s*(which|while|whereas|although|as well as|thereby)\s*(.*)$/i);
      if (matchClause && matchClause[1] && matchClause[3]) {
        const part1 = matchClause[1].trim();
        const connector = matchClause[2].toLowerCase();
        let part2 = matchClause[3].trim();
        if (part2.length > 15) {
          // Capitalize part 2
          const part2Capitalized = part2.charAt(0).toUpperCase() + part2.slice(1);
          const newSent1 = part1.endsWith('.') ? part1 : `${part1}.`;
          let newSent2 = `${part2Capitalized}`;
          if (connector === 'which' || connector === 'thereby') {
            newSent2 = `This ${connector === 'thereby' ? 'directly ' : ''}${part2};`;
          } else if (connector === 'while' || connector === 'whereas') {
            newSent2 = `In contrast, ${part2}`;
          }
          if (!newSent2.endsWith('.')) newSent2 += '.';

          processedSentences.push(newSent1);
          processedSentences.push(newSent2);
          splitCandidate = true;
        }
      }
    }

    if (!splitCandidate) {
      // 4. Syntactic restructuring based on mode & intensity
      if (intensity === 'Deep' || mode === 'Natural') {
        if (cleaned.includes(', because ') || cleaned.includes(', as ')) {
          const parts = cleaned.split(/,\s*(?:because|as)\s*/i);
          if (parts.length === 2 && parts[0] && parts[1]) {
            const mainClause = parts[0].trim();
            const reasonClause = parts[1].replace(/[.?!]$/, '').trim();
            cleaned = `Because ${reasonClause.toLowerCase()}, ${mainClause.charAt(0).toLowerCase() + mainClause.slice(1)}.`;
          }
        } else if (idx === 0 && !cleaned.startsWith('Because') && !cleaned.startsWith('Yet')) {
          // Add organic transition
          const naturalTransitions = ['Specifically,', 'In practice,', 'Critically,', 'Historically,'];
          const trans = naturalTransitions[idx % naturalTransitions.length];
          cleaned = `${trans} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`;
        }
      } else {
        // Balanced restructuring
        if (cleaned.match(/^(Researchers|The authors|Studies) (found|showed|observed) that/i)) {
          cleaned = cleaned.replace(
            /^(Researchers|The authors|Studies) (found|showed|observed) that/i,
            'Empirical records indicate that'
          );
        } else if (cleaned.match(/^It is (widely|well) known that/i)) {
          cleaned = cleaned.replace(
            /^It is (widely|well) known that/i,
            'Established scholarship shows that'
          );
        }
      }

      // 5. Selective vocabulary variation from style config
      for (const [orig, repl] of Object.entries(styleConfig.adjectives)) {
        const regex = new RegExp(`\\b${orig}\\b`, 'gi');
        cleaned = cleaned.replace(regex, repl);
      }
      for (const [orig, repl] of Object.entries(styleConfig.verbs)) {
        const regex = new RegExp(`\\b${orig}\\b`, 'gi');
        cleaned = cleaned.replace(regex, repl);
      }

      // Restore citations safely
      sentenceCitations.forEach((sc) => {
        cleaned = cleaned.replace(sc.placeholder, sc.text);
      });

      // Capitalize first character of sentence cleanly
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      processedSentences.push(cleaned.trim());
    }
  }

  // Restore citations in any split sentences that had them
  const finalSentences = processedSentences.map((s) => {
    let restored = s;
    citations.forEach((c, cIdx) => {
      const ph = `__CITE_${cIdx}__`;
      if (restored.includes(ph)) {
        restored = restored.replace(new RegExp(ph, 'g'), c.citationText);
      }
    });
    return restored;
  });

  const rewrittenText = finalSentences.join(' ');

  // Run Semantic Verification Pipeline
  const verification = verifySemanticIntegrity(originalText, rewrittenText);

  // Compute Word-Level Diffs using diff package
  const diffs = diffWordsWithSpace(originalText, rewrittenText);
  const changes: RewriteResult['changes'] = [];
  let changeCounter = 1;

  for (let i = 0; i < diffs.length; i++) {
    const current = diffs[i];
    if (current.removed) {
      const next = diffs[i + 1];
      if (next && next.added) {
        changes.push({
          id: `chg-${changeCounter++}`,
          original: current.value,
          replacement: next.value,
          type: 'substitution',
          accepted: true,
        });
        i++; // skip next since merged
      } else {
        changes.push({
          id: `chg-${changeCounter++}`,
          original: current.value,
          replacement: '',
          type: 'deletion',
          accepted: true,
        });
      }
    } else if (current.added) {
      changes.push({
        id: `chg-${changeCounter++}`,
        original: '',
        replacement: current.value,
        type: 'addition',
        accepted: true,
      });
    }
  }

  return {
    id: `rw-${Date.now()}`,
    originalText,
    rewrittenText,
    mode,
    intensity,
    verification,
    transformationStatus: verification.transformationStatus,
    transformationDetails: verification.transformationDetails,
    changes,
    createdAt: new Date().toISOString(),
  };
}
