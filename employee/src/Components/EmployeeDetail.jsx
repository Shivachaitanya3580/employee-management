import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeeDetail.css";
import { API_URL } from "../config";
import FadeContent from "../Components/Animations/Animation.jsx";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Employee Details
  useEffect(() => {
    axios
      .get(`${API_URL}/employee/detail/${id}`)
      // .get(`http://localhost:4000/employee/detail/${id}`)
      .then((res) => {
        setEmployee(res.data[0]);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching employee details.");
        setLoading(false);
      });
  }, [id]);

  // Fetch Categories Only If Needed
  useEffect(() => {
    if (!employee?.category_id) return;

    axios
      .get(`${API_URL}/auth/category`)
      // .get(`http://localhost:4000/auth/category`)
      .then((res) => {
        if (res.data.Status) {
          setCategories(res.data.Result);
        } else {
          toast.error(res.data.Error);
        }
      })
      .catch(() => toast.error("Error fetching categories."));
  }, [employee?.category_id]);

  // Get Category Name
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Handle Logout
  const handleLogout = () => {
    axios
      .get(`${API_URL}/employee/logout`)
      // .get(`http://localhost:4000/employee/logout`)
      .then((res) => {
        if (res.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch(() => toast.error("Logout failed."));
  };

  // Get Greeting Message
  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Show Loading State
  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  return (
    <FadeContent
      blur={true}
      duration={1000}
      easing="ease-out"
      initialOpacity={0}
    >
      <div className="employee-detail-container">
        <main className="employee-detail-main">
          <header className="header">
            <h2>
              {getGreetingMessage()}, {employee?.name}
            </h2>
          </header>

          <div className="employee-detail-card">
            <div className="employee-photo">
              <img
                src={
                  employee?.image
                    ? `${API_URL}/Images/${employee.image}`
                    // ? `http://localhost:4000/Images/${employee.image}`
                    : "/placeholder.png"
                }
                alt={employee?.name || "Employee"}
              />
            </div>

            <div className="employee-info">
              <h3>Name: {employee?.name}</h3>
              <p>
                <strong>Email:</strong> {employee?.email}
              </p>
              <p>
                <strong>Salary:</strong> ₹{employee?.salary}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {getCategoryName(employee?.category_id)}
              </p>


              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={() => navigate(`/employee/${id}/projects`)}
                >
                  Go to Projects
                </button>

                <button
                  className="btn btn-danger px-4 py-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </FadeContent>
  );
};

export default EmployeeDetail;
