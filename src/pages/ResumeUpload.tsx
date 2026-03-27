import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Added the navigation hook

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  const navigate = useNavigate(); // 2. Initialized navigation

  // Grab the file and reset messages
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setMessage(""); 
      setPreview("");
    } else {
      setFile(null);
      setMessage("⚠️ Please select a valid PDF file.");
      setPreview("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setPreview("");

    // Pack the file for the backend Mailroom (Multer)
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload-resume", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setPreview(data.preview); // Show the text Multer/pdf-parse found
        
        // --- THE NEW SMART LOGIC ---
        // 3. Save the actual skills array to localStorage!
        if (data.skills) {
          localStorage.setItem("userSkills", JSON.stringify(data.skills));
        }
        
        // 4. Send them to the dashboard after 1.5 seconds to see the results
        setTimeout(() => navigate("/dashboard"), 1500);
        } 
        else {
          setMessage(`❌ ${data.message || "Upload failed."}`);
        }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Upload Resume</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Upload your PDF resume so we can analyze your skills.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {/* Modern File Input Area */}
        <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-10 text-center transition-colors hover:bg-primary/10">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-6 file:py-2.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
          />
          <p className="text-sm font-medium text-muted-foreground">
            {file ? <span className="text-primary">{file.name}</span> : "Only .pdf files up to 5MB"}
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full rounded-xl bg-primary px-4 py-3.5 font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing Document..." : "Upload & Analyze"}
        </button>

        {/* Status Messages */}
        {message && (
          <div className={`mt-6 rounded-xl p-4 text-sm font-semibold border ${message.includes("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        {/* Snippet Preview Box */}
        {preview && (
          <div className="mt-6 rounded-xl border bg-muted/30 p-5 shadow-inner">
            <h3 className="mb-3 text-sm font-bold text-foreground flex items-center gap-2">
              <span>🔍</span> Extracted Text Preview
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "{preview}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;