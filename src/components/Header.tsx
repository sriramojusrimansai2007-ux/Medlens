import React from "react";
import { Activity, Shield, Cpu, Printer, Sparkles } from "lucide-react";

interface HeaderProps {
  activePatientName?: string;
  onPrint?: () => void;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePatientName, onPrint, onReset }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Product Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Activity className="w-6 h-6 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">MedLens</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-sky-300">
                Clinical Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">Structured Patient Records & Multimodal Lab Intelligence</p>
          </div>
        </div>

        {/* Feature & Architecture Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
            <Cpu className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            Deterministic Range Engine
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            5-Tier Provenance
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
            Responsible AI
          </span>
        </div>

        {/* Active Patient & Export Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activePatientName && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Current Record</span>
              <span className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">{activePatientName}</span>
            </div>
          )}

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              aria-label="Export Clinical Brief to Print or PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span className="hidden sm:inline">Export Brief</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Clear or Reset Dashboard"
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

