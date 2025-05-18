// components/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

const ProtectedRoute = ({ children, allowedRoles = ["Admin"] }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    userRole: null
  });
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get user role from your preferred source (Firestore, localStorage, etc.)
        const role = localStorage.getItem("role") || "Employee"; // Default role
        setAuthState({
          isAuthenticated: true,
          loading: false,
          userRole: role
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          userRole: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    // Redirect to login with return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(authState.userRole)) {
    // Redirect to unauthorized page if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;