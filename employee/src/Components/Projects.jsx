import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Projects.css";
import { API_URL } from "../config.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    employee_id: "",
    status: "Pending",
    pending: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      // const response = await axios.get(`http://localhost:4000/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/projects`, newProject);
      // const response = await axios.post(`http://localhost:4000/api/projects`, newProject);
      if (response.data.success) {
        fetchProjects();
        setNewProject({ name: "", employee_id: "", status: "Pending", pending: true });
        setShowAddProject(false);
        toast.success("Project added successfully!");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project.");
    }
  };

  const todayDate = new Date().toLocaleDateString();

  const bgColors = ["#bbdefb", "#f8bbd0", "#ffe0b2", "#c8e6c9", "#d1c4e9"];


  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <h1 className="text-center fw-bold text-black mb-4">📁 Projects</h1>

      <div className="container">
        {selectedProject ? (
          <div
            className="card p-5 text-center shadow-lg fade-in"
            style={{
              maxWidth: "600px",
              width: "100%",
              borderRadius: "12px",
              color: "black",
              margin: "0 auto",
              backgroundColor: "white",
            }}
          >
            <h2 className="fw-bold">{selectedProject.name}</h2>
            <p>
              <i className="bi bi-calendar"></i> <strong>Started On:</strong> {todayDate}
            </p>
            <p className="fw-bold">Completion: {selectedProject.progress || 0}%</p>
            <div className="progress" style={{ height: "15px", borderRadius: "10px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{
                  width: `${Math.max(5, selectedProject.progress || 0)}%`,
                  backgroundColor: "mediumseagreen",
                  borderRadius: "10px",
                }}
              ></div>
            </div>
            <button
              className="btn mt-4 fade-in"
              style={{
                backgroundColor: "dodgerblue",
                color: "white",
                fontWeight: "600",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
              }}
              onClick={() => setSelectedProject(null)}
            >
              <i className="bi bi-arrow-left"></i> Back to Projects
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4 justify-content-center fade-in">
              {projects.map((project, index) => {
                const isSelected = selectedProject?.id === project.id;
                const backgroundColor = isSelected ? "white" : bgColors[index % bgColors.length];
                const textColor = isSelected ? "black" : "darkslategray";

                return (
                  <div key={project.id} className="col-12 col-sm-10 col-md-6 col-lg-4 d-flex">
                    <div
                      className={`card flex-fill text-center project-card ${
                        isSelected ? "selected animate-pop" : "animate-default"
                      }`}
                      style={{
                        cursor: "pointer",
                        padding: "1.5rem",
                        borderRadius: "16px",
                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                        backgroundColor,
                        boxShadow: isSelected
                          ? "0 6px 30px rgba(0, 0, 0, 0.2)"
                          : "0 4px 12px rgba(0, 0, 0, 0.08)",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        color: textColor,
                      }}
                      onClick={() => setSelectedProject(project)}
                    >
                      <h4 className="fw-bold" style={{ color: textColor }}>
                        {project.name}
                      </h4>
                      <p className="mt-2 fw-semibold" style={{ color: textColor }}>
                        Completed: {project.progress || 0}%
                      </p>

                      <div
                        className="progress mx-auto"
                        style={{
                          height: "10px",
                          borderRadius: "10px",
                          backgroundColor: "lightgray",
                          width: "90%",
                        }}
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{
                            width: `${Math.max(5, project.progress || 0)}%`,
                            backgroundColor: "dodgerblue",
                            borderRadius: "10px",
                          }}
                        ></div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 fade-in-quote">
                          <blockquote
                            className="fst-italic"
                            style={{
                              fontSize: "0.95rem",
                              color: "black",
                            }}
                          >
                            "{project.quote || 'Every great project starts with a vision.'}"
                          </blockquote>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAddProject && (
              <div className="text-center mt-4">
                <button className="btn btn-success" onClick={() => setShowAddProject(true)}>
                  <i className="bi bi-plus-lg"></i> Add Project
                </button>
              </div>
            )}

            {showAddProject && (
              <div
                className="card p-4 mt-5 shadow-lg fade-in"
                style={{ maxWidth: "600px", margin: "0 auto", borderRadius: "12px" }}
              >
                <h3 className="fw-bold text-center">Add New Project</h3>
                <form onSubmit={handleAddProject}>
                  <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={newProject.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="number"
                      name="employee_id"
                      className="form-control"
                      value={newProject.employee_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-control"
                      value={newProject.status}
                      onChange={handleInputChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      Add Project
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddProject(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
