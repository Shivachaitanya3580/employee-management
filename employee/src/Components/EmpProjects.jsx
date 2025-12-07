import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../config.jsx";
import FadeContent from "../Components/Animations/Animation.jsx";
import "./EmpProjects.css"; // Import the new CSS file

const EmpProjects = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/employee/${id}/projects`)
      // .get(`http://localhost:4000/api/employee/${id}/projects`)
      .then((result) => setProjects(result.data))
      .catch(() => toast.error("Error fetching projects."));
  }, [id]);

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-inactive';
    }
  };

  return (
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
      <div className="emp-projects-container">
        <header className="projects-header">
          <h2>Employee Projects</h2>
        </header>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={project.id} className="project-card" style={{animationDelay: `${index * 0.1}s`}}>
                <div
                  className="project-card-body"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <h4 className="project-title">{project.name}</h4>
                  <p className="project-info">
                    <strong>Status:</strong> 
                    <span className={`project-status ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </p>
                  <p className="project-info pending-indicator">
                    <strong>Pending:</strong> 
                    <span className={project.pending ? 'pending-yes' : 'pending-no'}>
                      {project.pending ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects">
              <p>No projects found.</p>
            </div>
          )}
        </div>
                
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </FadeContent>
  );
};

export default EmpProjects;