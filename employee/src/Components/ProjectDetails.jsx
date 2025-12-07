import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../config.jsx";
import FadeContent from "../Components/Animations/Animation.jsx";
import "./ProjectDetails.css"; 

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [comment, setComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/projects/${id}`)
      // .get(`http://localhost:4000/api/projects/${id}`)
      .then((result) => setProject({ ...result.data, comments: result.data.comments || [] }))
    //   .catch(() => toast.error("Error fetching project details."));
  }, [id]);

  const handleStatusChange = (status) => {
    axios
      .put(`${API_URL}/api/projects/${id}/status`, { status })
      // .put(`http://localhost:4000/api/projects/${id}/status`, { status })
      .then(() => {
        toast.success("Status updated!");
        setProject((prev) => ({ ...prev, status }));
      })
      .catch(() => toast.error("Error updating status."));
  };

  const handleAddComment = () => {
    if (!comment.trim()) return toast.error("Comment cannot be empty.");

    axios
      .put(`${API_URL}/api/projects/${id}/comment`, { comment })
      // .put(`http://localhost:4000/api/projects/${id}/comment`, { comment })
      .then(() => {
        toast.success("Comment added!");
        setProject((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), comment],
        }));
        setComment("");
      })
      .catch(() => toast.error("Error adding comment."));
  };

  const handleEditComment = (index) => {
    setEditingIndex(index);
    setEditText(project.comments[index]);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return toast.error("Comment cannot be empty.");

    const updatedComments = [...project.comments];
    updatedComments[editingIndex] = editText;

    axios
      .put(`${API_URL}/api/projects/${id}/update-comment`, { comment: editText, index: editingIndex })
      // .put(`http://localhost:4000/api/projects/${id}/update-comment`, { comment: editText, index: editingIndex })
      .then(() => {
        toast.success("Comment updated!");
        setProject((prev) => ({ ...prev, comments: updatedComments }));
        setEditingIndex(null);
      })
      .catch(() => toast.error("Error updating comment."));
  };

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

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'status-active';
    }
  };

  return (
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
      <div className="project-details-container">
        <div className="project-details-card">
          <h2 className="project-title">Project: {project.name}</h2>
          
          <div className="project-status-section">
            <div className="project-status-label">Status:</div>
            <span className={`status-badge ${getStatusClass(project.status)}`}>
              {project.status}
            </span>
          </div>

          {/* Status Change Buttons */}
          <div className="status-buttons">
            <button className="status-btn btn-pending" onClick={() => handleStatusChange("Pending")}>
              Mark Pending
            </button>
            <button className="status-btn btn-completed" onClick={() => handleStatusChange("Completed")}>
              Mark Completed
            </button>
          </div>

          {/* Comments Section */}
          <h3 className="comments-section-header">Comments</h3>
          
          <div className="comment-input-section">
            <textarea
              className="comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows="4"
            />
            <button className="add-comment-btn" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>

          <div className="comments-list">
            {project.comments?.length > 0 ? (
              project.comments.map((cmt, index) => (
                <div key={index} className="comment-item" style={{animationDelay: `${index * 0.1}s`}}>
                  {editingIndex === index ? (
                    <div className="edit-comment-section">
                      <textarea
                        className="edit-textarea"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="3"
                      />
                      <div className="edit-actions">
                        <button className="save-edit-btn" onClick={handleSaveEdit}>
                          Save
                        </button>
                        <button
                          className="cancel-edit-btn"
                          onClick={() => setEditingIndex(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-content">
                      <span className="comment-text">{cmt}</span>
                      <button className="edit-comment-btn" onClick={() => handleEditComment(index)}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-comments">No comments yet.</div>
            )}
          </div>

          {/* Back and Logout Buttons */}
          <div className="action-buttons">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <span>←</span>
              <span>Back</span>
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              <span>⏻</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </FadeContent>
  );
};

export default ProjectDetails;