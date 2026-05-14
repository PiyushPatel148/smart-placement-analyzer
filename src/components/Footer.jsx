// src/components/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
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
  );
};

export default Footer;