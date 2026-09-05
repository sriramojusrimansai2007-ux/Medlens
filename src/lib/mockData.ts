import { PatientIntake, LabResult } from "./types";
import { evaluateReferenceStatus } from "./rangeEngine";

export const BLANK_PATIENT: PatientIntake = {
  id: "pat-initial",
  fullName: "",
  age: 0,
  sex: "Prefer not to say",
  symptoms: [],
  existingConditions: [],
  allergies: [],
  medications: [],
  notes: "",
  provenance: "PATIENT_PROVIDED",
  createdAt: new Date().toISOString(),
};

export const SYNTHETIC_PATIENTS: PatientIntake[] = [
  {
    id: "pat-sarah-34",
    fullName: "Sarah Connor (Synthetic Demo)",
    age: 34,
    sex: "Female",
    symptoms: ["Chronic Fatigue", "Lightheadedness upon standing", "Cold hands and feet"],
    existingConditions: ["None reported"],
    allergies: ["Penicillin (Hives)"],
    medications: [
      { name: "Daily Multivitamin", dosage: "1 tablet", frequency: "Once daily" }
    ],
    notes: "Patient presents for routine follow-up regarding 3-month history of fatigue.",
    provenance: "PATIENT_PROVIDED",
    createdAt: "2026-09-01T09:30:00.000Z",
  },
  {
    id: "pat-robert-58",
    fullName: "Robert Chen (Synthetic Demo)",
    age: 58,
    sex: "Male",
    symptoms: ["Increased thirst", "Frequent nighttime urination", "Mild blurred vision"],
    existingConditions: ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
    allergies: ["Sulfa antibiotics (Rash)"],
    medications: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily with meals" },
      { name: "Lisinopril", dosage: "10 mg", frequency: "Once daily in the morning" }
    ],
    notes: "Annual metabolic surveillance and diabetic panel review.",
    provenance: "PATIENT_PROVIDED",
    createdAt: "2026-08-28T14:15:00.000Z",
  },
  {
    id: "pat-elena-42",
    fullName: "Elena Rostova (Synthetic Demo)",
    age: 42,
    sex: "Female",
    symptoms: ["Unexplained weight gain", "Dry brittle hair", "Persistent constipation"],
    existingConditions: ["None reported"],
    allergies: ["No known drug allergies (NKDA)"],
    medications: [],
    notes: "Evaluating possible endocrine etiology for lethargy and weight changes.",
    provenance: "PATIENT_PROVIDED",
    createdAt: "2026-09-03T11:00:00.000Z",
  }
];

export interface SampleReportPreset {
  id: string;
  title: string;
  category: string;
  hasReferenceRanges: boolean;
  sourceDocumentName: string;
  rawReportText: string;
  expectedResults: Omit<LabResult, "id">[];
}

export const SAMPLE_REPORTS: SampleReportPreset[] = [
  {
    id: "report-cbc-anemia",
    title: "1. Complete Blood Count (CBC) — Microcytic Anemia (With Source Ranges)",
    category: "Hematology",
    hasReferenceRanges: true,
    sourceDocumentName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
    rawReportText: `QUEST DIAGNOSTICS - CLINICAL REPORT
PATIENT: Synthetic Demo Patient | DATE: 2026-09-01
SPECIMEN: Whole Blood EDTA

TEST NAME                    VALUE     UNITS      REFERENCE INTERVAL
---------------------------------------------------------------------
White Blood Cell (WBC)       6.8       x10^3/uL   4.5 - 11.0
Red Blood Cell (RBC)         3.8       x10^6/uL   4.0 - 5.2
Hemoglobin (HGB)             9.4       g/dL       12.0 - 15.5
Hematocrit (HCT)             29.8      %          36.0 - 46.0
Mean Corpuscular Vol (MCV)   72.0      fL         80.0 - 100.0
Platelet Count               245       x10^3/uL   150 - 450

Observations: Marked microcytosis and hypochromia observed on peripheral smear examination.`,
    expectedResults: [
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "White Blood Cell (WBC)",
        value: "6.8",
        numericValue: 6.8,
        unit: "x10^3/uL",
        referenceRange: "4.5 - 11.0",
        referenceStatus: "NORMAL",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "Red Blood Cell (RBC)",
        value: "3.8",
        numericValue: 3.8,
        unit: "x10^6/uL",
        referenceRange: "4.0 - 5.2",
        referenceStatus: "LOW",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "Hemoglobin (HGB)",
        value: "9.4",
        numericValue: 9.4,
        unit: "g/dL",
        referenceRange: "12.0 - 15.5",
        referenceStatus: "LOW",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "Hematocrit (HCT)",
        value: "29.8",
        numericValue: 29.8,
        unit: "%",
        referenceRange: "36.0 - 46.0",
        referenceStatus: "LOW",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "Mean Corpuscular Vol (MCV)",
        value: "72.0",
        numericValue: 72.0,
        unit: "fL",
        referenceRange: "80.0 - 100.0",
        referenceStatus: "LOW",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.97,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Complete Blood Count (CBC)",
        testName: "Platelet Count",
        value: "245",
        numericValue: 245,
        unit: "x10^3/uL",
        referenceRange: "150 - 450",
        referenceStatus: "NORMAL",
        sourceReportName: "Quest_CBC_Diagnostic_Lab_2026.pdf",
        date: "2026-09-01",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      }
    ]
  },
  {
    id: "report-cmp-metabolic",
    title: "2. Comprehensive Metabolic Panel (CMP) — Elevated Glucose (With Source Ranges)",
    category: "Metabolic",
    hasReferenceRanges: true,
    sourceDocumentName: "Labcorp_CMP_Metabolic_Report.pdf",
    rawReportText: `LABCORP CLINICAL BIOCHEMISTRY
DATE: 2026-08-28 | SPECIMEN: Serum Gel Separator Tube

TEST NAME                    VALUE     UNITS      REFERENCE INTERVAL
---------------------------------------------------------------------
Glucose, Fasting             142       mg/dL      70 - 99
Blood Urea Nitrogen (BUN)    16        mg/dL      7 - 20
Creatinine                   0.9       mg/dL      0.6 - 1.2
eGFR                         88        mL/min     > 60
Sodium                       139       mmol/L     135 - 145
Potassium                    4.2       mmol/L     3.5 - 5.1
Total Bilirubin              0.6       mg/dL      0.2 - 1.2
ALT (SGPT)                   28        U/L        < 45

Observations: Fasting specimen verified. Elevated fasting blood sugar noted.`,
    expectedResults: [
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Glucose, Fasting",
        value: "142",
        numericValue: 142,
        unit: "mg/dL",
        referenceRange: "70 - 99",
        referenceStatus: "HIGH",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Blood Urea Nitrogen (BUN)",
        value: "16",
        numericValue: 16,
        unit: "mg/dL",
        referenceRange: "7 - 20",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Creatinine",
        value: "0.9",
        numericValue: 0.9,
        unit: "mg/dL",
        referenceRange: "0.6 - 1.2",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "eGFR",
        value: "88",
        numericValue: 88,
        unit: "mL/min",
        referenceRange: "> 60",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.96,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Sodium",
        value: "139",
        numericValue: 139,
        unit: "mmol/L",
        referenceRange: "135 - 145",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Potassium",
        value: "4.2",
        numericValue: 4.2,
        unit: "mmol/L",
        referenceRange: "3.5 - 5.1",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "Total Bilirubin",
        value: "0.6",
        numericValue: 0.6,
        unit: "mg/dL",
        referenceRange: "0.2 - 1.2",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Comprehensive Metabolic Panel (CMP)",
        testName: "ALT (SGPT)",
        value: "28",
        numericValue: 28,
        unit: "U/L",
        referenceRange: "< 45",
        referenceStatus: "NORMAL",
        sourceReportName: "Labcorp_CMP_Metabolic_Report.pdf",
        date: "2026-08-28",
        confidence: 0.97,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      }
    ]
  },
  {
    id: "report-endocrine-no-ranges",
    title: "3. Endocrine & Vitamin Panel — NO REFERENCE RANGES (Anti-Hallucination Demo)",
    category: "Endocrinology",
    hasReferenceRanges: false,
    sourceDocumentName: "Specialty_Endocrine_NoRefRange.txt",
    rawReportText: `SPECIALTY ENDOCRINOLOGY LAB SERVICES
PATIENT: Synthetic Demo Patient | DATE: 2026-09-03
NOTICE: Custom research assay. Specific institutional reference intervals were NOT supplied on this requisition.

TEST NAME                          VALUE     UNITS
------------------------------------------------------
Thyroid Stimulating Hormone (TSH)  5.8       uIU/mL
Free Thyroxine (Free T4)           0.9       ng/dL
25-Hydroxy Vitamin D               18        ng/mL
Antinuclear Antibodies (ANA)       1:160     titer

Observations: Testing completed on automated immunofluorescence platform. Reference intervals omitted per requisition protocol.`,
    expectedResults: [
      {
        panelCategory: "Endocrine Profile",
        testName: "Thyroid Stimulating Hormone (TSH)",
        value: "5.8",
        numericValue: 5.8,
        unit: "uIU/mL",
        referenceRange: null, // STRICTLY NULL
        referenceStatus: "NOT_PROVIDED", // STRICTLY NOT_PROVIDED
        sourceReportName: "Specialty_Endocrine_NoRefRange.txt",
        date: "2026-09-03",
        observation: "Reference intervals omitted per requisition protocol.",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Endocrine Profile",
        testName: "Free Thyroxine (Free T4)",
        value: "0.9",
        numericValue: 0.9,
        unit: "ng/dL",
        referenceRange: null,
        referenceStatus: "NOT_PROVIDED",
        sourceReportName: "Specialty_Endocrine_NoRefRange.txt",
        date: "2026-09-03",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Endocrine Profile",
        testName: "25-Hydroxy Vitamin D",
        value: "18",
        numericValue: 18,
        unit: "ng/mL",
        referenceRange: null,
        referenceStatus: "NOT_PROVIDED",
        sourceReportName: "Specialty_Endocrine_NoRefRange.txt",
        date: "2026-09-03",
        confidence: 0.97,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "Endocrine Profile",
        testName: "Antinuclear Antibodies (ANA)",
        value: "1:160",
        numericValue: null,
        unit: "titer",
        referenceRange: null,
        referenceStatus: "NOT_PROVIDED",
        sourceReportName: "Specialty_Endocrine_NoRefRange.txt",
        date: "2026-09-03",
        confidence: 0.95,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      }
    ]
  },
  {
    id: "report-critical-panic-demo",
    title: "4. Emergency & STAT Panel — Hospital Panic Values (Clinical Alert Demo)",
    category: "Critical Care",
    hasReferenceRanges: true,
    sourceDocumentName: "General_Hospital_Stat_Critical_Lab.txt",
    rawReportText: `GENERAL HOSPITAL STAT PATHOLOGY LAB
PATIENT: Synthetic Demo Patient | DATE: 2026-09-05 | PRIORITY: STAT
SPECIMEN: Blood / Plasma Heparin

TEST NAME                    VALUE     UNITS      REFERENCE INTERVAL
---------------------------------------------------------------------
Potassium                    6.4       mmol/L     3.5 - 5.0
Glucose, Random              435       mg/dL      70 - 140
Hemoglobin (HGB)             6.3       g/dL       12.0 - 16.0
Platelet Count               16        x10^3/uL   150 - 450
Sodium                       138       mmol/L     135 - 145
Creatinine                   1.1       mg/dL      0.7 - 1.3

Observations: Critical alert telephone notification dispatched to clinical floor per institutional panic value protocol.`,
    expectedResults: [
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Potassium",
        value: "6.4",
        numericValue: 6.4,
        unit: "mmol/L",
        referenceRange: "3.5 - 5.0",
        referenceStatus: "HIGH",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Glucose, Random",
        value: "435",
        numericValue: 435,
        unit: "mg/dL",
        referenceRange: "70 - 140",
        referenceStatus: "HIGH",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Hemoglobin (HGB)",
        value: "6.3",
        numericValue: 6.3,
        unit: "g/dL",
        referenceRange: "12.0 - 16.0",
        referenceStatus: "LOW",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Platelet Count",
        value: "16",
        numericValue: 16,
        unit: "x10^3/uL",
        referenceRange: "150 - 450",
        referenceStatus: "LOW",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Sodium",
        value: "138",
        numericValue: 138,
        unit: "mmol/L",
        referenceRange: "135 - 145",
        referenceStatus: "NORMAL",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.99,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
      {
        panelCategory: "STAT Critical Care Panel",
        testName: "Creatinine",
        value: "1.1",
        numericValue: 1.1,
        unit: "mg/dL",
        referenceRange: "0.7 - 1.3",
        referenceStatus: "NORMAL",
        sourceReportName: "General_Hospital_Stat_Critical_Lab.txt",
        date: "2026-09-05",
        confidence: 0.98,
        provenance: "REPORT_EXTRACTED",
        isVerified: false,
      },
    ],
  }
];

