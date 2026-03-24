/**
 * ResumeUpload.tsx — Resume Upload Page
 * 
 * Allows users to upload a PDF resume.
 * Uses mock API to simulate upload.
 */

import { useState } from "react";
import { uploadResume } from "../services/api";

const ResumeUpload = () => {
  // Selected file and UI states
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setMessage("");
    } else {
      setFile(null);
      setMessage("⚠️ Please select a PDF file.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await uploadResume(file);
      if (response.success) {
        setMessage("✅ " + response.message);
        setFile(null);
      }
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Upload Resume</h1>
      <p className="mb-6 text-muted-foreground">
        Upload your resume in PDF format to analyze your skills.
      </p>

      {/* Message */}
      {message && (
        <div className="mb-4 rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
          {message}
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
        {/* File Input Area */}
        <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-10">
          <p className="mb-2 text-4xl">📄</p>
          <p className="mb-4 text-sm text-muted-foreground">
            {file ? file.name : "Select a PDF file to upload"}
          </p>
          <label className="cursor-pointer rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-80 transition-opacity">
            Choose File
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
