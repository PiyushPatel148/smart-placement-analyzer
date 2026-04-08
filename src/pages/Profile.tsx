import { useState, useEffect } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [education, setEducation] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  
  // State for the new experience level dropdown
  const [experienceLevel, setExperienceLevel] = useState("entry level fresher");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const studentId = localStorage.getItem("studentId");

  const jobRoles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Analyst", "Mobile App Developer", "DevOps Engineer",
    "UI/UX Designer", "Software Engineer"
  ];

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!studentId) {
        setFetching(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/students/${studentId}`);
        const data = await response.json();
        
        if (response.ok && data.student) {
          setName(data.student.name);
          setGradYear(data.student.graduationYear?.toString() || "");
          setSkills(data.student.skills || []);
          setEducation(data.student.education || "");
          setPreferredRole(data.student.preferredRole || "");
          
          // Load saved experience level or fallback to default
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

  // Handle adding a manual skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault(); 
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
      setMessage(""); 
    }
  };

  // Handle removing a skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    setMessage("");
  };

  // Submit updated profile to the backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          skills, 
          graduationYear: Number(gradYear),
          education,
          preferredRole,
          experienceLevel // Send the selected experience level string
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        localStorage.setItem("userSkills", JSON.stringify(skills));
        localStorage.setItem("userName", name);
      } else {
        setMessage(`❌ ${data.message || "Failed to save changes."}`);
      }
    } catch (err) {
      setMessage("❌ Could not connect to the server.");
    } finally {
      setLoading(false);
    }
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Manage your personal details and fine-tune your verified skills.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        
        {message && (
          <div className={`mb-6 rounded-xl p-4 text-center text-sm font-bold border ${message.includes("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Info Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Education / University</label>
              <input 
                type="text" 
                value={education} 
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech in Computer Science from XYZ University"
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Graduation Year</label>
              <input 
                type="number" 
                value={gradYear} 
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Preferred Job Role</label>
              <select
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a role...</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* New Experience Level Dropdown */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="entry level fresher">Fresher / 0 Years</option>
                <option value="1-3 years junior">1 to 3 Years (Junior)</option>
                <option value="3-5 years mid level">3 to 5 Years (Mid-Level)</option>
                <option value="5+ years senior lead">5+ Years (Senior/Lead)</option>
              </select>
            </div>
          </div>

          {/* Interactive Skills Section */}
          <div className="rounded-xl border bg-muted/20 p-6">
            <label className="mb-1 block text-sm font-semibold">Verified Technical Skills</label>
            <p className="mb-4 text-xs text-muted-foreground">Add any skills the AI analyzer might have missed.</p>
            
            <form onSubmit={handleAddSkill} className="mb-6 flex gap-3">
              <input 
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Docker, Figma, AutoCAD..."
                className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={!newSkill.trim()}
                className="rounded-lg bg-secondary px-6 font-bold text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                Add
              </button>
            </form>
            
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
              ) : (
                skills.map(skill => (
                  <span 
                    key={skill} 
                    className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary border border-primary/20 transition-all hover:bg-primary hover:text-primary-foreground group"
                  >
                    {skill}
                    <button 
                      type="button"
                      onClick={() => removeSkill(skill)} 
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary-foreground group-hover:text-primary transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3.5 font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving to Database..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;