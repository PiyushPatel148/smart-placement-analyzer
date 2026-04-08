const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  graduationYear: { type: String },
  education: { type: String },
  preferredRole: { type: String },
  //new field, defaulting to fresher keywords
  experienceLevel: { type: String, default: "entry level fresher" } 
});

module.exports = mongoose.model('Student', studentSchema);