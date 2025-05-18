import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeePage.css";

const EmployeePage = ({ isVisible }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", department: "", gender: "" });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const departmentDropdownRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      console.error("User not authenticated!");
      return;
    }

    const unsubscribeEmployees = onSnapshot(collection(db, "employees"), (snapshot) => {
      const employeeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeData);
    }, (error) => {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees!");
    });

    const unsubscribeDepartments = onSnapshot(collection(db, "departments"), (snapshot) => {
      const departmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartments(departmentData);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeDepartments();
    };
  }, []);

  useEffect(() => {
    if (departmentDropdownRef.current) {
      departmentDropdownRef.current.scrollTop = departmentDropdownRef.current.scrollHeight;
    }
  }, [departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender || !formData.department) {
      toast.error("All fields are required!");
      return;
    }

    if (editingId) {
      await updateEmployee(editingId, formData);
    } else {
      await addEmployee(formData);
    }
  };

  const addEmployee = async (employee) => {
    try {
      const existingEmployee = employees.find(
        (emp) =>
          emp.name.toLowerCase() === employee.name.toLowerCase() ||
          emp.email.toLowerCase() === employee.email.toLowerCase()
      );

      if (existingEmployee) {
        toast.warn("Employee with the same name or email already exists!");
        return;
      }

      await addDoc(collection(db, "employees"), employee);
      toast.success("Employee added successfully! 🎉");
      setFormData({ name: "", email: "", department: "", gender: "" });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee!");
    }
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "employees", id), updatedData);
      toast.success("Employee updated successfully! ✔️");
      setEditingId(null);
      setFormData({ name: "", email: "", department: "", gender: "" });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee!");
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteDoc(doc(db, "employees", id));
        toast.success("Employee deleted successfully! 🗑️");
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee!");
      }
    }
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingId(employee.id);
    setIsFormVisible(true);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())

  );

  return (
    <div className={`employee-container ${!isVisible ? "hidden" : ""}`}>
      <div className={`overlay ${isFormVisible ? "show" : ""}`}></div>
      <h2 className="employee-management-title">Employee List</h2>
      
      <div className="search-add-container">
        <div className="search-container">         
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="add-employee-container">
          <button 
            onClick={() => setIsFormVisible(!isFormVisible)} 
            className="add-employee-button"
          >
            {isFormVisible ? "Cancel" : "+ Add Employee"}
          </button>
        </div>
      </div>

      <div className="employee-form-container">
        <div className={`employee-form ${isFormVisible ? "show" : ""}`}>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              required 
            />

            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              required
              ref={departmentDropdownRef}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>

            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit">
              {editingId ? "Update Employee" : "Save Employee"}
            </button>
          </form>
        </div>
      </div>

      <div className="employee-table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(employee)}>
                      Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate("/dashboard")} className="back-button">
        ← Back to Dashboard
      </button>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ marginTop: "-1px" }}
      />
    </div>
  );
};

export default EmployeePage;
