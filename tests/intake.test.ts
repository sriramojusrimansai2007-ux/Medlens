import { describe, it, expect } from "vitest";
import { PatientIntakeSchema } from "@/lib/types";

describe("Patient Information Intake Schema & Validation", () => {
  it("validates a complete, healthy patient intake payload", () => {
    const validPatient = {
      fullName: "Sarah Connor (Synthetic Demo)",
      age: 34,
      sex: "Female" as const,
      symptoms: ["Fatigue", "Lightheadedness"],
      existingConditions: ["None reported"],
      allergies: ["Penicillin"],
      medications: [
        { name: "Daily Multivitamin", dosage: "1 tablet", frequency: "Daily" }
      ],
      notes: "Follow up for routine checkup.",
      provenance: "PATIENT_PROVIDED" as const,
    };

    const parsed = PatientIntakeSchema.safeParse(validPatient);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.provenance).toBe("PATIENT_PROVIDED");
      expect(parsed.data.age).toBe(34);
      expect(parsed.data.symptoms).toHaveLength(2);
    }
  });

  it("rejects empty or missing patient name", () => {
    const invalidPatient = {
      fullName: "",
      age: 45,
      sex: "Male" as const,
    };

    const parsed = PatientIntakeSchema.safeParse(invalidPatient);
    expect(parsed.success).toBe(false);
  });

  it("rejects negative age or physiologically impossible age", () => {
    const negativeAge = {
      fullName: "Invalid Age Patient",
      age: -5,
      sex: "Female" as const,
    };
    expect(PatientIntakeSchema.safeParse(negativeAge).success).toBe(false);

    const impossibleAge = {
      fullName: "Superhuman Patient",
      age: 180,
      sex: "Female" as const,
    };
    expect(PatientIntakeSchema.safeParse(impossibleAge).success).toBe(false);
  });

  it("supports empty symptoms and allergies gracefully", () => {
    const minimalPatient = {
      fullName: "Minimal Record Patient",
      age: 29,
      sex: "Other" as const,
    };

    const parsed = PatientIntakeSchema.safeParse(minimalPatient);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.symptoms).toEqual([]);
      expect(parsed.data.allergies).toEqual([]);
      expect(parsed.data.medications).toEqual([]);
    }
  });
});

