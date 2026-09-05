import React, { useState, useRef } from "react";
import { SAMPLE_REPORTS, SampleReportPreset } from "@/lib/mockData";
import { UploadCloud, FileText, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ReportUploaderProps {
  onExtract: (payload: { file?: File; text?: string; fileName?: string }) => Promise<void>;
  isLoading: boolean;
  hasResults?: boolean;
  resultCount?: number;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  onExtract,
  isLoading,
  hasResults = false,
  resultCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "presets">("upload");
  const [pastedText, setPastedText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileSelected(file);
    }
  };

  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) return file;
    // Compress any image over 1.5MB to ensure it never exceeds Vercel's 4.5MB payload limit
    if (file.size < 1.5 * 1024 * 1024) return file;

    return new Promise<File>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 2000;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => resolve(file);
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleFileSelected(file);
    }
  };

  const handleFileSelected = async (rawFile: File) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"];
    if (rawFile.type && !allowed.includes(rawFile.type)) {
      setErrorMessage(`Unsupported format (${rawFile.type}). Please upload PDF, PNG, JPEG, or TXT.`);
      return;
    }

    let file = rawFile;
    if (rawFile.type.startsWith("image/")) {
      try {
        file = await compressImageIfNeeded(rawFile);
      } catch {
        file = rawFile;
      }
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("File exceeds 25MB maximum allowable size. Please select a document under 25MB.");
      return;
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);
    setSelectedFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
  };

  const handleExtractFile = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a medical report file first.");
      return;
    }
    setErrorMessage(null);
    await onExtract({ file: selectedFile, fileName: selectedFile.name });
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!pastedText.trim()) {
      setErrorMessage("Please enter or paste laboratory report text.");
      return;
    }
    await onExtract({ text: pastedText.trim(), fileName: "Pasted_Clinical_Document.txt" });
  };

  const handleSelectPreset = async (preset: SampleReportPreset) => {
    setErrorMessage(null);
    setSelectedFileName(preset.sourceDocumentName);
    await onExtract({
      text: preset.rawReportText,
      fileName: preset.sourceDocumentName,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header with Ingestion Mode Tabs */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <UploadCloud className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">2. Medical Report Ingestion & Processing</h2>
            <p className="text-xs text-slate-500">Upload lab documents (PDF, PNG, JPG, TXT) or load synthetic clinical samples</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "upload" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "paste"}
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "paste" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Paste Text
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "presets"}
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === "presets" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
            Sample Reports
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: FILE DRAG & DROP UPLOAD */}
        {activeTab === "upload" && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? "border-sky-500 bg-sky-50/50 scale-[0.99]"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="report-file-input"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
                ) : (
                  <UploadCloud className="w-8 h-8" aria-hidden="true" />
                )}
              </div>

              <div>
                <label
                  htmlFor="report-file-input"
                  className="cursor-pointer text-sm font-bold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Click to browse lab report
                </label>
                <span className="text-sm text-slate-500"> or drag and drop here</span>
                <p className="text-xs text-slate-400 mt-1">
                  Supports clinical PDF, scanned images (PNG, JPEG), and TXT requisitions (Max 25MB)
                </p>
              </div>

              {selectedFileName && (
                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
                    <FileText className="w-4 h-4 text-sky-600" aria-hidden="true" />
                    <span>{selectedFileName}</span>
                    {selectedFileSize && (
                      <span className="text-[10px] text-slate-400 font-normal">({selectedFileSize})</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleExtractFile}
                    disabled={isLoading}
                    className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Extracting Structured Record...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
                        <span>Extract & Get Medical Record</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Banner with Instant "View Extracted Records ↓" Button */}
        {hasResults && !isLoading && (
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Medical Report Extracted Successfully
                </h4>
                <p className="text-[11px] text-emerald-700">
                  {resultCount > 0
                    ? `${resultCount} laboratory test metrics organized with source reference ranges`
                    : "Clinical record parsed and ready for review"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("section-results");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer hover:shadow"
            >
              <span>View Extracted Records ↓</span>
            </button>
          </div>
        )}

        {/* TAB 2: PASTE RAW TEXT */}
        {activeTab === "paste" && (
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <label htmlFor="pasted-report-text" className="block text-xs font-semibold text-slate-700">
              Paste Clinical Report or Laboratory Notes:
            </label>
            <textarea
              id="pasted-report-text"
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`Example:\nHemoglobin: 9.4 g/dL (Ref: 12.0 - 15.5)\nGlucose: 142 mg/dL (Ref: 70 - 99)\nThyroid TSH: 5.8 uIU/mL`}
              className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Extract Structured Data
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: 1-CLICK SAMPLE REPORT PRESETS */}
        {activeTab === "presets" && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 mb-2">
              Select one of the pre-configured clinical benchmark datasets to test reference-range awareness:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SAMPLE_REPORTS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-xl border text-left transition-all hover:shadow-md flex flex-col justify-between cursor-pointer ${
                    preset.category === "Critical Care"
                      ? "border-red-300 bg-red-50/50 hover:border-red-400 hover:bg-red-50/80"
                      : !preset.hasReferenceRanges
                      ? "border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-50/80"
                      : "border-slate-200 bg-slate-50/70 hover:border-sky-400 hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {preset.category}
                      </span>
                      {preset.category === "Critical Care" ? (
                        <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                          Panic Alerts
                        </span>
                      ) : preset.hasReferenceRanges ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Has Source Ranges
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full ring-1 ring-amber-400">
                          NO Ranges
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 leading-snug">{preset.title}</h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
                    <span>{isLoading ? "Processing..." : "Load & Analyze"}</span>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isLoading && (
          <div
            aria-live="polite"
            className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center gap-3 text-sky-800 text-xs font-semibold animate-pulse"
          >
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" aria-hidden="true" />
            <span>
              Analyzing medical report with Gemini 2.0 Flash & evaluating deterministic reference intervals...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

