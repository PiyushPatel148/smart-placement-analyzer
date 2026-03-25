const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // to scramble passwords
const jwt = require('jsonwebtoken'); // for the digital login "passports"
require('dotenv').config(); 

const Student = require('./Student'); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

// fire up the database connection
console.log("⏳ Attempting to connect to MongoDB..."); 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: "backend is live!" });
});

// --- SIGNUP ROUTE ---
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, password, skills, graduationYear } = req.body;

    // make sure this email isn't already taken
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    // scramble the password before it even touches the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword, 
      skills,
      graduationYear
    });
    
    const savedStudent = await newStudent.save();

    // create a secure token that lasts for a week
    const token = jwt.sign(
      { id: savedStudent._id }, 
      process.env.JWT_SECRET,   
      { expiresIn: '7d' }       
    );

    res.status(201).json({ 
      success: true, 
      token, 
      student: { name: savedStudent.name, email: savedStudent.email } 
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
    if (!student) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // check if the typed password matches the scrambled one in the DB
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // if it matches, give them their token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      token, 
      student: { name: student.name, email: student.email } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});