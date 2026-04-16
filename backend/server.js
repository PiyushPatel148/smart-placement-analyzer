const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config(); 

const multer = require('multer'); 
const PDFParser = require("pdf2json"); 

const upload = multer({ storage: multer.memoryStorage() });
const Student = require('./Student'); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

console.log("Attempting to connect to MongoDB..."); 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: "backend is live!" });
});

// --- SIGNUP ROUTE ---
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, password, skills, graduationYear } = req.body;
    const existingUser = await Student.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already in use." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name, email, password: hashedPassword, skills, graduationYear
    });
    
    const savedStudent = await newStudent.save();
    const token = jwt.sign({ id: savedStudent._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      success: true, 
      token, 
      student: { id: savedStudent._id, name: savedStudent.name, email: savedStudent.email } 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ success: false, message: "Account not found." });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password." });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token, 
      student: { 
        id: student._id, 
        name: student.name, 
        email: student.email,
        skills: student.skills 
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// --- GET STUDENT PROFILE ---
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, student });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- UPDATE STUDENT PROFILE ---
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, skills, graduationYear, education, preferredRole, experienceLevel } = req.body;
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, skills, graduationYear, education, preferredRole, experienceLevel },
      { returnDocument: 'after' } 
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully!", 
      student: updatedStudent 
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
});

// --- SAVE OR UNSAVE A JOB ---
app.post('/api/students/:id/save-job', async (req, res) => {
  try {
    const { id } = req.params;
    const { jobId } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Initialize array if it doesn't exist for older accounts
    if (!student.savedJobs) {
      student.savedJobs = [];
    }

    // Check if job is already saved
    const isSaved = student.savedJobs.includes(jobId);

    if (isSaved) {
      // If already saved, remove it (Unsave)
      student.savedJobs = student.savedJobs.filter(jid => jid !== jobId);
    } else {
      // Otherwise, add it
      student.savedJobs.push(jobId);
    }

    await student.save();
    res.json({ success: true, savedJobs: student.savedJobs });
  } catch (error) {
    console.error("Save job error:", error);
    res.status(500).json({ success: false, message: "Error toggling saved job" });
  }
});

// Helper function to extract text from PDF buffer
const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
};

// --- RESUME UPLOAD & ANALYSIS ROUTE ---
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }

    console.log("Extracting text using pdf2json...");
    const resumeText = await extractTextFromPDF(req.file.buffer);
    
    const techDictionary = [
      "React", "Node.js", "Express", "MongoDB", "Python", "Java", 
      "C++", "C", "Machine Learning", "Data Analysis", "SQL", "MySQL", 
      "AWS", "Docker", "Git", "HTML", "CSS", "JavaScript", "TypeScript"
    ];

    const matchedSkills = techDictionary.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      return regex.test(resumeText);
    });

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { skills: matchedSkills },
      { returnDocument: 'after' }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found in database." });
    }

    console.log(`Algorithm found ${matchedSkills.length} skills and saved to DB.`);

    res.status(200).json({ 
      success: true, 
      message: `Analyzed! Found ${matchedSkills.length} skills.`,
      skills: updatedStudent.skills, 
      preview: resumeText.substring(0, 150) + "..." 
    });

  } catch (error) {
    console.error("Final Parsing Error Details:", error);
    res.status(500).json({ success: false, message: "Failed to read the PDF document." });
  }
});

// --- FETCH REAL JOBS FROM JSEARCH ---
app.get('/api/jobs', async (req, res) => {
  try {
    const userQuery = req.query.query || 'Software Engineer';
    
    // Map the frontend dropdown strings to simple, API-friendly keywords
    const expLevel = req.query.exp || '';
    let searchKeywords = 'entry level fresher';
    
    if (expLevel.includes('1-3')) searchKeywords = 'junior';
    else if (expLevel.includes('3-5')) searchKeywords = 'mid level';
    else if (expLevel.includes('5+')) searchKeywords = 'senior';

    const searchQuery = `${userQuery} ${searchKeywords} India`;

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: searchQuery,
        page: '1',
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    console.log(`Fetching jobs for: ${searchQuery}...`);
    const response = await axios.request(options);
    
    // Extract the data array. If the API returns nothing, force an error to trigger the failsafe.
    const rawJobs = response.data.data || [];
    
    if (rawJobs.length === 0) {
      console.log("API returned 0 jobs. Forcing failsafe fallback data.");
      throw new Error("Zero jobs returned from API"); 
    }
    
    const techDictionary = [
      "React", "Node.js", "Express", "MongoDB", "Python", "Java", 
      "C++", "C", "C#", "Machine Learning", "Data Analysis", "SQL", "MySQL", 
      "AWS", "Docker", "Git", "HTML", "CSS", "JavaScript", "TypeScript",
      "Azure", "Google Cloud", "Excel", "Tableau", "Spring Boot", "Angular", "Vue"
    ];

    const cleanedJobs = rawJobs.map(job => {
      // Mash all text together to ensure we don't miss any skills
      const fullTextToSearch = [
        ...(job.job_highlights?.Qualifications || []),
        ...(job.job_highlights?.Responsibilities || []),
        job.job_description || ""
      ].join(" ");
      
      const actualSkills = techDictionary.filter(skill => {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
        return regex.test(fullTextToSearch);
      });
      
      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        type: job.job_employment_type || "Full-time",
        skillsRequired: actualSkills,
        applyLink: job.job_apply_link,
        logo: job.employer_logo
      };
    });

    const relevantJobs = cleanedJobs.filter(job => job.skillsRequired.length > 0);

    // If our dictionary filter killed all the jobs, just send the first 5 unfiltered ones anyway
    if (relevantJobs.length === 0 && cleanedJobs.length > 0) {
       console.log("Filter was too strict. Returning un-filtered jobs so UI isn't blank.");
       return res.json(cleanedJobs.slice(0, 5)); 
    }

    res.json(relevantJobs);

  } catch (error) {
    console.error("Triggering Fallback Failsafe:", error.message);
    
    // Failsafe response
    res.json([
      {
        id: "fallback-1",
        title: "Frontend Developer (Fresher)",
        company: "TechCorp India",
        type: "Full-time",
        skillsRequired: ["React", "JavaScript", "HTML", "CSS"],
      },
      {
        id: "fallback-2",
        title: "Data Analyst Intern",
        company: "DataMinds",
        type: "Internship",
        skillsRequired: ["Python", "SQL", "Excel"],
      },
      {
        id: "fallback-3",
        title: "Backend Engineer (Entry Level)",
        company: "ServerPro India",
        type: "Full-time",
        skillsRequired: ["Node.js", "Express", "MongoDB", "AWS"],
      }
    ]);
  }
});

// --- FETCH SINGLE JOB DETAILS ---
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's one of our fallback dummy jobs
    if (id.startsWith('fallback-')) {
       const fallbacks = {
         "fallback-1": { id: "fallback-1", title: "Frontend Developer (Fresher)", company: "TechCorp India", type: "Full-time", skillsRequired: ["React", "JavaScript", "HTML", "CSS"], description: "Join TechCorp as a junior developer building modern web interfaces. You will work closely with senior developers to translate Figma designs into robust React components.", location: "Bangalore, India", salary: "₹4,00,000 - ₹6,00,000" },
         "fallback-2": { id: "fallback-2", title: "Data Analyst Intern", company: "DataMinds", type: "Internship", skillsRequired: ["Python", "SQL", "Excel"], description: "Help our data team analyze large datasets for business insights. You will write SQL queries, build dashboards in Excel, and automate scripts using Python.", location: "Remote", salary: "Stipend: ₹15,000/month" },
         "fallback-3": { id: "fallback-3", title: "Backend Engineer (Entry Level)", company: "ServerPro India", type: "Full-time", skillsRequired: ["Node.js", "Express", "MongoDB", "AWS"], description: "Looking for an enthusiastic fresher to help scale our backend infrastructure. Experience with REST APIs and NoSQL databases is required.", location: "Pune, India", salary: "₹5,00,000 - ₹7,00,000" }
       };
       return res.json(fallbacks[id] || fallbacks["fallback-1"]);
    }

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/job-details',
      params: { job_id: id, extended_publisher_details: 'false' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const job = response.data.data[0];

    if (!job) return res.status(404).json({ message: "Job not found" });

    const techDictionary = [
      "React", "Node.js", "Express", "MongoDB", "Python", "Java", 
      "C++", "C", "C#", "Machine Learning", "Data Analysis", "SQL", "MySQL", 
      "AWS", "Docker", "Git", "HTML", "CSS", "JavaScript", "TypeScript",
      "Azure", "Google Cloud", "Excel", "Tableau", "Spring Boot", "Angular", "Vue"
    ];
    
    // Combine text to find skills
    const fullText = [job.job_description, ...(job.job_highlights?.Qualifications || [])].join(" ");
    const skills = techDictionary.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(fullText);
    });

    res.json({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      description: job.job_description,
      skillsRequired: skills,
      applyLink: job.job_apply_link,
      location: (job.job_city || "") + (job.job_country ? ", " + job.job_country : "Remote"),
      salary: job.job_min_salary ? `${job.job_min_salary} - ${job.job_max_salary}` : "Not Disclosed",
      logo: job.employer_logo
    });
  } catch (error) {
    console.error("Detail Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching job details" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});