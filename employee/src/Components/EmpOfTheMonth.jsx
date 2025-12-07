import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const EmployeeOfTheMonth = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchTopEmployee = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/emp/employee-of-the-month`);
        // const res = await axios.get(`http://localhost:4000/api/emp/employee-of-the-month`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Failed to fetch top employee", err);
      }
    };

    fetchTopEmployee();
  }, []);

  if (!employee) {
    return <p className="text-center">Loading Employee of the Month...</p>;
  }

  return (
    <div
      className="card shadow-lg text-center p-4 mx-auto mt-5"
      style={{ maxWidth: "500px", borderRadius: "16px" }}
    >
      <h2 className="fw-bold mb-3">🏆 Employee of the Month</h2>
      <img
        src={employee.image || "https://via.placeholder.com/120"}
        alt={employee.name}
        className="rounded-circle mb-3"
        style={{ width: "120px", height: "120px", objectFit: "cover" }}
      />
      <h4 className="fw-bold">{employee.name}</h4>
      <p className="text-muted">{employee.email}</p>
      <p><strong>Category:</strong> {employee.category}</p>
      <p><strong>Salary:</strong> ₹{employee.salary}</p>
      <p><strong>Projects Completed:</strong> {employee.completed_projects}</p>
    </div>
  );
};

export default EmployeeOfTheMonth;
