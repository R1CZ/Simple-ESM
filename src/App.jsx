import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import EmployeePage from "./pages/EmployeePage";
import DepartmentPage from "./pages/DepartmentPage";
import LeavePage from "./pages/LeavePage";
import SalaryPage from "./pages/SalaryPage"; // New import
import SettingsPage from "./pages/SettingsPage"; // New import

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {user && <Sidebar />}
        <div className="main-content">
          {user && <Navbar />}
          <div className="content-area">
            <Routes>
              <Route
                path="/"
                element={!user ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/employee"
                element={user ? <EmployeePage /> : <Navigate to="/" />}
              />
              <Route
                path="/department"
                element={user ? <DepartmentPage /> : <Navigate to="/" />}
              />
              <Route
                path="/leave"
                element={user ? <LeavePage /> : <Navigate to="/" />}
              />
              {/* New Salary Page Route */}
              <Route
                path="/salary"
                element={user ? <SalaryPage /> : <Navigate to="/" />}
              />
              {/* New Settings Page Route */}
              <Route
                path="/settings"
                element={user ? <SettingsPage /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;