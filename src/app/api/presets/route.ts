import { NextResponse } from "next/server";
import { SYNTHETIC_PATIENTS, SAMPLE_REPORTS } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    patients: SYNTHETIC_PATIENTS,
    reports: SAMPLE_REPORTS,
  });
}
