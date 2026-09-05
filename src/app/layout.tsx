import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedLens — Clinical Information Intelligence",
  description: "AI-powered structured medical record organization, reference-range awareness, and provenance tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full flex flex-col text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium text-xs"
        >
          Skip to main clinical content
        </a>
        {children}
      </body>
    </html>
  );
}
