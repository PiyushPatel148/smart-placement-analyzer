import { Link } from "react-router-dom";

interface LandingProps {
  isLoggedIn?: boolean;
}

const testimonials = [
  {
    name: "Rahul S.",
    role: "Frontend Developer",
    review: "This platform completely changed my job hunt. The skill gap analysis told me exactly what I was missing before I even applied.",
    initials: "RS",
    color: "bg-blue-100 text-blue-700"
  },
  {
    name: "Priya M.",
    role: "Data Analyst",
    review: "I loved seeing my match percentage instantly. It saved me so much time because I stopped applying to jobs I wasn't qualified for.",
    initials: "PM",
    color: "bg-purple-100 text-purple-700"
  },
  {
    name: "Amit K.",
    role: "Senior Software Engineer",
    review: "The resume parser is incredibly accurate. It automatically built my profile and the dashboard keeps my saved jobs perfectly organized.",
    initials: "AK",
    color: "bg-green-100 text-green-700"
  }
];

const features = [
  {
    icon: "📊",
    title: "Skill Gap Analysis",
    description: "Get a detailed breakdown of your matched and missing skills compared to live industry requirements.",
  },
  {
    icon: "📄",
    title: "Smart Resume Parsing",
    description: "Upload your PDF and let our algorithm extract and evaluate your technical skills automatically.",
  },
  {
    icon: "💼",
    title: "Live Job Matching",
    description: "Browse curated, real-time job listings that perfectly align with your specific experience level.",
  },
  {
    icon: "🎯",
    title: "Readiness Score",
    description: "See exactly how placement-ready you are with a dynamic percentage score and improvement tips.",
  },
];

const Landing = ({ isLoggedIn }: LandingProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20 selection:bg-primary/20 transition-colors duration-300">
      
      <main className="flex-grow">
        
        <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-16 sm:pb-24 flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 blur-[100px] bg-gradient-to-b from-primary/50 to-transparent -z-10 rounded-full pointer-events-none"></div>

          <div className="mb-8 inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm shadow-sm transition-colors">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Built for Every Stage of Your Career
          </div>
          
          <h1 className="mb-6 max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Stop searching in the dark. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Start matching smartly.
            </span>
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl font-medium leading-relaxed">
            Upload your resume, discover your exact skill gaps, and get instantly matched with verified job opportunities tailored to your unique profile and experience level.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 z-10">
            {isLoggedIn ? (
              <Link to="/dashboard" className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 transition-all">
                Access Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 transition-all">
                  Create Free Account
                </Link>
                <Link to="/login" className="w-full sm:w-auto rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-4 text-base font-bold text-foreground shadow-sm hover:bg-muted transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="bg-muted/10 py-16 md:py-20 border-y border-border transition-colors">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">The Engine Behind Your Success</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to move from applicant to hired professional in one unified platform.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/40 group">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-20 border-b border-border transition-colors">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">Trusted by Job Seekers</h2>
              <p className="text-muted-foreground text-lg">Join hundreds of professionals advancing their careers and landing dream roles.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-muted-foreground italic mb-8 leading-relaxed font-medium">"{t.review}"</p>
                  <div className="flex items-center gap-4 mt-auto border-t border-border pt-6">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-sm ${t.color}`}>
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!isLoggedIn && (
          <section className="px-4 py-16 md:py-20 text-center relative overflow-hidden bg-background transition-colors">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-[0.08] blur-[80px] bg-primary -z-10 rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">Ready to calculate your Readiness Score?</h2>
              <p className="mb-8 text-muted-foreground max-w-xl mx-auto text-lg font-medium">Join today to upload your resume and get instant feedback on your industry readiness.</p>
              <Link to="/signup" className="inline-block rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
                Get Started Now
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border bg-muted/20 mt-auto transition-colors">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter">SkillMatch<span className="text-primary">.</span></h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed font-medium">
                Empowering job seekers and professionals to bridge the gap between their skills and industry requirements.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4 tracking-wide uppercase text-xs">Platform</h4>
              <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link to="/resume" className="hover:text-primary transition-colors">Resume Analyzer</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4 tracking-wide uppercase text-xs">Legal</h4>
              <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                {/* --- UPDATED LEGAL LINKS --- */}
                <li><Link to="/privacy" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors cursor-pointer">Terms of Service</Link></li>
                <li><a href="mailto:support@skillmatch.com" className="hover:text-primary transition-colors cursor-pointer">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-center text-sm font-medium text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SkillMatch Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;