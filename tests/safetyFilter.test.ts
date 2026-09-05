import { describe, it, expect } from "vitest";
import { auditMedicalSummary, MANDATORY_DISCLAIMER } from "@/lib/safetyFilter";

describe("Responsible AI Clinical Safety Guardrails", () => {
  it("passes completely safe, educational, patient-friendly summary", () => {
    const safeText = 
      "Your laboratory report shows that your White Blood Cell count is 6.8 x10^3/uL, which is within the reference range of 4.5 - 11.0 provided by the lab. " +
      "Your Hemoglobin is 9.4 g/dL, which is lower than the reference interval of 12.0 - 15.5 g/dL noted on your report sheet. " +
      "These findings should be reviewed with your primary care doctor to discuss how they align with your daily symptoms.\n\n" +
      MANDATORY_DISCLAIMER;

    const audit = auditMedicalSummary(safeText);
    expect(audit.passed).toBe(true);
    expect(audit.violations).toHaveLength(0);
    expect(audit.hasDisclaimer).toBe(true);
  });

  it("CRITICAL SAFETY CHECK: catches and blocks definitive diagnostic statements", () => {
    const diagnosticText = "Based on your low hemoglobin, you have been diagnosed with iron deficiency anemia.";
    const audit = auditMedicalSummary(diagnosticText);

    expect(audit.passed).toBe(false);
    expect(audit.violations.some(v => v.includes("medical diagnosis"))).toBe(true);
    expect(audit.sanitizedText).toContain("SAFETY INTERVENTION TRIGGERED");
    expect(audit.sanitizedText).toContain(MANDATORY_DISCLAIMER);
  });

  it("CRITICAL SAFETY CHECK: catches and blocks prescription and dosage modification statements", () => {
    const prescriptionText = "Your glucose is elevated. Take 500mg of Metformin twice daily to lower your blood sugar.";
    const audit = auditMedicalSummary(prescriptionText);

    expect(audit.passed).toBe(false);
    expect(audit.violations.some(v => v.includes("dosage or prescription"))).toBe(true);
    expect(audit.sanitizedText).toContain("SAFETY INTERVENTION TRIGGERED");
  });

  it("CRITICAL SAFETY CHECK: catches and blocks definitive treatment directives", () => {
    const treatmentText = "Your lab results show that your treatment plan should be chemotherapy immediately.";
    const audit = auditMedicalSummary(treatmentText);

    expect(audit.passed).toBe(false);
    expect(audit.violations.some(v => v.includes("treatment directives"))).toBe(true);
  });

  it("automatically appends mandatory clinical disclaimer if omitted by model", () => {
    const plainTextWithoutDisclaimer = 
      "All your reported laboratory values fall within standard intervals indicated on your requisition sheet.";
    const audit = auditMedicalSummary(plainTextWithoutDisclaimer);

    expect(audit.passed).toBe(true);
    expect(audit.hasDisclaimer).toBe(true);
    expect(audit.sanitizedText).toContain(MANDATORY_DISCLAIMER);
  });
});

