/**
 * Jobs.tsx — Job & Internship Listing Page
 * 
 * Displays a list of available jobs and internships.
 * Each card shows job title, company, type, and required skills.
 * Data fetched from mock API.
 */

import { useState, useEffect } from "react";
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
  // State to hold job listings
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs when component loads
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getJobs();
        setJobs(result);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Jobs & Internships</h1>
      <p className="mb-6 text-muted-foreground">
        Browse available positions that match your skills.
      </p>

      {/* Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Job Title & Type Badge */}
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  job.type === "Internship"
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {job.type}
              </span>
            </div>

            {/* Company Name */}
            <p className="mb-3 text-sm text-muted-foreground">🏢 {job.company}</p>

            {/* Required Skills */}
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
