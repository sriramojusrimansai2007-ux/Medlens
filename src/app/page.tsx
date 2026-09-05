"use client";

import React, { useState } from "react";
import { PatientIntake, LabResult, PatientSummary } from "@/lib/types";
import { SYNTHETIC_PATIENTS, SAMPLE_REPORTS, BLANK_PATIENT } from "@/lib/mockData";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Header } from "@/components/Header";
import { PatientIntakeForm } from "@/components/PatientIntakeForm";
import { ReportUploader } from "@/components/ReportUploader";
import { ResultsTable } from "@/components/ResultsTable";
import { PatientSummaryCard } from "@/components/PatientSummaryCard";
import { VerificationModal } from "@/components/VerificationModal";
import { ProvenanceDrawer } from "@/components/ProvenanceDrawer";
import { SideBySideViewer } from "@/components/SideBySideViewer";
import { Shield, Sparkles, CheckCircle2, FileSpreadsheet } from "lucide-react";

export default function MedLensDashboard() {
  // 1. Patient Intake State (Blank clean initial state)
  const [patient, setPatient] = useState<PatientIntake>(BLANK_PATIENT);

  // 2. Structured Lab Results State
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [sourceReportText, setSourceReportText] = useState<string>("");
  const [sourceReportName, setSourceReportName] = useState<string>("");

  // 3. AI Patient Summary State
  const [summary, setSummary] = useState<PatientSummary | undefined>(undefined);

  // 4. Loading States
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  // 5. Modal & Drawer States
  const [editingItem, setEditingItem] = useState<LabResult | null>(null);
  const [inspectingItem, setInspectingItem] = useState<LabResult | null>(null);
  const [isSideBySideOpen, setIsSideBySideOpen] = useState<boolean>(false);

  // Handle Medical Report Ingestion
  const handleExtract = async (payload: { file?: File; text?: string; fileName?: string }) => {
    setIsExtracting(true);
    setSummary(undefined); // Clear old summary on new report

    try {
      let res;
      if (payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);
        setSourceReportName(payload.file.name);

        // Pre-populate source text for side-by-side view if uploading text file
        if (payload.file.name.toLowerCase().endsWith(".txt") || payload.file.type === "text/plain") {
          try {
            const fileText = await payload.file.text();
            setSourceReportText(fileText);
          } catch {}
        }

        res = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });
      } else if (payload.text) {
        setSourceReportText(payload.text);
        setSourceReportName(payload.fileName || "Uploaded_Document.txt");
        res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: payload.text,
            fileName: payload.fileName,
          }),
        });
      } else {
        throw new Error("No file or text payload provided.");
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process report.");
      }

      const data = await res.json();
      const extracted = data.results || [];
      setLabResults(extracted);

      // If sample report, pre-populate source text for side-by-side view
      if (payload.text) {
        setSourceReportText(payload.text);
      }

      // Automatically synthesize clinical patient summary upon successful extraction
      if (extracted.length > 0) {
        generateSummaryInternal(patient, extracted);
      }
    } catch (err: any) {
      console.error("[Dashboard] Extraction error:", err);
      alert(`Error extracting document: ${err.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Helper to generate clinical summary
  const generateSummaryInternal = async (currentPatient: PatientIntake, results: LabResult[]) => {
    if (results.length === 0) return;
    setIsSummarizing(true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: currentPatient,
          labResults: results,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate summary.");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err: any) {
      console.error("[Dashboard] Summary error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle Manual Generating / Refreshing Safe Patient Summary
  const handleGenerateSummary = async () => {
    await generateSummaryInternal(patient, labResults);
  };

  // Handle Saving an Edited Lab Result (Human Verification)
  const handleSaveVerifiedItem = (updatedItem: LabResult) => {
    setLabResults((prev) => {
      const updated = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      // Re-generate summary with updated verified data
      generateSummaryInternal(patient, updated);
      return updated;
    });
  };

  // Print/Export Clinical Brief
  const handlePrint = () => {
    window.print();
  };

  // Reset Dashboard
  const handleReset = () => {
    if (confirm("Reset dashboard to clean state?")) {
      setPatient(BLANK_PATIENT);
      setLabResults([]);
      setSummary(undefined);
      setSourceReportText("");
      setSourceReportName("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60">
      {/* 1. Clinical Safety Disclaimer Header */}
      <DisclaimerBanner />

      {/* 2. Main Navigation Header */}
      <Header
        activePatientName={patient.fullName}
        onPrint={handlePrint}
        onReset={handleReset}
      />

      {/* Main Clinical Workspace */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Step 1: Patient Information Intake */}
        <section aria-labelledby="section-intake">
          <PatientIntakeForm patient={patient} onChange={setPatient} />
        </section>

        {/* Step 2: Medical Report Ingestion */}
        <section aria-labelledby="section-upload">
          <ReportUploader
            onExtract={handleExtract}
            isLoading={isExtracting}
            hasResults={labResults.length > 0}
            resultCount={labResults.length}
          />
        </section>

        {/* Step 3: Structured Medical Record Matrix */}
        {labResults.length > 0 && (
          <section id="section-results" aria-labelledby="section-results" className="space-y-3">
            {/* Optional Side-by-Side Source Split Viewer */}
            <SideBySideViewer
              sourceText={sourceReportText}
              sourceFileName={sourceReportName}
              results={labResults}
              isOpen={isSideBySideOpen}
              onToggle={() => setIsSideBySideOpen(!isSideBySideOpen)}
            />

            <ResultsTable
              results={labResults}
              onEditItem={(item) => setEditingItem(item)}
              onInspectItem={(item) => setInspectingItem(item)}
            />
          </section>
        )}

        {/* Step 4: Safe Patient Summary */}
        <section aria-labelledby="section-summary">
          <PatientSummaryCard
            summary={summary}
            onGenerate={handleGenerateSummary}
            isLoading={isSummarizing}
            hasResults={labResults.length > 0}
          />
        </section>
      </main>

      {/* Human Review & Edit Modal */}
      {editingItem && (
        <VerificationModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveVerifiedItem}
        />
      )}

      {/* Source & Provenance Inspector Drawer */}
      {inspectingItem && (
        <ProvenanceDrawer
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MedLens Clinical Intelligence &bull; Built with Google Gemini 2.0 Flash & Next.js 15</span>
          <span>Responsible AI &bull; Synthetic Demo Patient Mode &bull; WCAG 2.1 AA Compliant</span>
        </div>
      </footer>
    </div>
  );
}

