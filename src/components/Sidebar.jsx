import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthenticated) return null;

  const sidebarItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/employee", icon: "👥", label: "Employee" },
    { path: "/department", icon: "🏢", label: "Department" },
    { path: "/leave", icon: "📅", label: "Leave" },
    { path: "/salary", icon: "💰", label: "Salary" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img 
          src={auth.currentUser?.photoURL || "Ricz.png"} 
          className="profile-image" 
          alt="Profile" 
        />
        <span className="username">
          {auth.currentUser?.displayName || "Admin"}
        </span>
      </div>

      <ul className="sidebar-menu">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path || 
                         (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <li 
              key={item.path} 
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <Link to={item.path} className="sidebar-link">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;