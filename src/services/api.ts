// IMPORTANT: When your backend goes live on Render, change this to your Render URL!
// Example: export const API_BASE_URL = "https://skillmatch-api.onrender.com";
export const API_BASE_URL = "http://localhost:5000";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  skillsRequired: string[];
  applyLink: string;
  logo?: string;
}

export const getJobs = async (query: string, jobType: string): Promise<Job[]> => {
  // Map frontend job type to the keywords your backend expects
  const expLevel = jobType === "INTERN" ? "fresher intern" : "fresher";
  
  // Call your Node.js backend instead of calling RapidAPI directly
  const url = `${API_BASE_URL}/api/jobs?query=${encodeURIComponent(query)}&exp=${encodeURIComponent(expLevel)}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Your backend already formats the jobs perfectly
  } catch (error) {
    console.error("Error fetching jobs from Backend:", error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const url = `${API_BASE_URL}/api/jobs/${id}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
       throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching job details for ID ${id}:`, error);
    return null;
  }
};