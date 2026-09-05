import { describe, it, expect } from "vitest";
import { evaluateReferenceStatus, parseNumericValue, parseReferenceRangeString } from "@/lib/rangeEngine";

describe("Deterministic Reference-Range Engine", () => {
  describe("Numeric Value Parsing", () => {
    it("parses standard decimals and integers", () => {
      expect(parseNumericValue("12.4")).toBe(12.4);
      expect(parseNumericValue("142")).toBe(142);
      expect(parseNumericValue("0.9")).toBe(0.9);
    });

    it("parses strings with trailing units or formatting commas", () => {
      expect(parseNumericValue("12.4 g/dL")).toBe(12.4);
      expect(parseNumericValue("1,250 uIU/mL")).toBe(1250);
      expect(parseNumericValue("  9.4   ")).toBe(9.4);
    });

    it("returns null for non-numeric values", () => {
      expect(parseNumericValue("Negative")).toBeNull();
      expect(parseNumericValue("Normal")).toBeNull();
      expect(parseNumericValue("")).toBeNull();
      expect(parseNumericValue(null)).toBeNull();
    });
  });

  describe("Reference Range Parsing", () => {
    it("parses interval bounds correctly (hyphen, en-dash, 'to')", () => {
      const hyphen = parseReferenceRangeString("12.0 - 15.5");
      expect(hyphen).toEqual({ low: 12.0, high: 15.5, isLessThan: false, isGreaterThan: false, rawText: "12.0 - 15.5" });

      const enDash = parseReferenceRangeString("4.0 – 5.2");
      expect(enDash).toEqual({ low: 4.0, high: 5.2, isLessThan: false, isGreaterThan: false, rawText: "4.0 – 5.2" });

      const toWord = parseReferenceRangeString("70 to 99");
      expect(toWord).toEqual({ low: 70, high: 99, isLessThan: false, isGreaterThan: false, rawText: "70 to 99" });
    });

    it("parses single-bound inequalities (< X, > X)", () => {
      const lessThan = parseReferenceRangeString("< 200");
      expect(lessThan).toEqual({ low: null, high: 200, isLessThan: true, isGreaterThan: false, rawText: "< 200" });

      const greaterThan = parseReferenceRangeString("> 60");
      expect(greaterThan).toEqual({ low: 60, high: null, isLessThan: false, isGreaterThan: true, rawText: "> 60" });
    });

    it("returns null for missing, null, empty, or 'Not provided' ranges", () => {
      expect(parseReferenceRangeString(null)).toBeNull();
      expect(parseReferenceRangeString("")).toBeNull();
      expect(parseReferenceRangeString("   ")).toBeNull();
      expect(parseReferenceRangeString("N/A")).toBeNull();
      expect(parseReferenceRangeString("Not provided")).toBeNull();
      expect(parseReferenceRangeString("unknown")).toBeNull();
    });
  });

  describe("Range Classification & Anti-Hallucination Constraints", () => {
    it("classifies values strictly as LOW, NORMAL, or HIGH for interval bounds", () => {
      // Hemoglobin reference interval: 12.0 - 15.5
      expect(evaluateReferenceStatus("9.4", "12.0 - 15.5").status).toBe("LOW");
      expect(evaluateReferenceStatus("13.5", "12.0 - 15.5").status).toBe("NORMAL");
      expect(evaluateReferenceStatus("16.8", "12.0 - 15.5").status).toBe("HIGH");
    });

    it("evaluates upper bound inequalities (< 200)", () => {
      expect(evaluateReferenceStatus("180", "< 200").status).toBe("NORMAL");
      expect(evaluateReferenceStatus("240", "< 200").status).toBe("HIGH");
    });

    it("evaluates lower bound inequalities (> 60)", () => {
      expect(evaluateReferenceStatus("88", "> 60").status).toBe("NORMAL");
      expect(evaluateReferenceStatus("45", "> 60").status).toBe("LOW");
    });

    it("CRITICAL REQUIREMENT: strictly returns NOT_PROVIDED when report range is missing", () => {
      // Even though Fasting Glucose is commonly 70-99 in medical textbooks,
      // if the source report omits the range, MedLens MUST NOT hallucinate or assume it.
      const result = evaluateReferenceStatus("142", null);
      expect(result.status).toBe("NOT_PROVIDED");
      expect(result.normalizedRange).toBeNull();
      expect(result.numericVal).toBe(142);

      const emptyResult = evaluateReferenceStatus("5.8", "");
      expect(emptyResult.status).toBe("NOT_PROVIDED");
      expect(emptyResult.normalizedRange).toBeNull();
    });
  });
});
