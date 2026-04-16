/**
 * App.tsx — Main Application Component
 * Sets up routing and manages simple auth state.
 * The isLoggedIn state controls which pages users can access.
 * ROUTING:
 * - /login and /signup are public pages
 * - /dashboard, /profile, /resume, /jobs are protected (require login)
 * - Unknown routes show 404 page
 */
import { ThemeProvider } from "./components/theme-provider";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Page components
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ResumeUpload from "./pages/ResumeUpload";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";

// Layout components
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  // Simple auth state — true if user is logged in
  // Check localStorage to persist login across page refreshes
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  // Called when user logs in successfully
  const handleLogin = () => setIsLoggedIn(true);

  // Called when user clicks logout
  const handleLogout = () => {
    // Clear ALL user data from browser memory on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("studentId");
    localStorage.removeItem("userSkills");
    
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Navbar is shown on every page */}
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

            <Routes>
              {/* Public routes */}
              {/* Landing page: Always show landing page at the root URL */}
              <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} 
              />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              
              {/* Passed onLogin to Signup to enable automatic login */}
              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

              {/* Protected routes — redirect to login if not logged in */}
              <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/resume"
                element={isLoggedIn ? <ResumeUpload /> : <Navigate to="/login" />}
              />
              <Route
                path="/jobs"
                element={isLoggedIn ? <Jobs /> : <Navigate to="/login" />}
              />
              <Route
                path="/jobs/:id"
                element={isLoggedIn ? <JobDetails /> : <Navigate to="/login" />}
              />

              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;