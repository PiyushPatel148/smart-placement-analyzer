const mongoose = require('mongoose');

// Define the rules for the student data
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {               
    type: String,
    required: true
  },
  skills: {
    type: [String], 
    default: []
  },
  graduationYear: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    default: ""
  },
  preferredRole: {
    type: String,
    default: ""
  }
}, { timestamps: true }); 

// Export the model so the rest of the app can use it
module.exports = mongoose.model('Student', studentSchema);