import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AI Workflow Builder — Nextflow",
  description: "Design, connect, and execute AI-powered workflows with a visual drag-and-drop canvas. Powered by Google Gemini.",
  keywords: ["AI", "workflow", "automation", "Gemini", "no-code"],
  openGraph: {
    title: "AI Workflow Builder — Nextflow",
    description: "Design and run AI workflows with a polished visual canvas.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(148,163,184,0.2)",
              color: "#0f172a",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />
      </body>
    </html>
  );
}
