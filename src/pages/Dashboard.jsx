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
import { motion } from "framer-motion";
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
    return (
      <motion.div 
        className="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <motion.header 
            className="dashboard-header"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="dashboard-title">Admin Dashboard Overview</h2>
            <p className="dashboard-subtitle">Real-time organizational analytics</p>
          </motion.header>

          <div className="analytics-section">
            {/* Bar Chart with Background Container */}
            <motion.div 
              className="bar-chart-wrapper" 
              style={{ marginTop: "30px" }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="bar-chart-container"
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
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
                      animationDuration={1500}
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
              </motion.div>
            </motion.div>

            <motion.div 
              className="metrics-grid"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { title: "Total Employees", value: totalEmployees, class: "employee-metric", delay: 0.5 },
                { title: "Departments", value: totalDepartments, class: "department-metric", delay: 0.6 },
                { title: "Active Leaves", value: totalLeaves, class: "leave-metric", delay: 0.7 }
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  className={`metric-card ${metric.class}`}
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: metric.delay,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <h3 className="metric-title">{metric.title}</h3>
                  <motion.p 
                    className="metric-value"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: metric.delay + 0.3,
                      type: "spring"
                    }}
                  >
                    {metric.value}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
