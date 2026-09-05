import React from "react";
import { AlertOctagon, ShieldAlert, ChevronRight } from "lucide-react";
import { CriticalFinding } from "@/lib/criticalValues";

interface CriticalAlertBannerProps {
  findings: CriticalFinding[];
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ findings }) => {
  if (!findings || findings.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-red-50/95 border-2 border-red-300 rounded-2xl p-5 shadow-sm space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-red-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-100 text-red-700 rounded-xl">
            <AlertOctagon className="w-5 h-5 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide">
                Immediate Clinical Attention Observation
              </h3>
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                {findings.length} Panic Value{findings.length === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-xs text-red-800">
              One or more extracted values exceed recognized hospital laboratory alert/panic thresholds
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          Hospital Threshold Alert
        </span>
      </div>

      {/* Critical Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {findings.map((finding, idx) => (
          <div
            key={idx}
            className="bg-white/90 border border-red-200 rounded-xl p-3 flex flex-col justify-between space-y-1.5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">{finding.testName}</span>
              <span className="font-mono font-bold text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                {finding.value} {finding.unit}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              {finding.clinicalContext}
            </p>
            <div className="text-[10px] text-red-800 font-semibold flex items-center gap-1 pt-1 border-t border-slate-100">
              <span>Standard Panic Bound: <strong>{finding.thresholdDescription}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Strict Non-Diagnostic Responsible AI Guardrail */}
      <div className="pt-2 text-[11px] text-red-900/90 leading-relaxed flex items-start gap-1.5 border-t border-red-200/60">
        <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          <strong>Responsible AI Notice:</strong> MedLens identifies these observations strictly against published laboratory panic threshold guidelines for patient safety awareness. This does not constitute emergency medical advice. Please promptly share these findings with your prescribing clinician.
        </span>
      </div>
    </div>
  );
};
