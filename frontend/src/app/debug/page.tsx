"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

export default function DebugPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtract = async () => {
    if (!file) return;
    
    setLoading(true);
    setError("");
    setExtractedText("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password || undefined,
      });

      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `\n\n=== PAGE ${i} ===\n${pageText}`;
      }

      setExtractedText(fullText);
    } catch (err: any) {
      setError(err.message || "Failed to extract text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">PDF Debug Tool</h1>
      
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-2">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Password (if encrypted)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter PDF password"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <button
          onClick={handleExtract}
          disabled={!file || loading}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded">
            Error: {error}
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
            <pre className="p-4 bg-gray-800 rounded overflow-auto max-h-[600px] text-xs whitespace-pre-wrap">
              {extractedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
