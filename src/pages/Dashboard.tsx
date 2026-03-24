/**
 * Dashboard.tsx — Skill Analysis Dashboard
 * 
 * Displays the user's skill readiness score, matched and missing skills,
 * and a bar chart comparing them.
 * Data fetched from mock API.
 */

import { useState, useEffect } from "react";
import { getSkillAnalysis } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  // State to hold skill analysis data
  const [data, setData] = useState<{
    readinessScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch skill analysis data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSkillAnalysis();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch skill analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // If no data, show error
  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-destructive">Failed to load data.</p>
      </div>
    );
  }

  // Prepare chart data: matched vs missing skill counts
  const barData = [
    { name: "Matched", count: data.matchedSkills.length, fill: "hsl(142, 60%, 45%)" },
    { name: "Missing", count: data.missingSkills.length, fill: "hsl(0, 72%, 55%)" },
  ];

  // Pie chart data for readiness score
  const pieData = [
    { name: "Ready", value: data.readinessScore },
    { name: "Gap", value: 100 - data.readinessScore },
  ];
  const PIE_COLORS = ["hsl(217, 91%, 50%)", "hsl(210, 20%, 94%)"];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Skill Analysis Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        See how placement-ready you are based on your skills.
      </p>

      {/* Readiness Score + Chart Row */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Readiness Score Card with Pie Chart */}
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Readiness Score</h3>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-3xl font-bold text-primary">{data.readinessScore}%</p>
          <p className="text-sm text-muted-foreground">Placement Ready</p>
        </div>

        {/* Bar Chart: Matched vs Missing */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Skills Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Matched Skills */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-success">
            ✅ Matched Skills ({data.matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-destructive">
            ❌ Missing Skills ({data.missingSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive"
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
