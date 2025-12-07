import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/category`)
      // .get(`http://localhost:4000/auth/category`)
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/employee`)
      // .get(`http://localhost:4000/auth/employee`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/auth/delete_employee/${id}`)
      // .delete(`http://localhost:4000/auth/delete_employee/${id}`)
      .then((res) => {
        if (res.data.Status) {
          window.location.reload();
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container px-3 mt-3">
      <div className="d-flex justify-content-center mb-3">
        <h3>Employee List</h3>
      </div>

      {/* Add Employee button - Adjusted for small screens */}
      <div className="d-flex justify-content-end d-none d-md-flex mb-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>
      <div className="d-flex justify-content-center d-md-none mb-4">
        <Link to="/dashboard/add_employee" className="btn btn-success w-100">
          Add Employee
        </Link>
      </div>

      {/* TABLE FOR LARGE SCREENS */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Category</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e, index) => (
              <tr key={index}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`${API_URL}/Images/${e.image}`}
                    className="employee_image"
                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                    alt="employee"
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{getCategoryName(e.category_id)}</td>
                <td>{e.salary}</td>
                <td>
                  <div className="d-flex">
                    <Link
                      to={`/dashboard/edit-employee/${e.id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD LAYOUT FOR SMALL SCREENS */}
      <div className="row d-block d-md-none g-3">
        {employee.map((e, index) => (
          <div key={index} className="col-12">
            <div className="card p-3 shadow-sm w-100">
              <div className="d-flex align-items-center">
                <img
                  src={`${API_URL}/Images/${e.image}`}
                  className="rounded-circle"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    minWidth: "70px",
                  }}
                  alt="employee"
                />
                <div className="ms-3 w-100">
                  <h5 className="mb-0 fw-bold text-break">{e.name}</h5>
                  <small className="text-muted d-block text-break">{e.email}</small>
                </div>
              </div>
              <div className="mt-2">
                <p className="mb-1"><strong>Address:</strong> {e.address}</p>
                <p className="mb-1"><strong>Category:</strong> {getCategoryName(e.category_id)}</p>
                <p className="mb-1"><strong>Salary:</strong>₹{e.salary}</p>
              </div>
              <div className="d-flex gap-2 mt-2">
                <Link to={`/dashboard/edit-employee/${e.id}`} className="btn btn-info btn-sm w-50 text-truncate">
                  <i className="fas fa-edit"></i> Edit
                </Link>
                <button className="btn btn-warning btn-sm w-50 text-truncate" onClick={() => handleDelete(e.id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Employee;
