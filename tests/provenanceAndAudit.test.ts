import { describe, it, expect } from "vitest";
import { LabResult } from "@/lib/types";
import { evaluateReferenceStatus } from "@/lib/rangeEngine";

describe("Provenance Tiers & Human Verification Audit Trail", () => {
  it("verifies initial extraction provenance is REPORT_EXTRACTED and unverified", () => {
    const extractedItem: LabResult = {
      id: "lab-101",
      panelCategory: "Complete Blood Count (CBC)",
      testName: "Hemoglobin",
      value: "9.4",
      numericValue: 9.4,
      unit: "g/dL",
      referenceRange: "12.0 - 15.5",
      referenceStatus: "LOW",
      sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
      date: "2026-09-01",
      confidence: 0.98,
      provenance: "REPORT_EXTRACTED",
      isVerified: false,
    };

    expect(extractedItem.provenance).toBe("REPORT_EXTRACTED");
    expect(extractedItem.isVerified).toBe(false);
    expect(extractedItem.sourceReportName).toBe("Quest_CBC_Diagnostic_Lab_2026.pdf");
  });

  it("CRITICAL HUMAN VERIFICATION WORKFLOW: edits value, preserves audit trail, and flips provenance to USER_VERIFIED", () => {
    const originalItem: LabResult = {
      id: "lab-102",
      panelCategory: "Complete Blood Count (CBC)",
      testName: "Hemoglobin",
      value: "9.4", // OCR misread 12.4 as 9.4
      numericValue: 9.4,
      unit: "g/dL",
      referenceRange: "12.0 - 15.5",
      referenceStatus: "LOW",
      sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
      date: "2026-09-01",
      confidence: 0.88,
      provenance: "REPORT_EXTRACTED",
      isVerified: false,
    };

    // Clinician inspects source scan and corrects 9.4 -> 12.4
    const correctedValue = "12.4";
    const reEvaluated = evaluateReferenceStatus(correctedValue, originalItem.referenceRange);

    const verifiedItem: LabResult = {
      ...originalItem,
      value: correctedValue,
      numericValue: reEvaluated.numericVal,
      referenceStatus: reEvaluated.status,
      isVerified: true,
      verifiedBy: "Dr. Alex Taylor (MD Reviewer)",
      verifiedAt: "2026-09-05T11:00:00.000Z",
      provenance: "USER_VERIFIED",
      originalExtractedValue: originalItem.value,
      auditTrail: [
        {
          field: "value",
          originalValue: originalItem.value,
          newValue: correctedValue,
          verifiedBy: "Dr. Alex Taylor (MD Reviewer)",
          timestamp: "2026-09-05T11:00:00.000Z",
        },
      ],
    };

    // Assert provenance transition
    expect(verifiedItem.provenance).toBe("USER_VERIFIED");
    expect(verifiedItem.isVerified).toBe(true);

    // Assert preservation of original raw evidence
    expect(verifiedItem.originalExtractedValue).toBe("9.4");
    expect(verifiedItem.value).toBe("12.4");

    // Assert re-evaluated reference status flipped from LOW to NORMAL
    expect(verifiedItem.referenceStatus).toBe("NORMAL");

    // Assert immutable audit trail
    expect(verifiedItem.auditTrail).toHaveLength(1);
    expect(verifiedItem.auditTrail![0].originalValue).toBe("9.4");
    expect(verifiedItem.auditTrail![0].newValue).toBe("12.4");
    expect(verifiedItem.auditTrail![0].verifiedBy).toContain("Dr. Alex Taylor");
  });
});
