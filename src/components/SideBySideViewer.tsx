import React from "react";
import { LabResult } from "@/lib/types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { FileText, Eye, CheckCircle2, SplitSquareVertical } from "lucide-react";

interface SideBySideViewerProps {
  sourceText?: string;
  sourceFileName?: string;
  results: LabResult[];
  isOpen: boolean;
  onToggle: () => void;
}

export const SideBySideViewer: React.FC<SideBySideViewerProps> = ({
  sourceText,
  sourceFileName,
  results,
  isOpen,
  onToggle,
}) => {
  if (!isOpen) {
    return (
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open side-by-side source comparison view"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
        >
          <SplitSquareVertical className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
          <span>Toggle Side-by-Side Source View</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* View Header */}
      <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Eye className="w-4 h-4 text-sky-600" aria-hidden="true" />
          <span>Side-by-Side Source Document vs Structured Information Comparison</span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white border border-slate-300 rounded-md transition"
        >
          Close Split View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Side: Source Report Document */}
        <div className="p-5 bg-slate-900 text-slate-100 font-mono text-xs overflow-y-auto max-h-96">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Source: {sourceFileName || "Uploaded Medical Document"}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Raw Source Text
            </span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono">
            {sourceText || "// No raw text available for this upload. Using multimodal scan interpretation."}
          </pre>
        </div>

        {/* Right Side: Structured Extraction Cards */}
        <div className="p-5 bg-slate-50 overflow-y-auto max-h-96 space-y-2.5">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-700">
            <span>Structured Extraction Matrix ({results.length} items)</span>
            <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">
              Zero External Ranges
            </span>
          </div>

          {results.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3 shadow-2xs hover:border-sky-300 transition"
            >
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{r.testName}</span>
                  {r.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Ref: {r.referenceRange || <span className="text-amber-700 font-medium">Not provided</span>}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <span className="font-mono font-bold text-slate-900">
                  {r.value} <span className="text-[10px] text-slate-500 font-normal">{r.unit}</span>
                </span>
                <ProvenanceBadge tier={r.provenance} interactive={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
