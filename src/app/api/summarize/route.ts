import { NextRequest, NextResponse } from "next/server";
import { generateSafePatientSummaryAI } from "@/lib/gemini";
import { PatientIntake, LabResult } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const patient = body.patient as PatientIntake;
    const labResults = body.labResults as LabResult[];

    if (!patient) {
      return NextResponse.json(
        { error: "Missing patient intake information." },
        { status: 400 }
      );
    }

    if (!labResults || !Array.isArray(labResults) || labResults.length === 0) {
      return NextResponse.json(
        { error: "At least one laboratory result is required to generate a clinical summary." },
        { status: 400 }
      );
    }

    const summary = await generateSafePatientSummaryAI(patient, labResults);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("[API/summarize] Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate patient summary: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

