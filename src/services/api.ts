
// The exact shape of the data coming from the backend
export interface Job {
  id: string | number;
  title: string;
  company: string;
  type: string;
  skillsRequired: string[];
  applyLink?: string;
  logo?: string;
}

// Fetches jobs from backend, passing the search query and experience level
export const getJobs = async (
  searchQuery: string = "Software Engineer", 
  experienceLevel: string = "entry level fresher"
): Promise<Job[]> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/jobs?query=${encodeURIComponent(searchQuery)}&exp=${encodeURIComponent(experienceLevel)}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch live jobs from server");
    }

    const liveJobs: Job[] = await response.json();
    return liveJobs;
    
  } catch (error) {
    console.error("API Error:", error);
    return []; 
  }
};