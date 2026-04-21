import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById, Job, API_BASE_URL } from "../services/api";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  const [job, setJob] = useState<Job | null>(null);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isSaved, setIsSaved] = useState(false);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const savedSkills = localStorage.getItem("userSkills");
        if (savedSkills) setMySkills(JSON.parse(savedSkills));

        const data = await getJobById(id);
        setJob(data);

        if (studentId) {
          // REPLACED LOCALHOST
          const userRes = await fetch(`${API_BASE_URL}/api/students/${studentId}`);
          const userData = await userRes.json();
          if (userData.student?.savedJobs?.includes(id)) {
            setIsSaved(true);
          }
        }

      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, studentId]);

  const handleSaveJob = async () => {
    if (!studentId || !id) return;
    try {
      // REPLACED LOCALHOST
      const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id })
      });
      if (res.ok) {
        setIsSaved(!isSaved);
      }
    } catch (err) {
      console.error("Error saving job", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="text-muted-foreground font-medium">Loading job description...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-destructive mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">This position may have been removed or the link is invalid.</p>
        <Link to="/jobs" className="rounded-lg bg-primary px-6 py-2 text-primary-foreground font-bold hover:opacity-90">Back to Jobs</Link>
      </div>
    );
  }

  const matched = job.skillsRequired.filter((s) => mySkills.includes(s));
  const missing = job.skillsRequired.filter((s) => !mySkills.includes(s));
  const matchPercent = job.skillsRequired.length > 0 
    ? Math.round((matched.length / job.skillsRequired.length) * 100) 
    : 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link to="/jobs" className="text-primary font-bold hover:underline mb-8 inline-block">
        Back to all jobs
      </Link>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b pb-8">
          
          <div className="flex-1 w-full pr-0 md:pr-4">
            <div className="flex items-center gap-4 mb-4">
              {job.logo && <img src={job.logo} alt="logo" className="h-12 w-12 rounded-lg bg-white object-contain" />}
              <h1 className="text-3xl font-extrabold text-foreground leading-tight">{job.title}</h1>
            </div>
            <p className="text-xl font-medium text-muted-foreground">{job.company}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1">Location: {job.location || "Not specified"}</span>
              <span className="flex items-center gap-1">Type: {job.type}</span>
              <span className="flex items-center gap-1">Salary: {job.salary}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 bg-muted/20 p-6 rounded-xl border border-muted w-full md:w-72 shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Match</span>
            <span className={`text-5xl font-black mb-2 ${matchPercent >= 75 ? "text-green-600" : matchPercent >= 40 ? "text-yellow-600" : "text-destructive"}`}>
              {matchPercent}%
            </span>
            
            <button 
              onClick={handleSaveJob}
              className={`w-full text-center rounded-lg px-6 py-2.5 text-sm font-bold shadow-sm transition-all ${
                isSaved ? "bg-secondary text-foreground border border-muted-foreground/30" : "bg-transparent border-primary text-primary border-2 hover:bg-primary/5"
              }`}
            >
              {isSaved ? "★ Saved" : "☆ Save for Later"}
            </button>

            <a href={job.applyLink || "#"} target="_blank" rel="noopener noreferrer" className="w-full text-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90">
              Apply Externally
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Job Description</h2>
            <div 
              className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap"
            >
              {job.description || "No description provided by the employer."}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-green-50/50 p-5">
              <h3 className="font-bold text-green-800 mb-3 text-sm uppercase tracking-wide">Verified Skills ({matched.length})</h3>
              <div className="flex flex-wrap gap-2">
                {matched.length === 0 ? <span className="text-sm text-green-700/70 italic">None yet. Upload your resume.</span> : null}
                {matched.map(skill => (
                  <span key={skill} className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">{skill}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-red-50/50 p-5">
              <h3 className="font-bold text-red-800 mb-3 text-sm uppercase tracking-wide">Missing Skills ({missing.length})</h3>
              <div className="flex flex-wrap gap-2">
                {missing.length === 0 ? <span className="text-sm text-red-700/70 italic">You have all required skills.</span> : null}
                {missing.map(skill => (
                  <span key={skill} className="rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;