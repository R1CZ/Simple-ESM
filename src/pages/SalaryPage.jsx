import React from "react";
import "./SalaryPage.css"; // Import the CSS file

const SalaryPage = () => {
  return (
    <div className="salary-page">
      <h1 className="page-title">Salary Management</h1>
      <div className="salary-content">
        <section className="salary-summary">
          <h2>Salary Overview</h2>
          {/* Salary summary components would go here */}
        </section>
        <section className="salary-details">
          <h2>Salary Details</h2>
          {/* Salary details components would go here */}
        </section>
      </div>
    </div>
  );
};

export default SalaryPage;