import { NextRequest, NextResponse } from "next/server";
import { extractMedicalReportAI } from "@/lib/gemini";

// Maximum allowable file size: 5MB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
];

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const textParam = formData.get("text") as string | null;

      if (!file && !textParam) {
        return NextResponse.json(
          { error: "No file or text content provided in request." },
          { status: 400 }
        );
      }

      if (file) {
        // File Size Security Check
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds 5MB limit.` },
            { status: 400 }
          );
        }

        // MIME Type Security Check
        if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: `Unsupported file format (${file.type}). Allowed: PDF, PNG, JPEG, WEBP, TXT.` },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (file.type === "text/plain") {
          const textContent = buffer.toString("utf-8");
          const extraction = await extractMedicalReportAI({
            text: textContent,
            fileName: file.name,
          });
          return NextResponse.json(extraction);
        } else {
          const base64 = buffer.toString("base64");
          const extraction = await extractMedicalReportAI({
            fileBase64: base64,
            mimeType: file.type || "application/pdf",
            fileName: file.name,
          });
          return NextResponse.json(extraction);
        }
      }

      if (textParam) {
        const extraction = await extractMedicalReportAI({
          text: textParam,
          fileName: "Pasted_Clinical_Notes.txt",
        });
        return NextResponse.json(extraction);
      }
    }

    // 2. JSON Payload (Pasted Text or Direct Raw String)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.text || typeof body.text !== "string" || body.text.trim() === "") {
        return NextResponse.json(
          { error: "Empty or invalid text content provided." },
          { status: 400 }
        );
      }

      const extraction = await extractMedicalReportAI({
        text: body.text,
        fileName: body.fileName || "Pasted_Lab_Report.txt",
      });
      return NextResponse.json(extraction);
    }

    return NextResponse.json(
      { error: "Unsupported Content-Type. Use multipart/form-data or application/json." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[API/extract] Internal server error:", error);
    return NextResponse.json(
      { error: "Failed to process medical report: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
