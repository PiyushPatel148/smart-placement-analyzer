/**
 * Profile.tsx — User Profile Page
 * 
 * Lets users enter their education, skills, and preferred job role.
 * Saves data via mock API.
 */

import { useState } from "react";
import { saveProfile } from "../services/api";

const Profile = () => {
  // Profile form fields
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // List of job roles for the dropdown
  const jobRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Mobile App Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Software Tester",
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await saveProfile({ education, skills, preferredRole });
      if (response.success) {
        setMessage("✅ Profile saved successfully!");
      }
    } catch (err) {
      setMessage("❌ Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">My Profile</h1>
      <p className="mb-6 text-muted-foreground">
        Fill in your details so we can analyze your placement readiness.
      </p>

      {/* Success/Error message */}
      {message && (
        <div className="mb-4 rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
          {message}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
        {/* Education */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Education
          </label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. MCA from XYZ University"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Skills (comma-separated) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Java, SQL, HTML, Python"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Preferred Job Role — Dropdown */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Preferred Job Role
          </label>
          <select
            value={preferredRole}
            onChange={(e) => setPreferredRole(e.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a role...</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
