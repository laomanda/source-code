import { Resource } from "@/types";

// Synonym & alias dictionary for developer components
const SYNONYMS: Record<string, string[]> = {
  button: ["btn", "cta", "trigger", "action", "press", "click", "ripple", "stagger"],
  btn: ["button", "cta", "trigger"],
  navbar: ["nav", "header", "navigation", "menu", "appbar", "floating", "topbar"],
  nav: ["navbar", "navigation", "header", "menu"],
  card: ["box", "panel", "tile", "container", "card-block", "pricing"],
  hero: ["banner", "canvas", "header", "landing", "intro", "ambient"],
  modal: ["dialog", "popup", "sheet", "overlay", "drawer", "alert"],
  dialog: ["modal", "popup", "sheet"],
  tabs: ["tab", "switcher", "segmented", "toggle"],
  form: ["input", "select", "checkbox", "switch", "textarea", "control"],
  dropdown: ["select", "menu", "popover", "picker"],
  responsive: ["mobile", "tablet", "desktop", "adaptive", "fluid", "flex"],
  animation: ["animated", "motion", "stagger", "transition", "canvas", "interactive"],
  interactive: ["animation", "motion", "dynamic", "state"],
  react: ["tsx", "jsx", "hooks", "nextjs", "next.js"],
  tailwind: ["tw", "css", "styling", "classes", "tailwindcss"],
  typescript: ["ts", "types", "typed"],
};

/**
 * Calculates simple Levenshtein distance for typo tolerance
 */
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if word fuzzy matches target with distance threshold <= 1 (for length >= 4)
 */
function isFuzzyMatch(word: string, target: string): boolean {
  if (target.includes(word) || word.includes(target)) return true;
  if (word.length >= 4 && target.length >= 4) {
    const dist = levenshtein(word, target);
    return dist <= 1;
  }
  return false;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matchedTokens: string[];
}

/**
 * Smart Search Engine: Ranks resources based on multi-token matches, synonyms, tags, and fuzzy typo tolerance
 */
export function smartSearchResources<T extends Resource>(
  resources: T[],
  query: string
): SearchResult<T>[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return resources.map((item) => ({ item, score: 1, matchedTokens: [] }));
  }

  const rawTokens = cleanQuery.split(/\s+/).filter(Boolean);

  // Expand tokens with synonyms
  const expandedTokens: Array<{ token: string; isOriginal: boolean }> = [];
  rawTokens.forEach((t) => {
    expandedTokens.push({ token: t, isOriginal: true });
    if (SYNONYMS[t]) {
      SYNONYMS[t].forEach((syn) => {
        expandedTokens.push({ token: syn, isOriginal: false });
      });
    }
  });

  const scoredResults: SearchResult<T>[] = [];

  resources.forEach((resource) => {
    let score = 0;
    const matchedTokens: string[] = [];

    const titleLower = resource.title.toLowerCase();
    const slugLower = resource.slug.toLowerCase();
    const descLower = resource.description.toLowerCase();
    const techLower = resource.technology.toLowerCase();
    const catLower = resource.category.toLowerCase();
    const tagsLower = resource.tags.map((t) => t.toLowerCase());

    // 1. Exact full query match bonus
    if (titleLower === cleanQuery) {
      score += 150;
      matchedTokens.push(cleanQuery);
    } else if (titleLower.startsWith(cleanQuery)) {
      score += 90;
      matchedTokens.push(cleanQuery);
    } else if (titleLower.includes(cleanQuery)) {
      score += 70;
      matchedTokens.push(cleanQuery);
    }

    // 2. Token by token evaluation
    let matchedOriginalCount = 0;

    rawTokens.forEach((rawToken) => {
      let tokenMatched = false;

      // Exact in Title
      if (titleLower.includes(rawToken)) {
        score += 40;
        tokenMatched = true;
      }
      // Exact in Slug
      if (slugLower.includes(rawToken)) {
        score += 30;
        tokenMatched = true;
      }
      // Exact in Tags
      if (tagsLower.some((t) => t.includes(rawToken))) {
        score += 35;
        tokenMatched = true;
      }
      // Exact in Technology
      if (techLower.includes(rawToken)) {
        score += 30;
        tokenMatched = true;
      }
      // Exact in Category
      if (catLower.includes(rawToken)) {
        score += 25;
        tokenMatched = true;
      }
      // Exact in Description
      if (descLower.includes(rawToken)) {
        score += 15;
        tokenMatched = true;
      }

      // Check synonyms
      if (!tokenMatched && SYNONYMS[rawToken]) {
        const synMatch = SYNONYMS[rawToken].some(
          (syn) =>
            titleLower.includes(syn) ||
            slugLower.includes(syn) ||
            tagsLower.some((t) => t.includes(syn)) ||
            descLower.includes(syn)
        );
        if (synMatch) {
          score += 20;
          tokenMatched = true;
        }
      }

      // Check fuzzy typo match
      if (!tokenMatched) {
        const wordsInTitle = titleLower.split(/[\s-_]+/);
        const hasFuzzyTitle = wordsInTitle.some((w) => isFuzzyMatch(rawToken, w));
        if (hasFuzzyTitle) {
          score += 18;
          tokenMatched = true;
        }
      }

      if (tokenMatched) {
        matchedOriginalCount++;
        matchedTokens.push(rawToken);
      }
    });

    // If multi-word search, all words should ideally be matched
    if (rawTokens.length > 1) {
      if (matchedOriginalCount === rawTokens.length) {
        score += 50; // Bonus for all keywords present
      } else if (matchedOriginalCount === 0) {
        score = 0; // Filter out if zero keyword matched
      }
    }

    if (score > 0) {
      scoredResults.push({
        item: resource,
        score,
        matchedTokens: Array.from(new Set(matchedTokens)),
      });
    }
  });

  // Sort descending by score
  return scoredResults.sort((a, b) => b.score - a.score);
}
