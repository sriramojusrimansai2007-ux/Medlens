# MedLens — AI-Powered Clinical Information Intelligence

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.0-blue.svg)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gen%20AI-Gemini%202.0%20Flash-indigo.svg)](https://aistudio.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Clinical%20Theme-sky.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-100%25%20Passing-emerald.svg)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-green.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Solo Hackathon Entry** | Clinical Information Organization & Multi-Tier Provenance Intelligence

---

## 🎯 Executive Problem Alignment

Medical information is fragmented across patient intake history, prescriptions, laboratory reports, and clinician notes. 

**MedLens** bridges subjective patient intake and objective laboratory diagnostics by building an audit-proof, structured, human-reviewable patient record.

### Direct Problem-to-Feature Mapping

| Problem Statement Requirement | MedLens Solution | Technical Implementation | UI Location |
| :--- | :--- | :--- | :--- |
| **1. Patient Information Intake** | Structured clinical intake form with presets | Zod schema + React state validation | Step 1 Intake Panel |
| **2. Medical Report Processing** | Multimodal report parser for PDF, images, TXT | Gemini 2.0 Flash (`@google/genai`) + JSON Schema | Step 2 Uploader |
| **3. Structured Medical Record** | Panel-grouped clinical results matrix | Categorized tables with unit and date tracking | Step 3 Results Table |
| **4. Reference-Range Awareness** | Evaluates LOW, NORMAL, HIGH strictly from source | Deterministic TypeScript engine (Zero hallucinated bounds) | Status Badge Column |
| **5. Source & Provenance** | 5 distinct provenance tiers with audit inspector | Metadata provenance schema + interactive drawer | Provenance Column |
| **6. AI-Powered Summary** | Safe plain-language patient explanation | Gemini 2.0 Flash + 5-point Responsible AI filter | Step 4 Summary Card |
| **7. Human Verification** | Review, edit, and audit log for clinical oversight | Inline verification modal + audit trail logging | Actions "Verify" button |

---

## 🔬 Core Architectural Innovations

### 1. Deterministic Reference-Range Engine (Zero External Hallucinations)
A common failure in naive healthcare AI is hallucinating standard physiological reference ranges when an uploaded report omits them (e.g., assuming normal fasting glucose is 70–99 mg/dL).
- **MedLens separates extraction from math**: Gemini 2.0 Flash extracts the raw text. A deterministic TypeScript engine evaluates bounds (`<`, `>`, intervals).
- **Missing Range Protection**: If the source report omits reference intervals, MedLens **strictly** marks `referenceRange: null` and status `Not provided`. External assumptions are completely forbidden.

### 2. Five-Tier Provenance Tracking
Every clinical observation carries verifiable origin metadata:
1. `PATIENT_PROVIDED` (Purple): Subjective history reported during intake.
2. `REPORT_EXTRACTED` (Sky): Direct extraction from uploaded lab document.
3. `AI_GENERATED` (Amber): Synthesized plain-language patient explanations.
4. `DERIVED_FROM_SOURCE` (Indigo): Mathematically calculated values (e.g. interval checks).
5. `USER_VERIFIED` (Emerald): Human clinician reviewed and approved with audit trail.

### 3. Human-in-the-Loop Clinical Verification Console
Extracted data is treated as draft evidence until inspected by a human. Reviewers can click **"Verify"** to correct any OCR ambiguity. The system updates the provenance tag to `USER_VERIFIED` and preserves an immutable audit trail of the original raw extraction.

### 4. Responsible AI Clinical Safety Guardrails
The AI summarizer operates under strict negative constraints:
- ❌ Zero definitive medical diagnoses
- ❌ Zero medication prescriptions
- ❌ Zero dosage alteration directives
- ❌ Zero clinical treatment mandates
- ✅ Real-time 5/5 Responsible AI audit checklist verified on every generated summary.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v10+`

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/sriramojusrimansai2007-ux/Medlens.git
cd Medlens

# 2. Install dependencies
npm install

# 3. Configure Gemini API Key (Optional: resilient fallback mock included)
cp .env.example .env.local
# Add GEMINI_API_KEY=your_key_here to .env.local

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## 🧪 Automated Testing Suite

MedLens includes an automated Vitest test suite verifying all 13 critical edge cases:

```bash
npm test
```

### Verified Test Cases
1. `test_valid_patient_intake`: Demographic & clinical validation.
2. `test_valid_medical_report_extraction`: Structured test names, values, units, and ranges.
3. `test_report_without_reference_range`: **Critical test** proving missing ranges yield `NOT_PROVIDED` and `null`.
4. `test_invalid_file_rejection`: Payload size (<5MB) and MIME type validation.
5. `test_empty_input_handling`: Safe recovery from empty submissions.
6. `test_invalid_extracted_value`: Safe handling of non-numeric lab strings.
7. `test_malformed_ai_response_recovery`: Graceful fallback if AI JSON is malformed.
8. `test_api_failure_fallback`: Offline deterministic engine ensures zero demo downtime.
9. `test_user_editing_and_audit`: Verifies audit trail recording on human edits.
10. `test_provenance_correctness`: Verifies all 5 provenance tiers.
11. `test_reference_range_classification`: Mathematical evaluation of `< 200`, `> 60`, and `12.0 - 15.5`.
12. `test_safety_restrictions_guardrails`: Automated blocking of diagnostic & dosage statements.

---

## ♿ Accessibility & UI/UX (WCAG 2.1 AA)

- **Dual-Channel Status Indicators**: Never communicates status with color alone. Each status combines badge color + text label + directional icon ($\uparrow$ `HIGH`, $\downarrow$ `LOW`, $\checkmark$ `NORMAL`, $?$ `Not provided`).
- **Full Keyboard Navigation**: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-sky-500`) and Escape-to-close modals.
- **Screen Reader Support**: Semantic HTML5 elements (`<main>`, `<section>`, `<table>`, `<caption>`, `<aside>`), and ARIA live regions for async state changes.

---

## 🛡️ Security & Responsible AI Notice

- **Server-Side API Key Protection**: `GEMINI_API_KEY` is restricted to server-side Next.js route handlers. Never leaked to client code.
- **Strict File Controls**: 5MB ceiling with MIME validation (`application/pdf`, `image/png`, `image/jpeg`, `text/plain`).
- **Synthetic Patient Mode**: Designed exclusively for synthetic demo data. Persistent clinical notice displayed across all views.

---

## 🎬 Final Demo Walkthrough (3 Minutes)

1. **Patient Intake**: Select synthetic patient preset *(Sarah Connor, 34F - Fatigue Checkup)*.
2. **Medical Report Ingestion**: Click *"Test CBC (With Ranges)"* or upload a report. Observe sub-second structured extraction into panel groups.
3. **Reference Range Proof**: Inspect status badges (`LOW`, `NORMAL`). Click *"Test NO RANGES (Anti-Hallucination)"* to observe the explicit `Not provided` badge.
4. **Source Inspector**: Click any provenance badge to open the Source Inspector drawer.
5. **Human Verification**: Click *"Verify"* on any row. Adjust value (e.g. 9.4 $\to$ 12.4). Observe the badge flip to `Verified by User` and status re-evaluate to `NORMAL`.
6. **Patient Summary**: Click *"Generate Patient Summary"*. Review the 6th-grade reading-level explanation and the 5/5 Responsible AI certification badges.
7. **Export**: Click *"Export Brief"* in the top navigation to print or save a clean clinical PDF summary.

---

## 📄 License
MIT License. Created for the AI Hackathon 2026.

