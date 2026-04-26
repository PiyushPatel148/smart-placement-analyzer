import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

const Profile = () => {
  // EXPLICIT TYPES ADDED FOR VERCEL
  const [name, setName] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [gradYear, setGradYear] = useState<string>("");
  const [preferredRole, setPreferredRole] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("entry level fresher");
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [apiMessage, setApiMessage] = useState<string>("");

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const savedKey = localStorage.getItem("rapidApiKey");
    if (savedKey) setApiKey(savedKey);

    const fetchProfile = async () => {
      if (!studentId || !token) {
        setFetching(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const data: any = await response.json(); // Cast to any for Vercel
        if (response.ok && data.student) {
          setName(data.student.name || "");
          setEducation(data.student.education || "");
          setGradYear(String(data.student.graduationYear || ""));
          setPreferredRole(data.student.preferredRole || "");
          setExperienceLevel(data.student.experienceLevel || "entry level fresher");
          setSkills(data.student.skills || []);
        }
      } catch (error: any) {
        console.error("Failed to load profile", error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [studentId, token]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault(); 
    // Safely cast to String to prevent Vercel "unknown" errors
    const trimmedSkill = String(newSkill).trim();
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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name, 
          education, 
          graduationYear: Number(gradYear),
          preferredRole, 
          experienceLevel, 
          skills 
        }),
      });

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ Failed to update profile.");
      }
    } catch (error: any) {
      setMessage("❌ Server error while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    // Safely cast to String for Vercel
    if (!String(apiKey).trim()) {
      setApiMessage("❌ Please enter a valid key.");
      setTimeout(() => setApiMessage(""), 3000);
      return;
    }
    localStorage.setItem("rapidApiKey", String(apiKey).trim());
    setApiMessage("✅ API Key saved securely to your browser.");
    setTimeout(() => setApiMessage(""), 3000);
  };

  const handleClearKey = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm border border-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Account Profile</h1>
        <p className="text-muted-foreground font-medium">Manage your personal details, career preferences, and technical skills.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/5 rounded-full blur-3xl"></div>
        
        {message && (
          <div className={`mb-8 rounded-2xl p-4 text-center text-sm font-bold border animate-in fade-in slide-in-from-top-4 duration-300 ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-10">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="h-6 w-1.5 rounded-full bg-primary"></span>
              Personal & Academic Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input type="text" value={name} onChange={(e: any) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">University / Education</label>
                <input type="text" value={education} onChange={(e: any) => setEducation(e.target.value)} placeholder="e.g. NITK Surathkal" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">Graduation Year</label>
                <input type="number" value={gradYear} onChange={(e: any) => setGradYear(e.target.value)} placeholder="e.g. 2026" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Role</label>
                <select value={preferredRole} onChange={(e: any) => setPreferredRole(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">Select a role...</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">Experience Level</label>
                <select value={experienceLevel} onChange={(e: any) => setExperienceLevel(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer">
                  <option value="pre-final year intern">Pre-Final Year Student (Seeking Internships)</option>
                  <option value="entry level fresher">Fresher / 0 Years</option>
                  <option value="1-3 years junior">1 to 3 Years (Junior)</option>
                  <option value="3-5 years mid level">3 to 5 Years (Mid-Level)</option>
                  <option value="5+ years senior">5+ Years (Senior)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="h-6 w-1.5 rounded-full bg-primary"></span>
              Verified Technical Skills
            </h2>
            <p className="mb-6 text-sm text-muted-foreground font-medium">Add any specialized skills the AI analyzer might have missed.</p>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-sm font-bold text-primary border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-primary/60 hover:text-destructive transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-sm text-muted-foreground italic">No skills added yet.</span>}
            </div>
            <div className="flex gap-3">
              <input type="text" value={newSkill} onChange={(e: any) => setNewSkill(e.target.value)} placeholder="e.g., GraphQL, Docker..." className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary outline-none transition-all" />
              <button type="button" onClick={handleAddSkill} className="rounded-xl bg-muted px-8 py-3 text-sm font-bold text-foreground hover:bg-muted/80 transition-all active:scale-95 shadow-sm">Add</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-primary py-4 px-6 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
            {loading ? "Saving Changes..." : "Save My Profile"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl shadow-primary/5">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">API Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-8 font-medium leading-relaxed">
          Avoid rate limits during testing. Enter your own JSearch RapidAPI key below. This is stored <span className="font-bold text-foreground border-b-2 border-primary/20">locally in your browser</span> and never sent to our servers.
        </p>
        <div className="flex flex-col gap-4">
          <input type="password" placeholder="Enter RapidAPI Key..." value={apiKey} onChange={(e: any) => setApiKey(e.target.value)} className="w-full rounded-xl border border-border bg-background py-3.5 px-4 text-sm focus:border-primary outline-none transition-all shadow-inner" />
          <div className="flex gap-3">
            <button onClick={handleSaveKey} className="flex-1 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all">Save Key</button>
            <button onClick={handleClearKey} className="rounded-xl border border-border bg-muted py-3 px-6 text-sm font-bold text-muted-foreground hover:bg-destructive hover:text-destructive-foreground active:scale-95 transition-all">Clear</button>
          </div>
        </div>
        {apiMessage && (
          <div className={`mt-6 rounded-xl p-3.5 text-sm font-bold border animate-in fade-in slide-in-from-bottom-2 ${apiMessage.includes("⚠️") ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
            {apiMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;