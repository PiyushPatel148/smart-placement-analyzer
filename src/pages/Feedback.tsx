import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("Student");

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Quickly fetch the user's name so we can attach it to the feedback
    const fetchName = async () => {
      if (studentId && token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data: any = await res.json();
          if (res.ok && data.student) setStudentName(data.student.name);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchName();
  }, [studentId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !token) {
      setMessage("❌ Please log in to submit feedback.");
      return;
    }
    if (rating === 0) {
      setMessage("❌ Please select a star rating.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ studentId, studentName, rating, comments })
      });

      if (response.ok) {
        setMessage("✅ Thank you! Your feedback has been submitted.");
        setRating(0);
        setComments("");
      } else {
        setMessage("❌ Failed to submit feedback.");
      }
    } catch (error) {
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Rate Your Experience</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Help us improve SkillMatch! Let us know how the resume analyzer and job matching worked for you.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl shadow-primary/5">
        
        {message && (
          <div className={`mb-8 rounded-2xl p-4 text-center text-sm font-bold border animate-in fade-in duration-300 ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          
          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Overall Rating</span>
            <div className="flex gap-2" onMouseLeave={() => setHoveredRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="44" height="44" 
                    viewBox="0 0 24 24" 
                    fill={(hoveredRating || rating) >= star ? "#F59E0B" : "none"} 
                    stroke={(hoveredRating || rating) >= star ? "#F59E0B" : "currentColor"} 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`transition-colors duration-200 ${!(hoveredRating || rating) ? 'text-muted-foreground/40' : ''}`}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <label className="mb-2 block text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Tell us more</label>
            <textarea
              value={comments}
              onChange={(e: any) => setComments(e.target.value)}
              placeholder="What did you love? What could be better?"
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-4 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full sm:w-auto rounded-full bg-primary px-12 py-4 text-base font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;