/**
 * App.tsx — Main Application Component
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
import Feedback from "./pages/Feedback";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Layout components
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
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
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

              {/* Protected routes */}
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
              <Route
                path="/feedback"
                element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;