import { LabResult } from "./types";

export interface CriticalFinding {
  testName: string;
  value: string;
  numericValue: number;
  unit: string;
  level: "CRITICAL_LOW" | "CRITICAL_HIGH";
  thresholdDescription: string;
  clinicalContext: string;
}

/**
 * Evaluates whether a specific laboratory test observation meets recognized
 * clinical pathology panic/critical alert thresholds (e.g. CAP / CLIA / Mayo Clinic guidelines).
 * 
 * STRICT RESPONSIBLE AI NOTE:
 * This is an informational observation engine based on standard laboratory panic thresholds.
 * It NEVER makes definitive diagnoses (e.g. does NOT state "Patient has acute hyperkalemia").
 */
export function evaluateCriticalFinding(
  testName: string,
  numericVal: number | null,
  unit: string = ""
): CriticalFinding | null {
  if (numericVal === null || isNaN(numericVal)) return null;
  const name = testName.toLowerCase();

  // 1. Potassium (K) — Panic: < 2.8 or > 6.0 mmol/L (Cardiac arrhythmia alert)
  if (name.includes("potassium") || name === "k") {
    if (numericVal < 2.8) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mmol/L",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 2.8 mmol/L",
        clinicalContext: "Potassium below 2.8 mmol/L is a standard hospital panic threshold associated with neuromuscular and cardiac rhythm safety.",
      };
    }
    if (numericVal > 6.0) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mmol/L",
        level: "CRITICAL_HIGH",
        thresholdDescription: "> 6.0 mmol/L",
        clinicalContext: "Potassium above 6.0 mmol/L is a hospital alert threshold requiring prompt clinical review for cardiac rhythm safety.",
      };
    }
  }

  // 2. Hemoglobin (HGB / Hb) — Panic: < 7.0 g/dL (Transfusion evaluation threshold)
  if (name.includes("hemoglobin") || name === "hgb" || name === "hb") {
    if (numericVal < 7.0) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "g/dL",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 7.0 g/dL",
        clinicalContext: "Hemoglobin below 7.0 g/dL is a widely recognized clinical transfusion consideration threshold.",
      };
    }
  }

  // 3. Platelets (PLT) — Panic: < 20 x10^3/uL or < 20,000 /uL (Spontaneous bleeding alert)
  if (name.includes("platelet") || name === "plt") {
    const isThousands = numericVal < 1000;
    const effectiveVal = isThousands ? numericVal * 1000 : numericVal;
    if (effectiveVal < 20000) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "x10^3/uL",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 20,000 /uL",
        clinicalContext: "Platelet counts under 20,000/uL represent a critical spontaneous bleeding safety alert in clinical pathology.",
      };
    }
  }

  // 4. Glucose / Blood Sugar — Panic: < 50 mg/dL or > 400 mg/dL
  if (name.includes("glucose") || name.includes("blood sugar")) {
    if (numericVal < 50) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mg/dL",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 50 mg/dL",
        clinicalContext: "Glucose below 50 mg/dL indicates severe hypoglycemia requiring immediate clinical attention or carbohydrate management.",
      };
    }
    if (numericVal > 400) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mg/dL",
        level: "CRITICAL_HIGH",
        thresholdDescription: "> 400 mg/dL",
        clinicalContext: "Glucose exceeding 400 mg/dL indicates marked acute hyperglycemia warranting prompt clinical evaluation.",
      };
    }
  }

  // 5. Sodium (Na) — Panic: < 120 or > 160 mmol/L
  if (name.includes("sodium") || name === "na") {
    if (numericVal < 120) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mmol/L",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 120 mmol/L",
        clinicalContext: "Sodium below 120 mmol/L represents severe hyponatremia requiring careful clinical assessment.",
      };
    }
    if (numericVal > 160) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mmol/L",
        level: "CRITICAL_HIGH",
        thresholdDescription: "> 160 mmol/L",
        clinicalContext: "Sodium above 160 mmol/L represents severe hypernatremia requiring urgent fluid balance review.",
      };
    }
  }

  // 6. Calcium (Ca) — Panic: < 6.5 or > 13.0 mg/dL
  if (name.includes("calcium") || name === "ca") {
    if (numericVal < 6.5) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mg/dL",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 6.5 mg/dL",
        clinicalContext: "Serum calcium below 6.5 mg/dL is a critical hypocalcemia alert threshold.",
      };
    }
    if (numericVal > 13.0) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "mg/dL",
        level: "CRITICAL_HIGH",
        thresholdDescription: "> 13.0 mg/dL",
        clinicalContext: "Serum calcium above 13.0 mg/dL is a clinical alert threshold for severe hypercalcemia.",
      };
    }
  }

  // 7. White Blood Cell (WBC) — Panic: < 1.0 or > 30.0 x10^3/uL
  if (name.includes("white blood") || name === "wbc") {
    const isThousands = numericVal < 100;
    const effectiveK = isThousands ? numericVal : numericVal / 1000;
    if (effectiveK < 1.0) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "x10^3/uL",
        level: "CRITICAL_LOW",
        thresholdDescription: "< 1.0 x10^3/uL",
        clinicalContext: "WBC count below 1.0 x10^3/uL indicates profound neutropenia with high susceptibility to infection.",
      };
    }
    if (effectiveK > 30.0) {
      return {
        testName,
        value: `${numericVal}`,
        numericValue: numericVal,
        unit: unit || "x10^3/uL",
        level: "CRITICAL_HIGH",
        thresholdDescription: "> 30.0 x10^3/uL",
        clinicalContext: "WBC count above 30.0 x10^3/uL represents extreme leukocytosis requiring prompt clinical investigation.",
      };
    }
  }

  return null;
}

/**
 * Scans a list of lab results and returns all critical panic findings.
 */
export function getCriticalFindings(results: LabResult[]): CriticalFinding[] {
  const findings: CriticalFinding[] = [];

  for (const item of results) {
    const critical = evaluateCriticalFinding(item.testName, item.numericValue, item.unit);
    if (critical) {
      findings.push(critical);
    }
  }

  return findings;
}
