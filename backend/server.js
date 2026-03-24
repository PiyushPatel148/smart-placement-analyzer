const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Import the student model from the same folder
const Student = require('./Student'); 

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors()); // Allow requests from the React frontend
app.use(express.json()); // Parse incoming JSON payloads

// Connect to MongoDB Atlas
console.log("⏳ Attempting to connect to MongoDB..."); 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic test route to verify the API is running
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: "Smart Placement Analyzer backend is live!" 
  });
});

// Route to save a new student to the database
app.post('/api/students', async (req, res) => {
  try {
    // Extract the data sent from the frontend (Now including password)
    const { name, email, password, skills, graduationYear } = req.body;

    // Create a new student document using the model (Now including password)
    const newStudent = new Student({
      name,
      email,
      password,
      skills,
      graduationYear
    });

    // Save it to MongoDB
    const savedStudent = await newStudent.save();

    // Send a success message and the saved data back to the frontend
    res.status(201).json({ success: true, student: savedStudent });
  } catch (error) {
    console.error("Error saving student:", error);
    res.status(500).json({ success: false, message: "Failed to save student data" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
// Route to handle user login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Search the database for a student with this email
    const student = await Student.findOne({ email: email });

    // 2. If no student is found, send an error
    if (!student) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // 3. Check if the password matches
    // Note: This is checking plain text right now. We will add secure hashing later!
    if (student.password !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // 4. If email and password match, send a success response
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      student: { name: student.name, email: student.email } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});