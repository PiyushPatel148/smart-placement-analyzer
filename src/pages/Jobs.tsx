import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/api";

// Type for a single job listing
interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  skillsRequired: string[];
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsAndSkills = async () => {
      try {
        // 1. Fetch real jobs from your existing API service
        const result = await getJobs();
        setJobs(result);

        // 2. Grab the skills extracted from the Resume Upload
        const storedSkills = localStorage.getItem("userSkills");
        if (storedSkills) {
          setMySkills(JSON.parse(storedSkills));
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsAndSkills();
  }, []);

  // --- THE SMART FILTER & RANKING ENGINE ---
  const displayedJobs = jobs
    .map((job) => {
      // Step A: Calculate Match Percent & Identify Missing Skills
      const matched = job.skillsRequired.filter((s) => mySkills.includes(s));
      const missing = job.skillsRequired.filter((s) => !mySkills.includes(s));
      const matchPercent = job.skillsRequired.length > 0 
        ? Math.round((matched.length / job.skillsRequired.length) * 100) 
        : 0;

      return { ...job, matchPercent, matched, missing };
    })
    .filter((job) => {
      // Step B: Real-time Filter by Title or Company
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => b.matchPercent - a.matchPercent); // Step C: Sort by highest match score

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground font-medium">Matching your skills with opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-extrabold text-foreground tracking-tight">Available Positions</h1>
        <p className="text-lg text-muted-foreground">
          Explore roles ranked by how well they match your resume profile.
        </p>
      </div>

      {/* 🔍 Search Bar Component */}
      <div className="mb-12 relative max-w-2xl mx-auto group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <span className="text-xl">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search by role, company, or sector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border bg-card py-5 pl-12 pr-6 text-sm shadow-sm transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none"
        />
      </div>

      {/* No Resume Uploaded Warning */}
      {mySkills.length === 0 && (
        <div className="mb-10 rounded-2xl border-2 border-dashed border-yellow-200 bg-yellow-50/50 p-8 text-center">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Enhance your search!</h3>
          <p className="text-yellow-700 mb-5">Upload your resume to see your personalized Match Score for each job.</p>
          <Link to="/resume" className="rounded-lg bg-yellow-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-yellow-700 shadow-md">
            Upload Now
          </Link>
        </div>
      )}

      {/* Job Listings Grid */}
      <div className="grid gap-6">
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 md:flex-row md:items-center"
            >
              {/* Left Side: Job Details */}
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    job.type === "Internship" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {job.type}
                  </span>
                </div>
                <p className="mb-5 text-base font-medium text-muted-foreground flex items-center gap-2">
                  <span>🏢</span> {job.company}
                </p>

                {/* Dynamic Skill Badges */}
                <div className="flex flex-wrap gap-2">
                  {/* Verified Skills (Matched) */}
                  {job.matched.map((skill) => (
                    <span key={skill} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 border border-green-200 shadow-sm">
                      ✓ {skill}
                    </span>
                  ))}
                  {/* Missing Skills (Requirements) */}
                  {job.missing.map((skill) => (
                    <span key={skill} className="rounded-lg bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-transparent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Match Percentage & Action */}
              <div className="flex shrink-0 flex-col items-start gap-4 border-t pt-5 md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Compatibility</span>
                  <span className={`text-4xl font-black ${
                    job.matchPercent >= 75 ? "text-green-600" : job.matchPercent >= 40 ? "text-yellow-600" : "text-destructive"
                  }`}>
                    {job.matchPercent}%
                  </span>
                </div>
                <button className="w-full rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all md:w-auto">
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center rounded-3xl border-2 border-dashed bg-muted/20">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-foreground">No matches found</h3>
            <p className="text-muted-foreground">Try searching for a different role or skill.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;