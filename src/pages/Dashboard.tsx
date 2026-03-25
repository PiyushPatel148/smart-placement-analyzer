import { useState, useEffect } from "react";
import { getSkillAnalysis } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState<{
    readinessScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Getting the name from our login save point
  const userName = localStorage.getItem("userName") || "Student";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSkillAnalysis();
        setData(result);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  // Modernized Bar Data with cleaner colors
  const barData = [
    { name: "Matched", count: data.matchedSkills.length, fill: "#22c55e" },
    { name: "Missing", count: data.missingSkills.length, fill: "#ef4444" },
  ];

  const pieData = [
    { name: "Ready", value: data.readinessScore },
    { name: "Gap", value: 100 - data.readinessScore },
  ];
  const PIE_COLORS = ["#3b82f6", "#f1f5f9"];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Updated Top Text */}
      <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome, {userName}!</h1>
      <p className="mb-8 text-muted-foreground text-lg">
        Here is your personalized skill analysis and placement readiness report.
      </p>

      {/* Readiness Score + Chart Row */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Readiness Score</h3>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                dataKey="value"
                startAngle={90} endAngle={-270}
                stroke="none"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-3xl font-bold text-primary">{data.readinessScore}%</p>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Placement Ready</p>
        </div>

        {/* Improved Bar Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Skills Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 13 }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Original Skill Lists Design */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-green-600">
            ✅ Matched Skills ({data.matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-600 border border-green-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-red-600">
            ❌ Missing Skills ({data.missingSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;