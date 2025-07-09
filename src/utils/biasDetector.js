// List of potentially biased terms and their types
const BIAS_TERMS = [
  { word: "chairman", suggestion: "chairperson", type: "gendered" },
  { word: "housewife", suggestion: "homemaker", type: "gendered" },
  { word: "crazy", suggestion: "mentally unwell", type: "mental health" },
  { word: "illegal alien", suggestion: "undocumented immigrant", type: "racial" },
  { word: "manpower", suggestion: "workforce", type: "gendered" },
  { word: "he", suggestion: "they", type: "gendered pronoun" },
  { word: "blacklist", suggestion: "blocklist", type: "racial undertone" },
  // Add more as needed
];

// Detects all biased terms in the prompt
export function detectBias(prompt) {
  const found = [];

  const lowerPrompt = prompt.toLowerCase();

  for (const entry of BIAS_TERMS) {
    const regex = new RegExp(`\\b${entry.word}\\b`, 'gi');
    if (regex.test(lowerPrompt)) {
      found.push({
        term: entry.word,
        suggestion: entry.suggestion,
        type: entry.type,
      });
    }
  }

  return found;
}
