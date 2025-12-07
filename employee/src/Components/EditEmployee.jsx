import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import axios from 'axios';
import { API_URL } from '../config';

const EditEmployee = () => {
  const { id } = useParams();  // used to take id from URL
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    category_id: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate(); 

  // Fetch categories and employee data
  useEffect(() => {
    axios.get(`${API_URL}/auth/category`)
    // axios.get(`http://localhost:4000/auth/category`)
      .then(result => {
        if (result.data.Status) {
          setCategory(result.data.Result);  
        } else {
          alert("Error fetching categories");
        }
      })
      .catch(err => {
        alert("Error fetching categories");
        console.log(err);
      });

    axios.get(`${API_URL}/auth/employee/ ${id}`)
    // axios.get(`http://localhost:4000/auth/employee/ ${id}`)
      .then(result => {
        if (result.data.Status) {
          const employeeData = result.data.Result && result.data.Result[0];
          if (employeeData) {
            setEmployee({
              ...employee,
              name: employeeData.name,
              email: employeeData.email,
              address: employeeData.address,
              salary: employeeData.salary,
              category_id: employeeData.category_id,  
            });
          } else {
            alert("Employee not found");
          }
        } else {
          alert("Error fetching employee data");
        }
      })
      .catch(err => {
        alert("Error fetching employee data");
        console.log(err);
      });
  }, []);                        // put id

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/auth/edit-employee/` + id, employee)
    // axios.put(`http://localhost:4000/auth/edit-employee/` + id, employee)
      .then(result => {  
        // console.log(result);  
        if (result.data.Status) {
          navigate('/dashboard/employee');  
        } else {
          alert(result.data.Error || "Error updating employee");
        }
      })
      .catch(err => {
        alert("Error updating employee data");
        console.error("PUT request failed:", err);  
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded  w-sm-75 w-md-50 w-lg-25 border">
        <h2>Edit Employee</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              className="form-control rounded-0"
              type="text"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="col-12">
            <label className="form-label" htmlFor="inputEmail">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          {/* Salary */}
          <div className="col-12">
            <label className="form-label" htmlFor="inputSalary">Salary</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter salary"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="col-12">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id || ""}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
            >
              <option value="">Select a Category</option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="col-12">
            <label className="form-label" htmlFor="inputAddress">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Enter address"
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Edit Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
