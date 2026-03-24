/**
 * Login.tsx — Login Page
 * * Allows users to log in with email and password.
 * On success, sets the user as logged in and redirects to the landing page.
 * Connected to live MongoDB backend.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Removed the mock API import; we are hitting the real database now!

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  // Form state: email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Loading, error, and success states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added success state

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Call the live Express backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user name to local storage
        localStorage.setItem("token", "live-login-token");
        localStorage.setItem("userName", data.student.name);
        
        // Update parent state to unlock the app
        onLogin(); 
        
        // Show success message and redirect smoothly
        setSuccess(`Welcome back, ${data.student.name}! Redirecting...`);
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Show the specific error from the backend (e.g., "Account not found" or "Incorrect password")
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      setError("Could not connect to the database. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      {/* Login Card */}
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground">
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Sign in to access your placement dashboard
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600 border border-green-500/20">
            {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;