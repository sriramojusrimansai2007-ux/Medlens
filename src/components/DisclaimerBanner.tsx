import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside
      aria-label="Clinical Safety and Synthetic Data Notice"
      className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm font-medium"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
          <span>
            <strong>RESPONSIBLE AI CLINICAL NOTICE:</strong> MedLens is an information organization tool for synthetic/demo data. It does <em>not</em> provide medical diagnosis, prescribe medications, or replace licensed physician judgment.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
          <span>Synthetic Patient Mode</span>
        </div>
      </div>
    </aside>
  );
};

