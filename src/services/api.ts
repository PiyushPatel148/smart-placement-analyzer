/**
 * api.ts — Mock API Service
 * 
 * This file contains all API calls used across the app.
 * Currently using mock data (fake responses).
 * 
 * HOW TO SWITCH TO REAL API:
 * 1. Replace the mock functions below with actual axios calls
 * 2. Change BASE_URL to your real backend URL
 * 3. Remove the fake delay (setTimeout)
 * 
 * Example of real API call:
 *   export const loginUser = (data) => axios.post(`${BASE_URL}/api/login`, data);
 */

import axios from "axios";

// Change this to your real backend URL when ready
const BASE_URL = "http://localhost:5000";

// ============================================
// Helper: Simulate network delay (fake loading)
// ============================================
const fakeDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// AUTH APIs
// ============================================

/** Mock login — accepts any email/password, returns a fake token */
export const loginUser = async (email: string, password: string) => {
  await fakeDelay();
  // In real app: return axios.post(`${BASE_URL}/api/login`, { email, password });
  return {
    success: true,
    token: "mock-jwt-token-12345",
    user: { name: "John Doe", email },
  };
};

/** Mock signup — pretends to create a new account */
export const signupUser = async (name: string, email: string, password: string) => {
  await fakeDelay();
  // In real app: return axios.post(`${BASE_URL}/api/signup`, { name, email, password });
  return {
    success: true,
    message: "Account created successfully!",
  };
};

// ============================================
// PROFILE API
// ============================================

/** Mock save profile — stores education, skills, and preferred role */
export const saveProfile = async (profileData: {
  education: string;
  skills: string;
  preferredRole: string;
}) => {
  await fakeDelay();
  // In real app: return axios.post(`${BASE_URL}/api/profile`, profileData);
  return {
    success: true,
    message: "Profile saved successfully!",
  };
};

// ============================================
// RESUME UPLOAD API
// ============================================

/** Mock resume upload — pretends to upload a PDF file */
export const uploadResume = async (file: File) => {
  await fakeDelay(1200);
  // In real app:
  // const formData = new FormData();
  // formData.append("resume", file);
  // return axios.post(`${BASE_URL}/api/upload-resume`, formData);
  return {
    success: true,
    message: "Resume uploaded and parsed successfully!",
  };
};

// ============================================
// SKILL ANALYSIS API
// ============================================

/** Mock skill analysis — returns readiness score, matched and missing skills */
export const getSkillAnalysis = async () => {
  await fakeDelay();
  // In real app: return axios.get(`${BASE_URL}/api/skill-analysis`);
  return {
    readinessScore: 70,
    matchedSkills: ["Java", "SQL", "HTML", "CSS", "Python"],
    missingSkills: ["React", "Node.js", "TypeScript", "Docker"],
  };
};

// ============================================
// JOBS & INTERNSHIPS API
// ============================================

/** Mock jobs listing — returns a list of available jobs/internships */
export const getJobs = async () => {
  await fakeDelay();
  // In real app: return axios.get(`${BASE_URL}/api/jobs`);
  return [
    {
      id: 1,
      title: "Junior Software Developer",
      company: "ABC Tech",
      type: "Internship",
      skillsRequired: ["JavaScript", "React", "Git"],
    },
    {
      id: 2,
      title: "Backend Developer Intern",
      company: "DataFlow Inc.",
      type: "Internship",
      skillsRequired: ["Python", "Django", "SQL"],
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "WebSoft Solutions",
      type: "Full-time",
      skillsRequired: ["React", "Node.js", "MongoDB"],
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Insight Analytics",
      type: "Full-time",
      skillsRequired: ["Python", "SQL", "Tableau", "Excel"],
    },
    {
      id: 5,
      title: "Mobile App Developer",
      company: "AppNova",
      type: "Internship",
      skillsRequired: ["React Native", "JavaScript", "Firebase"],
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "CloudBase Systems",
      type: "Full-time",
      skillsRequired: ["Docker", "Kubernetes", "AWS", "Linux"],
    },
  ];
};
