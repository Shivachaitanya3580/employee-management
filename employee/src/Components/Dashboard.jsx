import React from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
      .get(`${API_URL}/auth/logout`)
      // .get(`http://localhost:4000/auth/logout`)
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((error) => console.error("Logout error:", error));
  };

  const sidebarLinks = [
    { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/dashboard/employee", icon: "bi-people", label: "Manage Employees" },
    { to: "/dashboard/profile", icon: "bi-person", label: "Profile" },
    { to: "/dashboard/category", icon: "bi-list", label: "Category" },
    { to: "/dashboard/projects", icon: "bi-folder", label: "Projects" },
    { to: "/dashboard/employeeworkdetails", icon: "bi-clipboard-data", label: "Employee Work Details" },
    // { to: "/dashboard/employeeOfTheMonth", icon: "bi-award", label: "Employee of the Month" },
  ];

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div
          className="col-auto bg-dark position-fixed top-0 bottom-0 start-0 min-vh-100 d-flex flex-column align-items-center align-items-md-start px-2 px-md-3"
          style={{ width: "70px", width: "220px" }}
        >
          {/* Logo */}
          <Link
            to="/dashboard"
            className="d-flex align-items-center mb-4 mt-3 text-white text-decoration-none w-100"
          >
            <span className="fs-5 fw-bold d-none d-md-inline">FLYING FOX LABS</span>
            <i className="bi bi-boxes fs-4 d-md-none"></i>
          </Link>

          {/* Nav Links */}
          <ul className="nav nav-pills flex-column mb-auto w-100">
            {sidebarLinks.map(({ to, icon, label }, idx) => (
              <li className="w-100 mb-2" key={idx}>
                <Link
                  to={to}
                  className="nav-link text-white d-flex align-items-center px-2 px-md-3"
                >
                  <i className={`bi ${icon} fs-5`}></i>
                  <span className="ms-2 d-none d-md-inline text-wrap" style={{ fontSize: "0.9rem" }}>
                    {label}
                  </span>
                </Link>
              </li>
            ))}

            {/* Logout */}
            <li className="w-100 mt-auto">
              <button
                className="nav-link text-white d-flex align-items-center px-2 px-md-3 btn btn-link w-100"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
                <span className="ms-2 d-none d-md-inline">Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div
          className="col p-0"
          style={{
            marginLeft: "70px",
            marginLeft: "220px",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <div className="p-3 shadow-sm d-flex justify-content-between align-items-center bg-white sticky-top">
            <h5 className="mb-0">Employee Management System</h5>
          </div>
          <div className="p-3 p-md-4">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Media Query Fix for Sidebar Width */}
      <style>{`
        @media (max-width: 767.98px) {
          .col-auto {
            width: 70px !important;
          }
          .col {
            margin-left: 70px !important;
          }
        }

        @media (min-width: 768px) {
          .col-auto {
            width: 220px !important;
          }
          .col {
            margin-left: 220px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
