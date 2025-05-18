import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DepartmentPage.css";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [employeeCounts, setEmployeeCounts] = useState({});
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const MAX_DEPARTMENTS = 6;
  const MAX_NAME_LENGTH = 50;

  useEffect(() => {
    const unsubscribeDepartments = onSnapshot(collection(db, "departments"), (snapshot) => {
      const departmentList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDepartments(departmentList);
      setFilteredDepartments(departmentList);
    });

    const unsubscribeEmployees = onSnapshot(collection(db, "employees"), (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const { department } = doc.data();
        if (department) {
          counts[department] = (counts[department] || 0) + 1;
        }
      });
      setEmployeeCounts(counts);
    });

    return () => {
      unsubscribeDepartments();
      unsubscribeEmployees();
    };
  }, []);

  const handleAddDepartment = async () => {
    try {
      if (name.trim() === "") {
        toast.error("Department name cannot be empty.");
        return;
      }
      if (name.length > MAX_NAME_LENGTH) {
        toast.error(`Department name cannot exceed ${MAX_NAME_LENGTH} characters.`);
        return;
      }
      if (departments.length >= MAX_DEPARTMENTS) {
        toast.error(`Cannot add more than ${MAX_DEPARTMENTS} departments.`);
        return;
      }
      if (limit && (isNaN(limit) || parseInt(limit) < 0)) {
        toast.error("Limit must be a non-negative number.");
        return;
      }

      const newDepartment = {
        name,
        limit: limit ? parseInt(limit) : null
      };

      await addDoc(collection(db, "departments"), newDepartment);
      resetForm();
      toast.success("Department added successfully! 🎉");
    } catch (err) {
      toast.error("Failed to add department. Please try again.");
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      if (name.trim() === "") {
        toast.error("Department name cannot be empty.");
        return;
      }
      if (name.length > MAX_NAME_LENGTH) {
        toast.error(`Department name cannot exceed ${MAX_NAME_LENGTH} characters.`);
        return;
      }
      if (limit === "" || isNaN(limit) || parseInt(limit) < 0) {
        toast.error("Limit must be a non-negative number.");
        return;
      }
      
      const departmentRef = doc(db, "departments", editingId);
      await updateDoc(departmentRef, {
        name,
        limit: limit ? parseInt(limit) : null
      });
      
      resetForm();
      toast.success("Department updated successfully! ✔️");
    } catch (err) {
      toast.error("Failed to update department. Please try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setLimit("");
    setEditingId(null);
    setShowFormModal(false);
  };

  const handleDeleteDepartment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "departments", id));
        toast.success("Department deleted successfully! 🗑️");
      } catch (error) {
        toast.error("Failed to delete department. Please try again.");
      }
    }
  };

  const handleEditDepartment = (department) => {
    setEditingId(department.id);
    setName(department.name);
    setLimit(department.limit || "");
    setShowFormModal(true);
  };

  useEffect(() => {
    const filtered = departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [search, departments]);

  return (
    <div className="department-container">
      <h2 className="title">Department List</h2>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="add-button"
          onClick={() => setShowFormModal(true)}
          disabled={departments.length >= MAX_DEPARTMENTS}
        >
          Add Department
        </button>
      </div>

      <div className="department-count">
        <h3>Total Departments: {departments.length}/{MAX_DEPARTMENTS}</h3>
      </div>

      {showFormModal && (
        <div className="modal-background">
          <div className="modal-content">
            <h3>{editingId ? "Edit Department" : "Add New Department"}</h3>
            <input
              type="text"
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              maxLength={MAX_NAME_LENGTH}
            />
            <input
              type="number"
              placeholder="Employee Limit (optional)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="0"
              className="input-field"
            />
            <div className="modal-actions">
              <button className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={editingId ? handleUpdateDepartment : handleAddDepartment}
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-container">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="department-card">
            <div className="card-header">
              <h3>{department.name}</h3>
              <div className="card-actions">
                <button onClick={() => handleEditDepartment(department)} className="edit-button">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => handleDeleteDepartment(department.id)} className="delete-button">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="employee-count">
                Employees: {employeeCounts[department.name] || 0}
                {department.limit && ` / ${department.limit}`}
              </p>
              {department.limit && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        ((employeeCounts[department.name] || 0) / department.limit) * 100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredDepartments.length === 0 && <p className="no-results">No departments found</p>}
      </div>

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
      />
    </div>
  );
};

export default DepartmentPage;