import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

const Profile = () => {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("entry level fresher");
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  const studentId = localStorage.getItem("studentId");

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
          setName(data.student.name || "");
          setEducation(data.student.education || "");
          setGradYear(data.student.graduationYear || "");
          setPreferredRole(data.student.preferredRole || "");
          setExperienceLevel(data.student.experienceLevel || "entry level fresher");
          setSkills(data.student.skills || []);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
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
          education, 
          graduationYear: Number(gradYear),
          preferredRole, 
          experienceLevel, 
          skills 
        }),
      });

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ Failed to update profile.");
      }
    } catch (error) {
      setMessage("❌ Server error while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setApiMessage("❌ Please enter a valid key.");
      setTimeout(() => setApiMessage(""), 3000);
      return;
    }
    localStorage.setItem("rapidApiKey", apiKey.trim());
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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Account Profile</h1>
      
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        {message && (
          <div className={`mb-6 rounded-xl p-4 text-center text-sm font-bold border ${message.includes("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3" required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Target Role</label>
              <select value={preferredRole} onChange={(e) => setPreferredRole(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3">
                <option value="">Select a role...</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Experience Level</label>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full rounded-xl border bg-background px-4 py-3">
                <option value="pre-final year intern">Pre-Final Year Student (Seeking Internships)</option>
                <option value="entry level fresher">Fresher / 0 Years</option>
                <option value="1-3 years junior">1 to 3 Years (Junior)</option>
                <option value="3-5 years mid level">3 to 5 Years (Mid-Level)</option>
                <option value="5+ years senior">5+ Years (Senior)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-6">
            <label className="mb-1 block text-sm font-semibold">Verified Technical Skills</label>
            <p className="mb-4 text-xs text-muted-foreground">Add any skills the AI analyzer might have missed.</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary border border-primary/20">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-primary hover:text-destructive">✕</button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-sm text-muted-foreground italic">No skills added yet.</span>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., GraphQL, Docker..." className="flex-1 rounded-xl border bg-background px-4 py-2" />
              <button type="button" onClick={handleAddSkill} className="rounded-xl bg-muted px-6 py-2 text-sm font-bold hover:bg-muted/80">Add</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-4 font-bold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-50">
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Developer API Settings Card */}
      <div className="mt-8 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl">🔑</span>
          <h2 className="text-xl font-bold text-foreground">API Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 font-medium">
          Avoid rate limits during testing. Enter your own JSearch RapidAPI key below. This is stored <span className="font-bold text-foreground">locally in your browser</span> and never sent to our servers.
        </p>
        <div className="flex flex-col gap-4">
          <input type="password" placeholder="Enter RapidAPI Key..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full rounded-xl border border-border bg-background py-3 px-4" />
          <div className="flex gap-3">
            <button onClick={handleSaveKey} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">Save Key</button>
            <button onClick={handleClearKey} className="rounded-xl border bg-muted px-6 py-3 text-sm font-bold hover:bg-destructive hover:text-destructive-foreground">Clear</button>
          </div>
        </div>
        {apiMessage && (
          <div className={`mt-4 rounded-xl p-3 text-sm font-bold border ${apiMessage.includes("⚠️") ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {apiMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;