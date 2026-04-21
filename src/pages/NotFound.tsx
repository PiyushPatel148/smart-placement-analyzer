import { useLocation, Link } from "react-router-dom"; 
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground font-medium">Oops! Page not found</p>
        
        {/* Changed from <a> to <Link> for SPA navigation */}
        <Link 
          to="/" 
          className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;