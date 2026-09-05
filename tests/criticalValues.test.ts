import { describe, it, expect } from "vitest";
import { evaluateCriticalFinding, getCriticalFindings } from "@/lib/criticalValues";
import { LabResult } from "@/lib/types";

describe("Clinical Critical Panic Values Engine", () => {
  it("identifies critically high potassium (arrhythmia risk)", () => {
    const finding = evaluateCriticalFinding("Serum Potassium", 6.4, "mmol/L");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_HIGH");
    expect(finding?.thresholdDescription).toContain("> 6.0");
    expect(finding?.clinicalContext).toContain("cardiac rhythm");
  });

  it("identifies critically low potassium", () => {
    const finding = evaluateCriticalFinding("Potassium", 2.4, "mEq/L");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_LOW");
    expect(finding?.thresholdDescription).toContain("< 2.8");
  });

  it("identifies critical anemia (Hemoglobin < 7.0 g/dL)", () => {
    const finding = evaluateCriticalFinding("Hemoglobin (Hgb)", 6.2, "g/dL");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_LOW");
    expect(finding?.thresholdDescription).toContain("< 7.0");
  });

  it("identifies critical hyperglycemia (Glucose > 400 mg/dL)", () => {
    const finding = evaluateCriticalFinding("Fasting Blood Glucose", 450, "mg/dL");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_HIGH");
  });

  it("identifies critical hypoglycemia (Glucose < 50 mg/dL)", () => {
    const finding = evaluateCriticalFinding("Glucose", 42, "mg/dL");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_LOW");
  });

  it("identifies critical spontaneous bleeding risk (Platelets < 20,000 /uL)", () => {
    const finding = evaluateCriticalFinding("Platelet Count", 12, "x10^3/uL");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_LOW");
  });

  it("returns null for normal or mild out-of-range values", () => {
    // Normal Potassium
    expect(evaluateCriticalFinding("Potassium", 4.2, "mmol/L")).toBeNull();
    // Mild elevated glucose (not panic)
    expect(evaluateCriticalFinding("Glucose", 140, "mg/dL")).toBeNull();
    // Mild low hemoglobin (not panic)
    expect(evaluateCriticalFinding("Hemoglobin", 10.5, "g/dL")).toBeNull();
  });

  it("scans multiple lab results and filters correctly", () => {
    const results: LabResult[] = [
      {
        id: "lab-1",
        panelCategory: "Electrolytes",
        testName: "Potassium",
        value: "6.3",
        numericValue: 6.3,
        unit: "mmol/L",
        referenceRange: "3.5 - 5.0",
        referenceStatus: "HIGH",
        sourceReportName: "report.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        id: "lab-2",
        panelCategory: "Electrolytes",
        testName: "Sodium",
        value: "140",
        numericValue: 140,
        unit: "mmol/L",
        referenceRange: "135 - 145",
        referenceStatus: "NORMAL",
        sourceReportName: "report.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        id: "lab-3",
        panelCategory: "Hematology",
        testName: "Hemoglobin",
        value: "6.5",
        numericValue: 6.5,
        unit: "g/dL",
        referenceRange: "12.0 - 15.5",
        referenceStatus: "LOW",
        sourceReportName: "report.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      }
    ];

    const criticals = getCriticalFindings(results);
    expect(criticals.length).toBe(2);
    expect(criticals.map((c) => c.testName)).toEqual(["Potassium", "Hemoglobin"]);
  });

  it("identifies critical hyponatremia (< 120 mmol/L)", () => {
    const finding = evaluateCriticalFinding("Sodium", 115, "mmol/L");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_LOW");
  });

  it("identifies critical hypercalcemia (> 13.0 mg/dL)", () => {
    const finding = evaluateCriticalFinding("Serum Calcium", 13.5, "mg/dL");
    expect(finding).not.toBeNull();
    expect(finding?.level).toBe("CRITICAL_HIGH");
  });
});
