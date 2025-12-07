import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Start = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/verify`)
      // .get(`http://localhost:4000/verify`)
      .then((result) => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/employee_detail/" + result.data.id);
          }
        } else {
          navigate("/");
        }
      });
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded border loginForm w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login As</h2>
        <div className="d-grid gap-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/employee_login")}
          >
            Employee
          </button>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => navigate("/adminlogin")}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
