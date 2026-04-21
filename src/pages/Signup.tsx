import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

interface SignupProps {
  onLogin: () => void;
}

const Signup = ({ onLogin }: SignupProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [graduationYear, setGraduationYear] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Changed to use the dynamic Render API URL
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          graduationYear: Number(graduationYear), 
          skills: [] 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", name);
        
        if (data.student && data.student.id) {
          localStorage.setItem("studentId", data.student.id);
        }
        
        onLogin();
        setSuccess("Account created! Logging you in...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Signup failed. Try a different email.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server is offline. Check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold">Create Account</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">Join Smart Placement Analyzer</p>

        {error && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 border border-green-500/20">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Graduation Year</label>
            <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2026" required min="2000" max="2030" className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Signup;