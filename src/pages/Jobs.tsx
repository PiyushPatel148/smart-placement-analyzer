import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs, Job } from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [expLevel, setExpLevel] = useState("entry level fresher");
  
  // State for the search bar input
  const [searchInput, setSearchInput] = useState(""); 
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  // Initial load: Fetch student profile first, THEN fetch jobs
  useEffect(() => {
    const initData = async () => {
      let currentExp = "entry level fresher";
      let roleQuery = "Software Engineer";

      try {
        // 1. Fetch user data from MongoDB
        if (studentId) {
          const response = await fetch(`http://localhost:5000/api/students/${studentId}`);
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

        // 2. Fetch jobs from RapidAPI using the student's specific experience level
        const jobResults = await getJobs(roleQuery, currentExp);
        setJobs(jobResults);

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, [studentId]);

  // Handle manual searches when the user submits the search bar
  const handleApiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = searchInput.trim() || "Software Engineer";
      // Fetch new jobs based on what the user typed, keeping their experience level intact
      const jobResults = await getJobs(query, expLevel);
      setJobs(jobResults);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate match percentages for the UI
  const displayedJobs = jobs.map((job) => {
    const matched = job.skillsRequired.filter((s) => mySkills.includes(s));
    const missing = job.skillsRequired.filter((s) => !mySkills.includes(s));
    const matchPercent = job.skillsRequired.length > 0 
      ? Math.round((matched.length / job.skillsRequired.length) * 100) 
      : 0;

    return { ...job, matchPercent, matched, missing };
  }).sort((a, b) => b.matchPercent - a.matchPercent); 

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="text-muted-foreground font-medium text-lg">Scanning global networks for matches...</p>
        <p className="text-xs text-muted-foreground mt-2">Applying '{expLevel}' filters</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-extrabold text-foreground tracking-tight">Available Positions</h1>
        <p className="text-lg text-muted-foreground">
          Explore roles ranked by how well they match your resume profile.
        </p>
      </div>

      {/* Upgraded Search Bar: Now triggers a real API call on submit */}
      <div className="mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleApiSearch} className="relative group flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <span className="text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search by role, company, or tech stack..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-2xl border bg-card py-4 pl-12 pr-6 text-sm shadow-sm transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            className="rounded-2xl bg-primary px-8 font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity active:scale-95"
          >
            Search
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-3 font-medium uppercase tracking-wider">
          Currently filtering for: <span className="text-primary">{expLevel}</span> roles
        </p>
      </div>

      {mySkills.length === 0 && (
        <div className="mb-10 rounded-2xl border-2 border-dashed border-yellow-200 bg-yellow-50/50 p-8 text-center">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Enhance your search!</h3>
          <p className="text-yellow-700 mb-5">Upload your resume to see your personalized Match Score for each job.</p>
          <Link to="/resume" className="rounded-lg bg-yellow-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-yellow-700 shadow-md">
            Upload Now
          </Link>
        </div>
      )}

      <div className="grid gap-6">
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  {job.logo && (
                    <img src={job.logo} alt={`${job.company} logo`} className="h-8 w-8 rounded-md object-contain bg-white" />
                  )}
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    job.type.toLowerCase().includes("intern") ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {job.type}
                  </span>
                </div>
                <p className="mb-5 text-base font-medium text-muted-foreground flex items-center gap-2">
                  <span>🏢</span> {job.company}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.matched.map((skill) => (
                    <span key={skill} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 border border-green-200 shadow-sm">
                      ✓ {skill}
                    </span>
                  ))}
                  {job.missing.map((skill) => (
                    <span key={skill} className="rounded-lg bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-transparent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-4 border-t pt-5 md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Compatibility</span>
                  <span className={`text-4xl font-black ${
                    job.matchPercent >= 75 ? "text-green-600" : job.matchPercent >= 40 ? "text-yellow-600" : "text-destructive"
                  }`}>
                    {job.matchPercent}%
                  </span>
                </div>
                <a 
                  href={job.applyLink || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-center rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all md:w-auto"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center rounded-3xl border-2 border-dashed bg-muted/20">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-foreground">No matches found</h3>
            <p className="text-muted-foreground">Try modifying your search or experience level.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;