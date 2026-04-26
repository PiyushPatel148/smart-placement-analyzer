import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
// Import the base URL so it dynamically uses the Render link!
import { API_BASE_URL } from "../services/api"; 

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setMessage(""); 
    } else {
      setFile(null);
      setMessage("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token"); // Grab token
    
    if (!studentId || !token) {
      setMessage("You must be logged in to upload a resume.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("studentId", studentId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // Send token to Bouncer (Do not set Content-Type for FormData)
        },
        body: formData, 
      });

      //  SECURITY CHECK
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMessage("Resume analyzed successfully.");
        
        if (data.skills) {
          localStorage.setItem("userSkills", JSON.stringify(data.skills));
        }
        
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Upload Resume</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Upload your PDF resume so our engine can extract and analyze your technical skills.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm transition-all">
        
        <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-12 text-center transition-all hover:border-primary/50 hover:bg-primary/5">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
            📄
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-6 file:py-2.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
          />
          <p className="text-sm font-medium text-muted-foreground mt-2">
            {file ? <span className="text-primary font-bold">{file.name}</span> : "Only .pdf files up to 5MB are supported"}
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full rounded-full bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? "Analyzing Document..." : "Upload & Analyze"}
        </button>

        {message && (
          <div className={`mt-6 rounded-xl p-4 text-sm font-semibold border ${message.includes("successfully") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;