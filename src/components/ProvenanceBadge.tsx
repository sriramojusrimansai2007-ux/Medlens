import React from "react";
import { ProvenanceTier } from "@/lib/types";
import { User, FileText, Sparkles, Calculator, ShieldCheck } from "lucide-react";

interface ProvenanceBadgeProps {
  tier: ProvenanceTier;
  onClick?: () => void;
  interactive?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  tier,
  onClick,
  interactive = true,
}) => {
  const config = getProvenanceConfig(tier);
  const Icon = config.icon;

  const badgeContent = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
        config.className
      } ${interactive ? "cursor-pointer hover:shadow-sm hover:scale-105 active:scale-95" : ""}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`View provenance details for origin: ${config.label}`}
        title={`Origin: ${config.label}. Click to inspect source audit details.`}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full"
      >
        {badgeContent}
      </button>
    );
  }

  return badgeContent;
};

function getProvenanceConfig(tier: ProvenanceTier) {
  switch (tier) {
    case "PATIENT_PROVIDED":
      return {
        label: "Patient Provided",
        icon: User,
        className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      };
    case "REPORT_EXTRACTED":
      return {
        label: "Report Extracted",
        icon: FileText,
        className: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
      };
    case "AI_GENERATED":
      return {
        label: "AI Generated",
        icon: Sparkles,
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      };
    case "DERIVED_FROM_SOURCE":
      return {
        label: "Derived from Source Data",
        icon: Calculator,
        className: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      };
    case "USER_VERIFIED":
      return {
        label: "Verified by User",
        icon: ShieldCheck,
        className: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 ring-1 ring-emerald-400",
      };
    default:
      return {
        label: "Unknown Origin",
        icon: FileText,
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}
