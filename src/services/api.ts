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
  // Grab the user's custom API key, or use the working default fallback
  const userApiKey = localStorage.getItem("rapidApiKey");
  const DEFAULT_KEY = "d9bd985cdamsh434301089b98f3bp141b2fjsn6c3900ec0d5c"; 
  const activeKey = userApiKey && userApiKey.trim() !== "" ? userApiKey : DEFAULT_KEY;

  // Format query to assist the RapidAPI engine
  const searchQuery = jobType === "INTERN" ? `${query} Intern` : query;

  // Force the API to only return the exact employment type requested
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&employment_types=${jobType}&page=1&num_pages=1`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': activeKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!result.data) return [];

    return result.data.map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: `${job.job_city || ''}, ${job.job_state || ''}`.replace(/^, | , $/g, '') || 'Remote',
      type: job.job_employment_type,
      salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : 'Not Disclosed',
      description: job.job_description,
      skillsRequired: ["React", "JavaScript", "Python", "SQL", "Git", "Node.js"].filter(() => Math.random() > 0.5), 
      applyLink: job.job_apply_link,
      logo: job.employer_logo
    }));
  } catch (error) {
    console.error("Error fetching jobs from RapidAPI:", error);
    return [];
  }
};

export const getJobById = async (id: string): Promise<Job | null> => {
  const userApiKey = localStorage.getItem("rapidApiKey");
  const DEFAULT_KEY = "d9bd985cdamsh434301089b98f3bp141b2fjsn6c3900ec0d5c"; 
  const activeKey = userApiKey && userApiKey.trim() !== "" ? userApiKey : DEFAULT_KEY;

  const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${id}&extended_publisher_details=false`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': activeKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!result.data || result.data.length === 0) return null;

    const job = result.data[0];

    return {
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: `${job.job_city || ''}, ${job.job_state || ''}`.replace(/^, | , $/g, '') || 'Remote',
      type: job.job_employment_type,
      salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : 'Not Disclosed',
      description: job.job_description,
      skillsRequired: ["React", "JavaScript", "Python", "SQL", "Git", "Node.js"].filter(() => Math.random() > 0.5), 
      applyLink: job.job_apply_link,
      logo: job.employer_logo
    };
  } catch (error) {
    console.error(`Error fetching job details for ID ${id}:`, error);
    return null;
  }
};