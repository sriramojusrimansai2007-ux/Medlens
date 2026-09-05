import { describe, it, expect } from "vitest";
import { extractMedicalReportAI, generateSafePatientSummaryAI } from "@/lib/gemini";
import { SYNTHETIC_PATIENTS, SAMPLE_REPORTS } from "@/lib/mockData";

describe("End-to-End Medical Report Extraction & AI Summarization", () => {
  it("processes a valid medical report with source reference ranges (CBC Sample)", async () => {
    const cbcSample = SAMPLE_REPORTS[0];

    const result = await extractMedicalReportAI({
      text: cbcSample.rawReportText,
      fileName: cbcSample.sourceDocumentName,
    });

    expect(result.results.length).toBeGreaterThan(0);

    // Verify Hemoglobin extraction
    const hgb = result.results.find((r) => r.testName.toLowerCase().includes("hemoglobin"));
    expect(hgb).toBeDefined();
    expect(hgb?.value).toBe("9.4");
    expect(hgb?.unit).toBe("g/dL");
    expect(hgb?.referenceRange).toBe("12.0 - 15.5");
    expect(hgb?.referenceStatus).toBe("LOW");
    expect(hgb?.provenance).toBe("REPORT_EXTRACTED");

    // Verify WBC extraction (Normal)
    const wbc = result.results.find((r) => r.testName.toLowerCase().includes("white blood cell"));
    expect(wbc).toBeDefined();
    expect(wbc?.referenceStatus).toBe("NORMAL");
  });

  it("CRITICAL TEST CASE: processes a report WITHOUT reference ranges without hallucinating external bounds", async () => {
    const noRangeSample = SAMPLE_REPORTS[2]; // Endocrine Panel with omitted intervals

    const result = await extractMedicalReportAI({
      text: noRangeSample.rawReportText,
      fileName: noRangeSample.sourceDocumentName,
    });

    expect(result.results.length).toBeGreaterThan(0);

    // Verify TSH extraction: MUST NOT INFER A STANDARD RANGE
    const tsh = result.results.find((r) => r.testName.includes("Thyroid Stimulating Hormone"));
    expect(tsh).toBeDefined();
    expect(tsh?.value).toBe("5.8");
    expect(tsh?.referenceRange).toBeNull(); // Strictly null
    expect(tsh?.referenceStatus).toBe("NOT_PROVIDED"); // Strictly NOT_PROVIDED

    // Verify Free T4 extraction: MUST NOT INFER A STANDARD RANGE
    const ft4 = result.results.find((r) => r.testName.includes("Free Thyroxine"));
    expect(ft4).toBeDefined();
    expect(ft4?.referenceRange).toBeNull();
    expect(ft4?.referenceStatus).toBe("NOT_PROVIDED");
  });

  it("generates a responsible AI patient-friendly summary adhering to all guardrails", async () => {
    const patient = SYNTHETIC_PATIENTS[0]; // Sarah Connor
    const cbcSample = SAMPLE_REPORTS[0];

    const extraction = await extractMedicalReportAI({
      text: cbcSample.rawReportText,
      fileName: cbcSample.sourceDocumentName,
    });

    const summary = await generateSafePatientSummaryAI(patient, extraction.results);

    expect(summary).toBeDefined();
    expect(summary.safetyChecksPassed).toBe(true);
    expect(summary.provenance).toBe("AI_GENERATED");
    expect(summary.followUpQuestionsForDoctor.length).toBeGreaterThanOrEqual(2);
    expect(summary.text).toContain("DISCLAIMER:");

    // Verify zero diagnosis words
    expect(summary.text).not.toMatch(/\byou\s+have\s+been\s+diagnosed\b/i);
    expect(summary.text).not.toMatch(/\btake\s+\d+\s*mg\b/i);
  });
});

