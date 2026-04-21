import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs, Job, API_BASE_URL } from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [expLevel, setExpLevel] = useState("entry level fresher");
  
  const [fresherJobType, setFresherJobType] = useState<"FULLTIME" | "INTERN">("FULLTIME");
  
  const [searchInput, setSearchInput] = useState(""); 
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  const getEffectiveJobType = (level: string, toggleState: "FULLTIME" | "INTERN"): "FULLTIME" | "INTERN" => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("pre-final") || levelLower.includes("intern")) return "INTERN";
    if (levelLower.includes("fresher")) return toggleState;
    return "FULLTIME"; 
  };

  const isFresher = expLevel.toLowerCase().includes("fresher");
  const activeJobType = getEffectiveJobType(expLevel, fresherJobType);

  useEffect(() => {
    const initData = async () => {
      let currentExp = "entry level fresher";
      let roleQuery = "Software Engineer";

      try {
        if (studentId) {
          // FIXED: Changed localhost:5000 to ${API_BASE_URL}
          const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`);
          const data = await response.json();
          
          if (response.ok && data.student) {
            setMySkills(data.student.skills || []);
            
            if (data.student.experienceLevel) {
              currentExp = data.student.experienceLevel;
              setExpLevel(currentExp);
            }
            if (data.student.preferredRole) {
              roleQuery = data.student.preferredRole;
            }
          }
        }

        const initialType = getEffectiveJobType(currentExp, "FULLTIME");
        const jobResults = await getJobs(roleQuery, initialType);
        setJobs(jobResults);

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, [studentId]);

  const handleJobFetch = async (query: string, type: "FULLTIME" | "INTERN") => {
    setLoading(true);
    try {
      const jobResults = await getJobs(query, type);
      setJobs(jobResults);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleJobFetch(searchInput || "Software Engineer", activeJobType);
  };

  const displayedJobs = jobs.map((job) => {
    const matched = job.skillsRequired.filter((s) => mySkills.includes(s));
    const missing = job.skillsRequired.filter((s) => !mySkills.includes(s));
    const matchPercent = job.skillsRequired.length > 0 
      ? Math.round((matched.length / job.skillsRequired.length) * 100) 
      : 0;

    return { ...job, matchPercent, matched, missing };
  }).sort((a, b) => b.matchPercent - a.matchPercent); 

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
      
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Available Positions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore roles ranked by how well they match your extracted resume profile.
        </p>
      </div>

      <div className="mb-14 max-w-3xl mx-auto">
        <form onSubmit={handleApiSearch} className="relative flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by role, company, or tech stack..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-4 px-8 text-base shadow-sm transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button 
            type="submit"
            className="rounded-full bg-primary px-10 py-4 font-bold text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 sm:w-auto w-full"
          >
            Search
          </button>
        </form>

        {isFresher && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex rounded-full bg-muted/50 p-1.5 border border-border shadow-inner">
              <button
                type="button"
                onClick={() => setFresherJobType("FULLTIME")}
                className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all ${
                  fresherJobType === "FULLTIME" 
                    ? "bg-background text-foreground shadow border border-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Full-Time (FTE)
              </button>
              <button
                type="button"
                onClick={() => setFresherJobType("INTERN")}
                className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all ${
                  fresherJobType === "INTERN" 
                    ? "bg-purple-600 text-white shadow border border-purple-700" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Internships
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
            Targeting Profile Level: <span className="text-primary ml-1 capitalize">{expLevel}</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-foreground font-bold text-xl mb-2">Scanning global networks...</p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Fetching {activeJobType === "INTERN" ? "Internships" : "Full-Time Roles"}
          </p>
        </div>
      ) : (
        <>
          {mySkills.length === 0 && (
            <div className="mb-12 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 text-center flex flex-col items-center">
              <div className="mb-3 text-3xl">⚠️</div>
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">Enhance your search!</h3>
              <p className="text-amber-700/80 dark:text-amber-400/80 mb-6 max-w-md font-medium">Upload your resume to unlock personalized Match Scores and see exactly which skills you are missing for each job.</p>
              <Link to="/resume" className="rounded-full bg-amber-600 px-8 py-3 text-sm font-bold text-white hover:bg-amber-700 shadow-md transition-all hover:-translate-y-0.5">
                Upload Resume Now
              </Link>
            </div>
          )}

          <div className="grid gap-6">
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <div
                  key={job.id}
                  className="group flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {job.logo && (
                        <img src={job.logo} alt={`${job.company} logo`} className="h-10 w-10 rounded-lg object-contain bg-white p-1 border border-border shadow-sm" />
                      )}
                      <Link to={`/jobs/${job.id}`}>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                          {job.title}
                        </h3>
                      </Link>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${activeJobType === "INTERN" ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                        {activeJobType === "INTERN" ? "Intern" : "Full-Time"}
                      </span>
                    </div>
                    <p className="mb-6 text-base font-medium text-muted-foreground">
                      <span className="text-foreground">Company:</span> {job.company}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.matched.map((skill) => (
                        <span key={skill} className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ✓ {skill}
                        </span>
                      ))}
                      {job.missing.map((skill) => (
                        <span key={skill} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-4 border-t border-border pt-6 md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Match Score</span>
                      <span className={`text-5xl font-black tracking-tighter ${
                        job.matchPercent >= 75 ? "text-emerald-500" : job.matchPercent >= 40 ? "text-amber-500" : "text-destructive"
                      }`}>
                        {job.matchPercent}%
                      </span>
                    </div>
                    <a 
                      href={job.applyLink || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full text-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all md:w-auto"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center rounded-3xl border-2 border-dashed border-border bg-muted/20">
                <h3 className="text-2xl font-bold text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground font-medium mb-4">Your API Key might be invalid or out of requests, or the search was too specific.</p>
                <Link to="/profile" className="text-primary font-bold hover:underline">Check API Settings &rarr;</Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;