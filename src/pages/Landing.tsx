/**
 * Landing.tsx — Welcome / Landing Page
 * * The first page users see before logging in.
 * Provides an overview of what the app does with feature highlights.
 */

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// 1. Add this interface so the component knows about the prop
interface LandingProps {
  isLoggedIn?: boolean;
}

// 2. Accept the prop in the component definition
const Landing = ({ isLoggedIn }: LandingProps) => {
  // 3. State to hold the message from the Node.js backend
  const [serverMessage, setServerMessage] = useState<string>("Pinging server...");

  // 4. Fetch data from the backend when the page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => {
        setServerMessage(data.message); // Save the message!
      })
      .catch((err) => {
        console.error(err);
        setServerMessage("Backend is offline. Make sure it is running on port 5000!");
      });
  }, []);

  // Features list displayed on the landing page
  const features = [
    {
      icon: "📊",
      title: "Skill Analysis",
      description: "Get a detailed breakdown of your matched and missing skills for your dream job.",
    },
    {
      icon: "📄",
      title: "Resume Parsing",
      description: "Upload your resume and let our system extract and evaluate your skills automatically.",
    },
    {
      icon: "💼",
      title: "Job Matching",
      description: "Browse curated jobs and internships that align with your skill set and goals.",
    },
    {
      icon: "🎯",
      title: "Readiness Score",
      description: "See how placement-ready you are with a clear percentage score and improvement tips.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 5. Server Status Banner */}
      <div className="w-full bg-accent/20 py-2 text-center text-sm font-medium text-accent-foreground border-b border-accent/30">
        🔌 Backend Status: {serverMessage}
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          For Final-Year Students & Job Seekers
        </span>
        <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
          Smart Placement &<br />Skill Gap Analyzer
        </h1>
        <p className="mb-8 max-w-lg text-lg text-muted-foreground">
          Understand your strengths, identify skill gaps, and find the right
          jobs — all in one simple dashboard.
        </p>

        {/* SMART CTA Buttons */}
        <div className="flex gap-3">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Four simple steps to placement readiness
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <p className="mb-3 text-3xl">{feature.icon}</p>
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMART Footer CTA */}
      <section className="px-4 py-14 text-center">
        <h2 className="mb-3 text-xl font-bold text-foreground">
          {isLoggedIn ? "Ready to view your progress?" : "Ready to check your placement readiness?"}
        </h2>
        <Link
          to={isLoggedIn ? "/dashboard" : "/signup"}
          className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
        >
          {isLoggedIn ? "Go to Dashboard" : "Create Your Free Account"}
        </Link>
      </section>
    </div>
  );
};

export default Landing;