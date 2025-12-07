import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const AddCategory = () => {
  const [category, setCategory] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/auth/add-category`, { category })
      // .post(`http://localhost:4000/auth/add-category`, { category })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/category");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-3 rounded w-75 w-sm-50 w-md-25 border">
        <h2 className="text-center">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category">
              <strong>Category:</strong>
            </label>
            <input
              className="form-control rounded-0"
              type="text"
              name="Category"
              placeholder="Enter category"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">Add Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
