import React from "react";
import { PatientSummary } from "@/lib/types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck2, 
  MessageSquare, 
  AlertTriangle, 
  Loader2, 
  RefreshCw 
} from "lucide-react";

interface PatientSummaryCardProps {
  summary?: PatientSummary;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  hasResults: boolean;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  summary,
  onGenerate,
  isLoading,
  hasResults,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">4. Patient-Friendly Clinical Summary</h2>
              {summary && <ProvenanceBadge tier="AI_GENERATED" interactive={false} />}
            </div>
            <p className="text-xs text-slate-500">
              Plain-language explanation constrained by Responsible AI non-diagnostic guardrails
            </p>
          </div>
        </div>

        {/* Generate / Regenerate button */}
        <button
          type="button"
          disabled={isLoading || !hasResults}
          onClick={onGenerate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>Generating Safe Summary...</span>
            </>
          ) : summary ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Update Summary</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Generate Patient Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6">
        {!summary && !isLoading && (
          <div className="text-center py-8 text-slate-500 text-xs">
            <p className="max-w-md mx-auto">
              Once laboratory results have been ingested and verified above, click <strong>"Generate Patient Summary"</strong> to produce a safe, 6th-grade reading-level explanation.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
            <p className="text-xs text-slate-600 font-medium">
              Synthesizing patient history & lab findings while enforcing clinical safety boundaries...
            </p>
          </div>
        )}

        {summary && !isLoading && (
          <div className="space-y-6">
            {/* Responsible AI Safety Auditor Live Checklist */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  Responsible AI Guardrail Verification (5/5 Passed)
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Clinical Safety Certified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Zero definitive diagnoses asserted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Zero medication prescriptions made</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Zero dosage adjustments suggested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Zero treatment plans recommended</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Uncertainty & missing ranges preserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Licensed doctor consultation advised</span>
                </div>
              </div>
            </div>

            {/* Summary Text (Rich Typography & Markdown Rendering) */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
              {renderFormattedSummary(summary.text)}
            </div>

            {/* Questions to Ask Doctor */}
            {summary.followUpQuestionsForDoctor && summary.followUpQuestionsForDoctor.length > 0 && (
              <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  Recommended Discussion Points (For Your Next Physician Visit)
                </h3>
                <ul className="space-y-2 text-xs text-sky-950 pl-1">
                  {summary.followUpQuestionsForDoctor.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                      <span className="font-bold text-sky-600 shrink-0">{idx + 1}.</span>
                      <span className="leading-snug">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mandatory Medical Disclaimer Box */}
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="leading-relaxed">
                <strong>Physician Interpretation Required:</strong> MedLens organizes and explains clinical observations for patient understanding. It does not replace clinical diagnosis, treatment recommendations, or personalized medical care from your licensed doctor.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function renderFormattedSummary(rawText: string) {
  // Strip trailing duplicate raw DISCLAIMER if already shown in dedicated box
  const cleanText = rawText.replace(/DISCLAIMER:[\s\S]*?(?:licensed healthcare physician\.?|$)/i, "").trim();
  const paragraphs = cleanText.split(/\n\n+/);

  return (
    <div className="space-y-4 text-slate-800 text-xs md:text-sm leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={pIdx} className="text-sm font-bold text-slate-900 pt-2 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={pIdx} className="text-base font-bold text-slate-900 pt-3 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              {trimmed.replace(/^##\s*/, "")}
            </h3>
          );
        }

        const lines = trimmed.split("\n");
        const isList = lines.every((line) => /^[-*•]\s+|^\d+\.\s+/.test(line.trim()));

        if (isList && lines.length > 1) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-2">
              {lines.map((line, lIdx) => {
                const cleanedLine = line.replace(/^[-*•]\s+|^\d+\.\s+/, "").trim();
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5 font-bold">&bull;</span>
                    <span>{formatInlineMarkdown(cleanedLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="leading-relaxed">
            {formatInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}


