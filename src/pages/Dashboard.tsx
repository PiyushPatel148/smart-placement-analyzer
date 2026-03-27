import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("Student");
  const [mySkills, setMySkills] = useState<string[]>([]);
  
  // The core tech stack grouped by category for the Bar Graph
  const skillCategories = [
    { title: "Frontend", skills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"] },
    { title: "Backend", skills: ["Node.js", "Express", "Python", "Java", "C++"] },
    { title: "Data & Tools", skills: ["MongoDB", "SQL", "Git", "Docker", "AWS"] }
  ];

  // Flatten the array to get all target skills for the master score
  const targetSkills = skillCategories.flatMap(cat => cat.skills);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    const storedSkills = localStorage.getItem("userSkills");
    if (storedSkills) {
      setMySkills(JSON.parse(storedSkills));
    }
  }, []);

  // Calculate master score
  const matchedSkills = mySkills.filter(skill => targetSkills.includes(skill));
  const missingSkills = targetSkills.filter(skill => !mySkills.includes(skill));
  const score = targetSkills.length > 0 ? Math.round((matchedSkills.length / targetSkills.length) * 100) : 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      {/* Restored to max-w-6xl for that clean, focused layout */}
      
      {/* Welcome Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Here is your live Smart Placement Analysis.</p>
        </div>
        <Link to="/resume" className="whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          Update Resume
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Pie Chart (Readiness Score) */}
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

        {/* Right Column: The Bar Graphs & Lists */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* THE BAR GRAPH SECTION */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
              <span>📈</span> Skill Distribution
            </h2>
            
            <div className="space-y-6">
              {skillCategories.map((category, index) => {
                const catMatches = category.skills.filter(s => mySkills.includes(s)).length;
                const catTotal = category.skills.length;
                const catPercentage = Math.round((catMatches / catTotal) * 100);

                return (
                  <div key={index}>
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                      <span className="text-foreground">{category.title}</span>
                      <span className="text-muted-foreground">{catPercentage}%</span>
                    </div>
                    {/* The Bar Background */}
                    <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
                      {/* The Filled Bar */}
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                        style={{ width: `${catPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The Detailed Skill Badges */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Verified Skills */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-green-600 flex items-center gap-2">
                  <span>✅</span> Verified on Resume
                </h3>
                {mySkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {mySkills.map((skill, index) => (
                      <span key={index} className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700 border border-green-200 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No skills detected yet.</p>
                )}
              </div>

              {/* Missing Skills */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-destructive flex items-center gap-2">
                  <span>🎯</span> Recommended to Learn
                </h3>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, index) => (
                      <span key={index} className="rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-bold text-destructive border border-destructive/20 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-green-600">You have all the core skills! 🎉</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;