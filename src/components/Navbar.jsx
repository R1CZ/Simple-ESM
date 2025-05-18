import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Firebase authentication
import "./Navbar.css"; // Import updated CSS

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set authentication state
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out from Firebase
      localStorage.removeItem("role"); // Remove role from localStorage
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">Employee System Management</div>
      <div className="nav-items">
        {isAuthenticated && location.pathname !== "/" && ( // Hide on login page
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
