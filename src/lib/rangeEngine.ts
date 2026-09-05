import { RangeStatus } from "./types";

export interface ParsedRange {
  low: number | null;
  high: number | null;
  isLessThan: boolean;
  isGreaterThan: boolean;
  rawText: string;
}

/**
 * Parses raw numeric values safely from strings like "12.4", "  12.4 mg/dL", "< 0.05", "1,250"
 */
export function parseNumericValue(valueStr: string | null | undefined): number | null {
  if (!valueStr || typeof valueStr !== "string") return null;

  // Clean string: remove commas, whitespace, units
  const trimmed = valueStr.trim().replace(/,/g, "");

  // Match leading number (supports negative and decimals)
  const match = trimmed.match(/^[-+]?[0-9]*\.?[0-9]+/);
  if (match) {
    const parsed = parseFloat(match[0]);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Parses a reference range string strictly from source text.
 * Returns null if string is empty, 'N/A', 'None', or unparseable.
 * Absolutely NEVER generates or looks up external ranges.
 */
export function parseReferenceRangeString(rangeStr: string | null | undefined): ParsedRange | null {
  if (!rangeStr || typeof rangeStr !== "string") return null;

  const clean = rangeStr.trim();
  if (
    clean === "" ||
    clean.toLowerCase() === "n/a" ||
    clean.toLowerCase() === "none" ||
    clean.toLowerCase() === "not provided" ||
    clean.toLowerCase() === "null" ||
    clean.toLowerCase() === "unknown"
  ) {
    return null;
  }

  // Check for "< X" or "<= X" (Upper limit only)
  const lessThanMatch = clean.match(/^(?:<=?|<|less than)\s*([0-9]*\.?[0-9]+)/i);
  if (lessThanMatch) {
    const high = parseFloat(lessThanMatch[1]);
    if (!isNaN(high)) {
      return { low: null, high, isLessThan: true, isGreaterThan: false, rawText: clean };
    }
  }

  // Check for "> X" or ">= X" (Lower limit only)
  const greaterThanMatch = clean.match(/^(?:>=?|>|greater than)\s*([0-9]*\.?[0-9]+)/i);
  if (greaterThanMatch) {
    const low = parseFloat(greaterThanMatch[1]);
    if (!isNaN(low)) {
      return { low, high: null, isLessThan: false, isGreaterThan: true, rawText: clean };
    }
  }

  // Check for standard interval: "12.0 - 15.5", "12.0 to 15.5", "12.0 – 15.5"
  const intervalMatch = clean.match(/([0-9]*\.?[0-9]+)\s*(?:-|–|—|to)\s*([0-9]*\.?[0-9]+)/i);
  if (intervalMatch) {
    const low = parseFloat(intervalMatch[1]);
    const high = parseFloat(intervalMatch[2]);
    if (!isNaN(low) && !isNaN(high)) {
      return { low, high, isLessThan: false, isGreaterThan: false, rawText: clean };
    }
  }

  // Single numeric bound fallback (rare)
  return null;
}

/**
 * Deterministically evaluates reference status.
 * STRICT RULE: If reference range is null or unparseable, returns 'NOT_PROVIDED'.
 * Never falls back to standard physiological ranges.
 */
export function evaluateReferenceStatus(
  rawVal: string,
  rawRange: string | null | undefined
): { status: RangeStatus; normalizedRange: string | null; numericVal: number | null } {
  const numericVal = parseNumericValue(rawVal);

  if (!rawRange || rawRange.trim() === "") {
    return {
      status: "NOT_PROVIDED",
      normalizedRange: null,
      numericVal,
    };
  }

  const parsedRange = parseReferenceRangeString(rawRange);
  if (!parsedRange || numericVal === null) {
    return {
      status: "NOT_PROVIDED",
      normalizedRange: rawRange.trim() || null,
      numericVal,
    };
  }

  // Interval bound: low <= value <= high
  if (parsedRange.low !== null && parsedRange.high !== null) {
    // Standard margin tolerance of epsilon for float precision
    const EPSILON = 0.00001;
    if (numericVal < parsedRange.low - EPSILON) {
      return { status: "LOW", normalizedRange: parsedRange.rawText, numericVal };
    }
    if (numericVal > parsedRange.high + EPSILON) {
      return { status: "HIGH", normalizedRange: parsedRange.rawText, numericVal };
    }
    return { status: "NORMAL", normalizedRange: parsedRange.rawText, numericVal };
  }

  // Upper bound only: < X (e.g. Total Cholesterol < 200)
  if (parsedRange.high !== null && parsedRange.isLessThan) {
    if (numericVal > parsedRange.high) {
      return { status: "HIGH", normalizedRange: parsedRange.rawText, numericVal };
    }
    return { status: "NORMAL", normalizedRange: parsedRange.rawText, numericVal };
  }

  // Lower bound only: > X (e.g. eGFR > 60)
  if (parsedRange.low !== null && parsedRange.isGreaterThan) {
    if (numericVal < parsedRange.low) {
      return { status: "LOW", normalizedRange: parsedRange.rawText, numericVal };
    }
    return { status: "NORMAL", normalizedRange: parsedRange.rawText, numericVal };
  }

  return {
    status: "NOT_PROVIDED",
    normalizedRange: parsedRange.rawText,
    numericVal,
  };
}
