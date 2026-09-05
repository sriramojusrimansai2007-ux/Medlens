import { z } from "zod";

export type ProvenanceTier = 
  | 'PATIENT_PROVIDED' 
  | 'REPORT_EXTRACTED' 
  | 'AI_GENERATED' 
  | 'DERIVED_FROM_SOURCE' 
  | 'USER_VERIFIED';

export type RangeStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'NOT_PROVIDED';

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface PatientIntake {
  id: string;
  fullName: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  symptoms: string[];
  existingConditions: string[];
  allergies: string[];
  medications: Medication[];
  notes?: string;
  provenance: 'PATIENT_PROVIDED';
  createdAt: string;
}

export interface AuditEntry {
  originalValue: string;
  newValue: string;
  field: string;
  verifiedBy: string;
  timestamp: string;
}

export interface LabResult {
  id: string;
  panelCategory: string; // e.g. "Complete Blood Count (CBC)", "Metabolic Panel", "Thyroid Profile"
  testName: string;
  value: string; // Raw string value (e.g. "12.4", "<0.01", "Negative")
  numericValue: number | null; // Parsed numeric value for comparison if available
  unit: string;
  referenceRange: string | null; // MUST be null if missing in report
  referenceStatus: RangeStatus; // LOW, NORMAL, HIGH, or NOT_PROVIDED
  sourceReportName: string;
  date: string;
  observation?: string;
  confidence: number; // Extraction confidence (0.0 to 1.0)
  provenance: ProvenanceTier;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  originalExtractedValue?: string;
  auditTrail?: AuditEntry[];
}

export interface PatientSummary {
  text: string;
  readingLevel: string; // e.g. "6th-8th Grade (Plain Language)"
  generatedAt: string;
  safetyChecksPassed: boolean;
  disclaimer: string;
  keyPoints: string[];
  followUpQuestionsForDoctor: string[];
  provenance: 'AI_GENERATED';
}

export interface PatientRecord {
  patient: PatientIntake;
  labResults: LabResult[];
  summary?: PatientSummary;
}

// Zod Validation Schemas
export const MedicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
});

export const PatientIntakeSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 11)),
  fullName: z.string().min(1, "Patient name is required"),
  age: z.number().int().min(0, "Age must be positive").max(130, "Age exceeds valid range"),
  sex: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
  symptoms: z.array(z.string()).default([]),
  existingConditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  medications: z.array(MedicationSchema).default([]),
  notes: z.string().optional(),
  provenance: z.literal('PATIENT_PROVIDED').default('PATIENT_PROVIDED'),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export const RawExtractedLabItemSchema = z.object({
  panelCategory: z.string().default("General Chemistry"),
  testName: z.string().min(1, "Test name is required"),
  value: z.string().min(1, "Value is required"),
  unit: z.string().default(""),
  referenceRange: z.string().nullable().optional(), // Must be null or omitted if absent
  date: z.string().default(new Date().toISOString().split('T')[0]),
  observation: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.95),
});

export const RawExtractionResponseSchema = z.object({
  reportDate: z.string().optional(),
  labName: z.string().optional(),
  results: z.array(RawExtractedLabItemSchema),
});
