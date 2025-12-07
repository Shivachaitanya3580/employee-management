import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    image: "",
    category_id: "",
  });

  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/category`)
      // .get(`http://localhost:4000/auth/category`)
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
          console.error(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        alert("Failed to load categories. Please try again.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);

    axios
      .post(`${API_URL}/auth/add-employee`, formData)
      // .post(`http://localhost:4000/auth/add-employee`, formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          const errorMsg = typeof result.data.Error === "object"
            ? Object.values(result.data.Error).flat().join("\n")
            : result.data.Error;
          alert(errorMsg);
        }
      })
      .catch((err) => {
        console.error("Error adding employee:", err);
        const errorMessage = err.response?.data?.Error || "An unexpected error occurred.";
        alert(errorMessage);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded border w-100 w-sm-75 w-md-50 w-lg-40">
        <h2 className="text-center">Add Employee</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              id="inputName"
              className="form-control rounded-0"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              id="inputEmail"
              className="form-control rounded-0"
              placeholder="Enter Email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="col-12">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input
              type="password"
              id="inputPassword"
              className="form-control rounded-0"
              placeholder="Enter Password"
              value={employee.password}
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>

          {/* Salary */}
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">Salary</label>
            <input
              type="text"
              id="inputSalary"
              className="form-control rounded-0"
              placeholder="Enter Salary"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="col-12">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
            >
              <option value="">Select a Category</option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <input
              type="text"
              id="inputAddress"
              className="form-control rounded-0"
              placeholder="Enter Address"
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          {/* Image */}
          <div className="col-12 mb-3">
            <label htmlFor="inputImage" className="form-label">Select Image</label>
            <input
              type="file"
              id="inputImage"
              className="form-control rounded-0"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
