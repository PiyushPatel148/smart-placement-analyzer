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
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tighter text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            🎯
          </span>
          SkillMatch<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Navigation Links */}
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

          {/* THE FIX: We use [&_button] and [&_svg] to style the ModeToggle button directly.
            - [&_button]:bg-muted adds a soft grey background so the button shape is visible.
            - [&_svg]:text-foreground forces the Sun/Moon icon to be dark in light mode, light in dark mode.
          */}
          <div className="ml-3 border-l border-border pl-3 flex items-center [&_button]:bg-muted hover:[&_button]:bg-muted/80 [&_svg]:text-foreground">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
  >
    {label}
  </Link>
);

export default Navbar;