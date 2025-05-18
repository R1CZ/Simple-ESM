import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeEmployees = onSnapshot(
      collection(db, "employees"),
      (snapshot) => {
        setTotalEmployees(snapshot.size);
        setLoading(false);
      },
      (error) => console.error("Error fetching employees:", error)
    );

    const unsubscribeDepartments = onSnapshot(
      collection(db, "departments"),
      (snapshot) => {
        setTotalDepartments(snapshot.size);
        setLoading(false);
      },
      (error) => console.error("Error fetching departments:", error)
    );

    const unsubscribeLeaves = onSnapshot(
      collection(db, "leaves"),
      (snapshot) => {
        setTotalLeaves(snapshot.size);
        setLoading(false);
      },
      (error) => console.error("Error fetching leaves:", error)
    );

    return () => {
      unsubscribeEmployees();
      unsubscribeDepartments();
      unsubscribeLeaves();
    };
  }, []);

  const totalSum = totalEmployees + totalDepartments + totalLeaves;

  const chartData = [
    {
      name: "Employees",
      value: totalEmployees,
      fill: "#ff6347",
      percentage: totalSum ? ((totalEmployees / totalSum) * 100).toFixed(1) : 0,
    },
    {
      name: "Departments",
      value: totalDepartments,
      fill: "#4682b4",
      percentage: totalSum
        ? ((totalDepartments / totalSum) * 100).toFixed(1)
        : 0,
    },
    {
      name: "Leaves",
      value: totalLeaves,
      fill: "#32cd32",
      percentage: totalSum ? ((totalLeaves / totalSum) * 100).toFixed(1) : 0,
    },
  ];

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h2 className="dashboard-title">Admin Dashboard Overview</h2>
            <p className="dashboard-subtitle">Real-time organizational analytics</p>
          </header>

          <div className="analytics-section">
            {/* Bar Chart with Background Container */}
            <div className="bar-chart-wrapper" style={{ marginTop: "30px" }}>
              <div className="bar-chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart
                    innerRadius="10%"
                    outerRadius="120%"
                    data={chartData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, Math.max(totalEmployees, totalDepartments, totalLeaves) + 2]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background={{ fill: "#fff" }}
                      dataKey="value"
                      cornerRadius={10}
                      animationBegin={300}
                      animationDuration={1000}
                      label={{
                        position: "insideEnd",
                        fill: "#000",
                        fontSize: 16,
                        formatter: (value, entry) => {
                          if (!entry || !entry.payload) return "";
                          return `${entry.payload.percentage}%`;
                        },
                      }}
                    />
                    {/* Center Label */}
                    <text
                      x="50%"
                      y="75%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="chart-center-label"
                      fontSize={24}
                      fontWeight="bold"
                    >
                      <tspan>{totalSum}</tspan>
                      <tspan dx="8" fontSize="16">Total Overview</tspan>
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card employee-metric">
                <h3 className="metric-title">Total Employees</h3>
                <p className="metric-value">{totalEmployees}</p>
              </div>

              <div className="metric-card department-metric">
                <h3 className="metric-title">Departments</h3>
                <p className="metric-value">{totalDepartments}</p>
              </div>

              <div className="metric-card leave-metric">
                <h3 className="metric-title">Active Leaves</h3>
                <p className="metric-value">{totalLeaves}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
