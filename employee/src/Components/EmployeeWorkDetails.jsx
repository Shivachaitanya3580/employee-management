import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config"
import { toast } from "react-toastify";
import { FaBriefcase } from "react-icons/fa"; 

const EmployeeWorkDetails = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/employees/work-details`)
    // axios.get(`http://localhost:4000/api/employees/work-details`)
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Error fetching employee work details."));
  }, []);

  return (
    <div className="container">
    <h2 className="text-center my-4">Employee Work Details</h2>
    {employees.length > 0 ? (
      employees.map((emp) => (
        <div key={emp.id} className="card p-3 mb-3 shadow-sm">
          <h4 className="text-primary">
            <FaBriefcase className="me-2 text-secondary" /> 
            {emp.name}
          </h4>
          <p>Email: {emp.email}</p>
          <h5>Projects:</h5>
          {emp.projects.length > 0 ? (
            emp.projects.map((proj) => (
              <div key={proj.id} className="p-2 border rounded bg-light mb-2">
                <p><strong>Project:</strong> {proj.name}</p>
                <p><strong>Status:</strong> {proj.status}</p>
                <p><strong>Pending:</strong> {proj.pending ? "Yes" : "No"}</p>
                <p><strong>Comments:</strong> {proj.comments || "No comments"}</p>
              </div>
            ))
          ) : (
            <p>No projects assigned.</p>
          )}
        </div>
      ))
    ) : (
      <p className="text-muted text-center">No employee work details found.</p>
    )}
  </div>
  );
};

export default EmployeeWorkDetails;
