import { ModeToggle } from "./ModeToggle";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, onLogout }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* BRAND LOGO: Modern SVG Icon and Two-Tone Typography */}
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            Skill<span className="text-primary">Match</span>
            <span className="text-primary ml-0.5">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          
          {/* NAVIGATION LINKS: Conditional rendering based on auth state */}
          <nav className="flex items-center gap-1">
            {isLoggedIn ? (
              <>
                <NavItem to="/dashboard" label="Dashboard" />
                <NavItem to="/jobs" label="Jobs" />
                <NavItem to="/resume" label="Analyzer" />
                <NavItem to="/profile" label="Profile" />
                
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-lg bg-muted px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <Link
                  to="/signup"
                  className="ml-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* THEME TOGGLE 
              - [&_button]:bg-muted adds a soft grey background so the button shape is visible.
              - [&_svg]:text-foreground forces correct icon contrast in light/dark modes. 
          */}
          <div className="ml-3 border-l border-border pl-3 flex items-center [&_button]:bg-muted hover:[&_button]:bg-muted/80 [&_svg]:text-foreground">
            <ModeToggle />
          </div>
          
        </div>
      </div>
    </header>
  );
};

// HELPER COMPONENT: Reusable link item for the navbar
const NavItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
  >
    {label}
  </Link>
);

export default Navbar;