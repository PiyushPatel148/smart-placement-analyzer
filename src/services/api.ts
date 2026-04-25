export const API_BASE_URL = "https://skillmatch-backend-zloc.onrender.com";

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

export const getJobs = async (query: string, targetExp: string): Promise<Job[]> => {
  // Pass the real experience level directly to the backend
  const url = `${API_BASE_URL}/api/jobs?query=${encodeURIComponent(query)}&exp=${encodeURIComponent(targetExp)}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; 
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