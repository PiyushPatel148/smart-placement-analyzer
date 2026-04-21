import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

const Profile = () => {
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry level fresher");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [apiKey, setApiKey] = useState("");

  const studentId = localStorage.getItem("studentId");

  const jobRoles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Analyst", "Mobile App Developer", "DevOps Engineer",
    "UI/UX Designer", "Software Engineer"
  ];

  useEffect(() => {
    const savedKey = localStorage.getItem("rapidApiKey");
    if (savedKey) setApiKey(savedKey);

    const fetchProfile = async () => {
      if (!studentId) {
        setFetching(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`);
        const data = await response.json();
        
        if (response.ok && data.student) {
          setName(data.student.name);
          setGradYear(data.student.graduationYear?.toString() || "");
          setSkills(data.student.skills || []);
          setEducation(data.student.education || "");
          setPreferredRole(data.student.preferredRole || "");
          setExperienceLevel(data.student.experienceLevel || "entry level fresher");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault(); 
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
      setMessage(""); 
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    setMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          skills, 
          graduationYear: Number(gradYear),
          education,
          preferredRole,
          experienceLevel 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        localStorage.setItem("userSkills", JSON.stringify(skills));
        localStorage.setItem("userName", name);
        // Auto-hide the message after 4 seconds
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage(`❌ ${data.message || "Failed to save changes."}`);
      }
    } catch (err) {
      setMessage("❌ Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setApiMessage("❌ Please enter a valid key.");
      setTimeout(() => setApiMessage(""), 3000);
      return;
    }
    localStorage.setItem("rapidApiKey", apiKey.trim());
    setApiMessage("✅ API Key saved securely to your browser.");
    setTimeout(() => setApiMessage(""), 3000);
  };

  const handleClearKey = () => {
    localStorage.removeItem("rapidApiKey");
    setApiKey("");
    setApiMessage("⚠️ API Key removed. Reverting to default quota.");
    setTimeout(() => setApiMessage(""), 3000);
  };

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* STICKY NOTIFICATION COMPONENT */}
      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`rounded-xl p-4 text-center text-sm font-bold shadow-2xl border ${
            message.includes("✅") 
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-emerald-900 dark:text-emerald-100" 
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-100"
          }`}>
            {message}
          </div>
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Manage your personal details and fine-tune your verified skills.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Education / University</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Tech in CS" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Graduation Year</label>
              <input type="number" value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Preferred Job Role</label>
              <select value={preferredRole} onChange={(e) => setPreferredRole(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select a role...</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Experience Level</label>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="pre-final year intern">Pre-Final Year Student (Seeking Internships)</option>
                <option value="entry level fresher">Fresher / 0 Years</option>
                <option value="1-3 years junior">1 to 3 Years (Junior)</option>
                <option value="3-5 years mid level">3 to 5 Years (Mid-Level)</option>
                <option value="5+ years senior lead">5+ Years (Senior/Lead)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-6">
            <label className="mb-1 block text-sm font-semibold">Verified Technical Skills</label>
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary border border-primary/20">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="h-5 w-5 rounded-full hover:bg-primary hover:text-white transition-colors">×</button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3.5 font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;