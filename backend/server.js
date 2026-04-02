const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    // Destructure all required fields, including the recently added ones
    const { name, skills, graduationYear, education, preferredRole } = req.body;
    
    // Find the student by ID and update their fields
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, skills, graduationYear, education, preferredRole },
      { new: true } // Return the updated document
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

    // Save the matched skills to the database permanently
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { skills: matchedSkills },
      { new: true }
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});