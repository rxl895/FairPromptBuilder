// List of potentially biased terms along with suggestions and bias type
const BIAS_TERMS = [
  { word: "chairman", suggestion: "chairperson", type: "gendered" },
  { word: "housewife", suggestion: "homemaker", type: "gendered" },
  { word: "manpower", suggestion: "workforce", type: "gendered" },
  { word: "he", suggestion: "they", type: "gendered pronoun" },
  { word: "she", suggestion: "they", type: "gendered pronoun" },
  { word: "crazy", suggestion: "mentally unwell", type: "mental health" },
  { word: "insane", suggestion: "irrational" or "mentally unwell", type: "mental health" },
  { word: "illegal alien", suggestion: "undocumented immigrant", type: "racial" },
  { word: "blacklist", suggestion: "blocklist", type: "racial undertone" },
  { word: "whitelist", suggestion: "allowlist", type: "racial undertone" },
  { word: "manmade", suggestion: "human-made" or "artificial", type: "gendered" },
  { word: "native", suggestion: "local" or "original inhabitant", type: "racial" },
];

// Detect biased terms in the input string
export function detectBias(prompt) {
  const found = [];
  const lowerPrompt = prompt.toLowerCase();

  for (const entry of BIAS_TERMS) {
    const regex = new RegExp(`\\b${entry.word}\\b`, 'gi'); // match whole word only
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
