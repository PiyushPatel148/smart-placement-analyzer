/**
 * Navbar.tsx — Navigation Bar Component
 * * Displays the app name and navigation links.
 * Shows Login/Signup when logged out, and page links + Logout when logged in.
 */
import { ModeToggle } from "./ModeToggle";
import { Link, useNavigate } from "react-router-dom";

// Props: isLoggedIn tells us whether to show auth links or app links
interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, onLogout }: NavbarProps) => {
  const navigate = useNavigate();

  // Handle logout: clear auth and go to login page
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* App Name / Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight">
          🎯 Smart Placement Analyzer
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              {/* Show these links only when logged in */}
              <NavItem to="/dashboard" label="Dashboard" />
              <NavItem to="/profile" label="Profile" />
              <NavItem to="/resume" label="Resume" />
              <NavItem to="/jobs" label="Jobs" />
              <button
                onClick={handleLogout}
                className="ml-2 rounded-md border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show login/signup when not logged in */}
              <NavItem to="/login" label="Login" />
              <NavItem to="/signup" label="Sign Up" />
            </>
          )}

          {/* Theme Toggle Button */}
          <ModeToggle />

        </div>
      </div>
    </nav>
  );
};

// Small reusable link component for navbar items
const NavItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
  >
    {label}
  </Link>
);

export default Navbar;