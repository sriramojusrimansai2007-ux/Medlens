import React from "react";
import { LabResult } from "@/lib/types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { X, FileText, Calendar, ShieldCheck, History, Info } from "lucide-react";

interface ProvenanceDrawerProps {
  item: LabResult | null;
  onClose: () => void;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="provenance-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" aria-hidden="true" />
            <h2 id="provenance-title" className="text-base font-bold text-slate-900">
              Source & Provenance Inspector
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close provenance inspector"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* Test Item Overview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-slate-500">{item.panelCategory}</span>
              <ProvenanceBadge tier={item.provenance} interactive={false} />
            </div>
            <div className="text-lg font-bold text-slate-900">{item.testName}</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">
              {item.value} <span className="text-sm font-medium text-slate-500">{item.unit}</span>
            </div>
          </div>

          {/* Provenance Metadata Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Provenance Metadata</h3>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
              <FileText className="w-4 h-4 text-slate-500 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Source Document</div>
                <div className="font-semibold text-slate-800 break-all">{item.sourceReportName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Collection / Report Date</div>
                <div className="font-semibold text-slate-800">{item.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
              <ShieldCheck className="w-4 h-4 text-slate-500 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Extraction Confidence</div>
                <div className="font-semibold text-slate-800">{(item.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
              <Info className="w-4 h-4 text-slate-500 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Reference Range Origin</div>
                <div className="font-semibold text-slate-800">
                  {item.referenceRange ? (
                    <span>
                      {item.referenceRange} <span className="text-xs text-slate-400 font-normal">(Direct from report)</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">
                      Not provided in source report (Zero external hallucination)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {item.observation && (
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="text-xs text-slate-500 font-medium mb-1">Source Observation / Note</div>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-2 rounded">{item.observation}</p>
              </div>
            )}
          </div>

          {/* Audit Trail History if edited */}
          {item.auditTrail && item.auditTrail.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-500" aria-hidden="true" />
                Human Audit History
              </h3>
              <div className="space-y-2">
                {item.auditTrail.map((audit, i) => (
                  <div key={i} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-emerald-900">
                      <span>Edited: {audit.field}</span>
                      <span>{new Date(audit.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-600">
                      Changed from <span className="line-through text-red-600 font-mono">{audit.originalValue}</span> to{" "}
                      <span className="font-bold text-emerald-700 font-mono">{audit.newValue}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Verified by: {audit.verifiedBy}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrity Note */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-900">
            <strong>Clinical Integrity Guarantee:</strong> MedLens maintains provenance metadata on every data point so that clinicians and evaluators can verify exactly where each observation originated.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

