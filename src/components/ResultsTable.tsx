import React, { useState, useMemo } from "react";
import { LabResult, RangeStatus } from "@/lib/types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { 
  ArrowUp, 
  ArrowDown, 
  Check, 
  HelpCircle, 
  Edit3, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileSpreadsheet,
  Info
} from "lucide-react";

interface ResultsTableProps {
  results: LabResult[];
  onEditItem: (item: LabResult) => void;
  onInspectItem: (item: LabResult) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onEditItem, onInspectItem }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ABNORMAL" | "NOT_PROVIDED" | "VERIFIED">("ALL");

  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const matchesSearch = item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.panelCategory.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "ABNORMAL") {
        return item.referenceStatus === "LOW" || item.referenceStatus === "HIGH";
      }
      if (statusFilter === "NOT_PROVIDED") {
        return item.referenceStatus === "NOT_PROVIDED";
      }
      if (statusFilter === "VERIFIED") {
        return item.isVerified;
      }
      return true;
    });
  }, [results, searchQuery, statusFilter]);

  // Group by panel category
  const groupedPanels = useMemo(() => {
    const groups: { [key: string]: LabResult[] } = {};
    filteredResults.forEach((item) => {
      const panel = item.panelCategory || "General Diagnostic Tests";
      if (!groups[panel]) groups[panel] = [];
      groups[panel].push(item);
    });
    return groups;
  }, [filteredResults]);

  const abnormalCount = results.filter((r) => r.referenceStatus === "LOW" || r.referenceStatus === "HIGH").length;
  const noRangeCount = results.filter((r) => r.referenceStatus === "NOT_PROVIDED").length;
  const verifiedCount = results.filter((r) => r.isVerified).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">3. Structured Medical Record & Range Matrix</h2>
              <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                {results.length} Tests
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated strictly against source ranges with zero external range hallucination
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg border transition ${
              statusFilter === "ALL"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
            }`}
          >
            All ({results.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ABNORMAL")}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1 ${
              statusFilter === "ABNORMAL"
                ? "bg-rose-700 text-white border-rose-700"
                : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
            }`}
          >
            <ArrowUp className="w-3 h-3" />
            Abnormal ({abnormalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("NOT_PROVIDED")}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1 ${
              statusFilter === "NOT_PROVIDED"
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            No Range in Source ({noRangeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("VERIFIED")}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1 ${
              statusFilter === "VERIFIED"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Human Verified ({verifiedCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search laboratory tests, panels, or observations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {results.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            No medical reports uploaded yet. Upload a report above or select a sample report.
          </div>
        ) : Object.keys(groupedPanels).length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No tests match your active filter or search query.
          </div>
        ) : (
          Object.entries(groupedPanels).map(([panelName, panelItems]) => (
            <div key={panelName} className="border-b last:border-b-0 border-slate-100">
              {/* Panel Header */}
              <div className="px-6 py-2.5 bg-slate-50/80 border-y border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {panelName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {panelItems.length} observation{panelItems.length === 1 ? "" : "s"}
                </span>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-500 font-semibold">
                    <th scope="col" className="py-2.5 px-6">Test Name</th>
                    <th scope="col" className="py-2.5 px-4">Value</th>
                    <th scope="col" className="py-2.5 px-4">Units</th>
                    <th scope="col" className="py-2.5 px-4">Source Reference Range</th>
                    <th scope="col" className="py-2.5 px-4">Status</th>
                    <th scope="col" className="py-2.5 px-4">Provenance</th>
                    <th scope="col" className="py-2.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {panelItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        item.isVerified ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      {/* Test Name */}
                      <td className="py-3 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{item.testName}</span>
                          {item.isVerified && (
                            <span title="Human Verified" className="text-emerald-600">
                              <ShieldCheck className="w-3.5 h-3.5 inline" aria-label="Verified by user" />
                            </span>
                          )}
                        </div>
                        {item.observation && (
                          <div className="text-[11px] text-slate-400 font-normal italic mt-0.5">
                            {item.observation}
                          </div>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-sm">
                        {item.value}
                        {item.originalExtractedValue && item.originalExtractedValue !== item.value && (
                          <span
                            className="block text-[10px] text-slate-400 font-normal line-through"
                            title="Original OCR Extracted Value"
                          >
                            Orig: {item.originalExtractedValue}
                          </span>
                        )}
                      </td>

                      {/* Units */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {item.unit || "—"}
                      </td>

                      {/* Reference Range (Strict from source) */}
                      <td className="py-3 px-4 font-mono">
                        {item.referenceRange ? (
                          <span className="text-slate-800 font-medium">{item.referenceRange}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Info className="w-3 h-3 text-amber-600" aria-hidden="true" />
                            Not provided
                          </span>
                        )}
                      </td>

                      {/* Range Status (Dual-channel text + icon + color) */}
                      <td className="py-3 px-4">
                        <StatusBadge status={item.referenceStatus} />
                      </td>

                      {/* Provenance Badge */}
                      <td className="py-3 px-4">
                        <ProvenanceBadge
                          tier={item.provenance}
                          onClick={() => onInspectItem(item)}
                        />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEditItem(item)}
                            aria-label={`Edit or verify ${item.testName}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
                          >
                            <Edit3 className="w-3 h-3 text-sky-600" aria-hidden="true" />
                            <span>{item.isVerified ? "Edit" : "Verify"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: RangeStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "LOW":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300"
          aria-label="Status: Low value"
        >
          <ArrowDown className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
          <span>LOW</span>
        </span>
      );
    case "HIGH":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300"
          aria-label="Status: High value"
        >
          <ArrowUp className="w-3.5 h-3.5 text-rose-700" aria-hidden="true" />
          <span>HIGH</span>
        </span>
      );
    case "NORMAL":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
          aria-label="Status: Normal value"
        >
          <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
          <span>NORMAL</span>
        </span>
      );
    case "NOT_PROVIDED":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300"
          aria-label="Status: Reference range not provided in source report"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>Not provided</span>
        </span>
      );
    default:
      return null;
  }
};

