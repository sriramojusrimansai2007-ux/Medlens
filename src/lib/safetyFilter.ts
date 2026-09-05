export interface SafetyAuditResult {
  passed: boolean;
  violations: string[];
  hasDisclaimer: boolean;
  sanitizedText: string;
}

const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /\b(?:you\s+have\s+been\s+diagnosed|we\s+diagnose\s+you|this\s+diagnoses\s+you)\b/i,
  /\b(?:you\s+suffer\s+from|patient\s+has\s+a\s+confirmed\s+diagnosis\s+of)\b/i,
  /\b(?:definitive\s+diagnosis\s+is|confirmed\s+diagnosis:)\b/i,
];

const FORBIDDEN_PRESCRIPTION_PATTERNS = [
  /\b(?:prescribe|prescription\s+for)\s+[a-z0-9]+/i,
  /\b(?:take|ingest|start\s+taking)\s+\d+\s*(?:mg|g|ml|tablets|pills)\b/i,
  /\b(?:increase|decrease|double|halt|stop|discontinue)\s+your\s+(?:dose|dosage|medication)\b/i,
  /\b(?:recommended\s+dosage\s+is|adjust\s+your\s+dose)\b/i,
];

const FORBIDDEN_TREATMENT_PATTERNS = [
  /\b(?:treatment\s+plan\s+should\s+be|you\s+must\s+undergo\s+surgery)\b/i,
  /\b(?:cure\s+for\s+this\s+is|begin\s+chemotherapy)\b/i,
];

export const MANDATORY_DISCLAIMER = 
  "DISCLAIMER: MedLens is an educational and clinical information organization tool for synthetic/demo data. It does NOT provide medical diagnosis, prescribe medications, or recommend treatment plans. All laboratory findings and medical history must be evaluated by a licensed healthcare physician.";

/**
 * Audits generated AI text against strict Responsible AI clinical guardrails.
 */
export function auditMedicalSummary(rawSummary: string): SafetyAuditResult {
  const violations: string[] = [];

  // Strip disclaimer when evaluating body text so disclaimer words (e.g. "does NOT prescribe medications") do not false-positive
  const bodyWithoutDisclaimer = rawSummary.replace(/DISCLAIMER:[\s\S]*?(?:licensed healthcare physician\.?|$)/i, "");

  // 1. Check diagnostic claims
  for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
    if (pattern.test(bodyWithoutDisclaimer)) {
      violations.push("AI generated definitive medical diagnosis, violating clinical guardrails.");
      break;
    }
  }

  // 2. Check prescription / dosage advice
  for (const pattern of FORBIDDEN_PRESCRIPTION_PATTERNS) {
    if (pattern.test(bodyWithoutDisclaimer)) {
      violations.push("AI generated medication dosage or prescription recommendations, violating safety rules.");
      break;
    }
  }

  // 3. Check definitive treatment directives
  for (const pattern of FORBIDDEN_TREATMENT_PATTERNS) {
    if (pattern.test(bodyWithoutDisclaimer)) {
      violations.push("AI generated clinical treatment directives.");
      break;
    }
  }

  const hasDisclaimer = rawSummary.includes("DISCLAIMER:") || 
                        rawSummary.toLowerCase().includes("not a replacement for professional medical") ||
                        rawSummary.toLowerCase().includes("consult a licensed healthcare");

  let sanitizedText = rawSummary;

  if (violations.length > 0) {
    sanitizedText = `[SAFETY INTERVENTION TRIGGERED: The generated text contained restricted medical claims (${violations.join(", ")}). Reverting to safe clinical observation.]\n\n` +
      "The uploaded laboratory report contains clinical values that have been organized above for your review. Please present these findings to your qualified healthcare provider for clinical interpretation and medical advice.";
  }

  if (!hasDisclaimer) {
    sanitizedText += `\n\n${MANDATORY_DISCLAIMER}`;
  }

  return {
    passed: violations.length === 0,
    violations,
    hasDisclaimer: true,
    sanitizedText,
  };
}
