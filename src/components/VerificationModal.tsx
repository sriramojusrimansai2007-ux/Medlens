import React, { useState } from "react";
import { LabResult } from "@/lib/types";
import { evaluateReferenceStatus } from "@/lib/rangeEngine";
import { Check, X, ShieldAlert, Edit3 } from "lucide-react";

interface VerificationModalProps {
  item: LabResult | null;
  onClose: () => void;
  onSave: (updatedItem: LabResult) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ item, onClose, onSave }) => {
  if (!item) return null;

  const [testName, setTestName] = useState(item.testName);
  const [value, setValue] = useState(item.value);
  const [unit, setUnit] = useState(item.unit);
  const [referenceRange, setReferenceRange] = useState(item.referenceRange || "");
  const [observation, setObservation] = useState(item.observation || "");
  const [verifierName, setVerifierName] = useState("Clinician / Reviewer");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Re-evaluate reference range deterministically
    const evalResult = evaluateReferenceStatus(value, referenceRange || null);

    const auditTrail = [...(item.auditTrail || [])];
    if (value !== item.value) {
      auditTrail.push({
        field: "value",
        originalValue: item.value,
        newValue: value,
        verifiedBy: verifierName,
        timestamp: new Date().toISOString(),
      });
    }
    if (referenceRange !== (item.referenceRange || "")) {
      auditTrail.push({
        field: "referenceRange",
        originalValue: item.referenceRange || "Not provided",
        newValue: referenceRange || "Not provided",
        verifiedBy: verifierName,
        timestamp: new Date().toISOString(),
      });
    }

    const updated: LabResult = {
      ...item,
      testName,
      value,
      numericValue: evalResult.numericVal,
      unit,
      referenceRange: evalResult.normalizedRange,
      referenceStatus: evalResult.status,
      observation,
      isVerified: true,
      verifiedBy: verifierName,
      verifiedAt: new Date().toISOString(),
      provenance: "USER_VERIFIED",
      originalExtractedValue: item.originalExtractedValue || item.value,
      auditTrail,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-sky-600" aria-hidden="true" />
            <h3 id="modal-headline" className="font-bold text-slate-900 text-base">
              Human Review & Verification
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p>
              AI extraction is treated as draft evidence. Verifying this record will update its provenance to <strong>Verified by User</strong> and preserve an immutable audit trail of corrections.
            </p>
          </div>

          <div>
            <label htmlFor="edit-test-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Test Name
            </label>
            <input
              id="edit-test-name"
              type="text"
              required
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-value" className="block text-xs font-semibold text-slate-700 mb-1">
                Value <span className="text-slate-400 font-normal">(Raw / Extracted)</span>
              </label>
              <input
                id="edit-value"
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-unit" className="block text-xs font-semibold text-slate-700 mb-1">
                Unit
              </label>
              <input
                id="edit-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. g/dL, mg/dL"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="edit-range" className="block text-xs font-semibold text-slate-700">
                Source Reference Range
              </label>
              <span className="text-[11px] text-slate-500">Leave blank if not on report</span>
            </div>
            <input
              id="edit-range"
              type="text"
              value={referenceRange}
              onChange={(e) => setReferenceRange(e.target.value)}
              placeholder="e.g. 12.0 - 15.5 or leave empty"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              *If source report did not contain a range, keep this blank. MedLens will mark it as <em>Not provided</em>.
            </p>
          </div>

          <div>
            <label htmlFor="edit-obs" className="block text-xs font-semibold text-slate-700 mb-1">
              Observations / Pathologist Notes
            </label>
            <input
              id="edit-obs"
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Optional notes or morphological comments"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="edit-verifier" className="block text-xs font-semibold text-slate-700 mb-1">
              Reviewer Name / Role
            </label>
            <input
              id="edit-verifier"
              type="text"
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              Save & Mark Verified
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

