import React from "react";
import "./LeavePage.css"; // Import the CSS file

const LeavePage = () => {
  return (
    <div className="leave-page">
      <h1 className="page-title">Leave Management</h1>
      <div className="leave-content">
        <section className="leave-requests">
          <h2>Leave Requests</h2>
          {/* Leave request list would go here */}
        </section>
        <section className="new-request">
          <h2>New Request</h2>
          {/* Leave request form would go here */}
        </section>
      </div>
    </div>
  );
};

export default LeavePage;