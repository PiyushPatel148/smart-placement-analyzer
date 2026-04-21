import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.student.name);
        
        if (data.student.id) {
          localStorage.setItem("studentId", data.student.id);
        }
        
        if (data.student.skills) {
          localStorage.setItem("userSkills", JSON.stringify(data.student.skills));
        }
        
        onLogin(); 
        setSuccess(`Welcome back, ${data.student.name}!`);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Database connection failed. Is the server on?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold">Welcome Back</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">Sign in to access your dashboard</p>

        {error && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 border border-green-500/20">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {loading ? "Checking..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">No account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;