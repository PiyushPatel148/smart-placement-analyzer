// A simple script to test our POST route
console.log(" Sending test data to the server...");

fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "Piyush",
    email: "piyush.test2@example.com", // Made this test2 just to be safe
    skills: ["Machine Learning", "RNNs", "React", "Node.js"],
    graduationYear: 2026
  })
})
  .then((response) => response.json())
  .then((data) => {
    console.log("✅ Server Response:", data);
  })
  .catch((error) => {
    console.error("❌ Test Failed:", error);
  });