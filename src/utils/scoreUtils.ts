/**
 * Utility functions for score normalization and formatting.
 * Canonical score scale is ALWAYS 0 to 100.
 */

/**
 * Normalizes any score value (from 0-1, 0-10, or 0-100 scale) into canonical 0-100 range.
 * @param value Raw score value
 * @param sourceScale Optional hint for source scale: 1, 10, 100, or 'percentage'
 * @returns Canonical score (number 0 to 100)
 */
export function normalizeScore(
  value: any,
  sourceScale?: 1 | 10 | 100 | '1' | '10' | '100' | 'percentage' | string
): number {
  if (value === null || value === undefined || typeof value !== 'number' || isNaN(value)) {
    return 0;
  }

  let canonical = value;

  if (sourceScale === 1 || sourceScale === '1') {
    canonical = value * 100;
  } else if (sourceScale === 10 || sourceScale === '10') {
    canonical = value * 10;
  } else if (sourceScale === 100 || sourceScale === '100' || sourceScale === 'percentage') {
    canonical = value;
  } else {
    // Auto-detect based on magnitude
    if (value <= 1.0 && value >= 0) {
      canonical = value * 100;
    } else if (value <= 10.0 && value > 1.0) {
      canonical = value * 10;
    } else {
      canonical = value;
    }
  }

  // Clamp strictly between 0 and 100 and round to 1 decimal place
  const rounded = Math.round(canonical * 10) / 10;
  return Math.min(100, Math.max(0, rounded));
}

/**
 * Formats a canonical 0-100 score into a display string.
 * Standard display style: "85 / 100" or "85%"
 */
export function formatScore(
  canonicalScore: number,
  style: 'slash100' | 'percentage' | 'compact' = 'slash100'
): string {
  const norm = normalizeScore(canonicalScore);
  const formattedVal = Number.isInteger(norm) ? norm.toString() : norm.toFixed(1);

  if (style === 'percentage') {
    return `${formattedVal}%`;
  }
  if (style === 'compact') {
    return `${formattedVal}`;
  }
  return `${formattedVal} / 100`;
}

/**
 * Calculates average canonical score from an array of answer evaluation objects or numeric scores.
 */
export function calculateAverageScore(
  scoresOrEvals: Array<number | { score?: number; technicalAccuracy?: number } | null | undefined>
): number {
  const validScores = scoresOrEvals
    .map((item) => {
      if (typeof item === 'number') return normalizeScore(item);
      if (item && typeof item === 'object') {
        const val = item.score ?? item.technicalAccuracy;
        return typeof val === 'number' ? normalizeScore(val) : null;
      }
      return null;
    })
    .filter((s): s is number => s !== null && !isNaN(s));

  if (validScores.length === 0) return 60; // baseline if no valid scores

  const sum = validScores.reduce((acc, curr) => acc + curr, 0);
  const avg = sum / validScores.length;
  return Math.min(100, Math.max(0, Math.round(avg * 10) / 10));
}
