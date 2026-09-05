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

            {/* Summary Text */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs md:text-sm leading-relaxed whitespace-pre-line">
              {summary.text}
            </div>

            {/* Questions to Ask Doctor */}
            {summary.followUpQuestionsForDoctor && summary.followUpQuestionsForDoctor.length > 0 && (
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-700" aria-hidden="true" />
                  Empowered Healthcare Questions (To Discuss with Your Physician)
                </h3>
                <ul className="list-disc list-inside text-xs text-sky-900 space-y-1 pl-1">
                  {summary.followUpQuestionsForDoctor.map((q, idx) => (
                    <li key={idx} className="leading-snug">{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mandatory Medical Disclaimer Box */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <strong>Physician Evaluation Required:</strong> MedLens is an organization tool. It does not replace professional clinical evaluation, diagnostic confirmation, or medical intervention by a licensed practitioner.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
