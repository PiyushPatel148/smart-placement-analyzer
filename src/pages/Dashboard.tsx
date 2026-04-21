import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobById, Job, API_BASE_URL } from "../services/api";

// Define role-based skill targets for dynamic analysis
const roleSkillMaps: Record<string, { title: string, skills: string[] }[]> = {
  "Frontend Developer": [
    { title: "Core Languages", skills: ["JavaScript", "TypeScript", "HTML", "CSS"] },
    { title: "Frameworks", skills: ["React", "Vue", "Angular", "Next.js"] },
    { title: "Tools", skills: ["Git", "Webpack", "Figma", "Tailwind"] }
  ],
  "Backend Developer": [
    { title: "Languages", skills: ["Node.js", "Python", "Java", "C++", "C#"] },
    { title: "Databases", skills: ["MongoDB", "SQL", "PostgreSQL", "Redis"] },
    { title: "Infrastructure", skills: ["Express", "Docker", "AWS", "Git"] }
  ],
  "Data Analyst": [
    { title: "Processing", skills: ["Python", "SQL", "R", "Excel"] },
    { title: "Visualization", skills: ["Tableau", "PowerBI", "Matplotlib"] },
    { title: "Math & Stats", skills: ["Machine Learning", "Data Analysis", "Statistics"] }
  ],
  "Software Engineer": [
    { title: "Frontend", skills: ["React", "JavaScript", "HTML", "CSS"] },
    { title: "Backend", skills: ["Node.js", "Python", "Java", "C++", "SQL"] },
    { title: "DevOps & Tools", skills: ["Git", "Docker", "AWS", "Linux"] }
  ]
};

const defaultCategories = [
  { title: "Frontend", skills: ["React", "JavaScript", "HTML", "CSS"] },
  { title: "Backend", skills: ["Node.js", "Python", "Java", "SQL"] },
  { title: "Tools", skills: ["Git", "Docker", "AWS"] }
];

const Dashboard = () => {
  const [userName, setUserName] = useState("Student");
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [preferredRole, setPreferredRole] = useState("");
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  // Fetch user data and saved job details
  useEffect(() => {
    const fetchUserData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        // REPLACED LOCALHOST
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`);
        const data = await response.json();
        
        if (response.ok && data.student) {
          setUserName(data.student.name);
          setMySkills(data.student.skills || []);
          if (data.student.preferredRole) {
            setPreferredRole(data.student.preferredRole);
          }

          const savedJobIds = data.student.savedJobs || [];
          if (savedJobIds.length > 0) {
            const fetchedJobs = await Promise.all(
              savedJobIds.map((jobId: string) => getJobById(jobId))
            );
            setSavedJobs(fetchedJobs.filter((job): job is Job => job !== null));
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [studentId]);

  // Function to remove a job from the saved list
  const handleRemoveJob = async (e: React.MouseEvent, jobId: string | number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!studentId) return;

    try {
      // REPLACED LOCALHOST
      const res = await fetch(`${API_BASE_URL}/api/students/${studentId}/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: String(jobId) })
      });

      if (res.ok) {
        setSavedJobs(prev => prev.filter(job => String(job.id) !== String(jobId)));
      }
    } catch (err) {
      console.error("Error removing job:", err);
    }
  };

  const skillCategories = roleSkillMaps[preferredRole] || roleSkillMaps["Software Engineer"] || defaultCategories;
  const targetSkills = skillCategories.flatMap(cat => cat.skills);
  const matchedSkills = mySkills.filter(skill => targetSkills.includes(skill));
  const missingSkills = targetSkills.filter(skill => !mySkills.includes(skill));
  const score = targetSkills.length > 0 ? Math.round((matchedSkills.length / targetSkills.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">
            {preferredRole 
              ? `Live Readiness Analysis for: ${preferredRole}` 
              : "Set a Preferred Role in your profile for better analysis."}
          </p>
        </div>
        <Link to="/profile" className="whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl border bg-card p-8 shadow-sm text-center h-full">
          <h2 className="mb-6 text-xl font-bold text-foreground">Readiness Score</h2>
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-muted bg-background shadow-inner">
            <div 
              className="absolute inset-0 rounded-full border-[14px] border-primary transition-all duration-1000"
              style={{ clipPath: `inset(${100 - score}% 0 0 0)` }}
            ></div>
            <span className="text-5xl font-extrabold text-foreground">{score}%</span>
          </div>
          <p className="mt-8 text-sm font-medium text-muted-foreground">
            {matchedSkills.length} of {targetSkills.length} Core Skills Found
          </p>
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
              Skill Distribution
            </h2>
            <div className="space-y-6">
              {skillCategories.map((category, index) => {
                const catMatches = category.skills.filter(s => mySkills.includes(s)).length;
                const catTotal = category.skills.length;
                const catPercentage = Math.round((catMatches / catTotal) * 100) || 0;
                return (
                  <div key={index}>
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                      <span className="text-foreground">{category.title}</span>
                      <span className="text-muted-foreground">{catPercentage}%</span>
                    </div>
                    <div className="h-4