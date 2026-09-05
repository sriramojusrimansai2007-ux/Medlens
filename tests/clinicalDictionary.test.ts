import { describe, it, expect } from "vitest";
import {
  COMMON_SYMPTOMS,
  COMMON_CONDITIONS,
  COMMON_ALLERGIES,
  POPULAR_SYMPTOM_QUICK_CHIPS,
  getFilteredSuggestions,
} from "@/lib/clinicalDictionary";

describe("Clinical Dictionary & Autocomplete Engine", () => {
  it("contains standardized clinical symptoms, conditions, and allergies", () => {
    expect(COMMON_SYMPTOMS.length).toBeGreaterThan(15);
    expect(COMMON_SYMPTOMS).toContain("Fatigue");
    expect(COMMON_SYMPTOMS).toContain("Shortness of breath");
    expect(COMMON_CONDITIONS).toContain("Hypertension");
    expect(COMMON_ALLERGIES).toContain("Penicillin");
    expect(POPULAR_SYMPTOM_QUICK_CHIPS).toContain("Fatigue");
  });

  it("filters suggestions case-insensitively and accurately", () => {
    const results = getFilteredSuggestions("fat", COMMON_SYMPTOMS, []);
    expect(results).toContain("Fatigue");
  });

  it("excludes symptoms that the patient already has entered", () => {
    const results = getFilteredSuggestions("fat", COMMON_SYMPTOMS, ["Fatigue"]);
    expect(results).not.toContain("Fatigue");
  });

  it("returns empty array when query is empty or only whitespace", () => {
    expect(getFilteredSuggestions("", COMMON_SYMPTOMS, [])).toEqual([]);
    expect(getFilteredSuggestions("   ", COMMON_SYMPTOMS, [])).toEqual([]);
  });

  it("respects the custom limit parameter", () => {
    const results = getFilteredSuggestions("a", COMMON_SYMPTOMS, [], 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

