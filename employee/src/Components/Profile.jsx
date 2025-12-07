
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import { API_URL } from '../config';
import { useCookies } from "react-cookie";

const Profile = () => {
  const [cookies] = useCookies(["token"]);

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: '',
    lastLogin: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const result = await axios.get(`${API_URL}/auth/verify`, {
        // const result = await axios.get(`http://localhost:4000/auth/verify`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`
          }
        });

        console.log("API Response:", result.data);

        if (result.data.Status && result.data.role === "admin") {
          setAdminData({
            name: result.data.name,
            email: result.data.email,
            role: result.data.role,
            lastLogin: result.data.lastLogin,
          });
        } else {
          // toast.error('You must be logged in as admin to view this page.');
          // navigate('/adminlogin');
        }
      } catch (error) {
        // toast.error('Failed to fetch admin details. Please try again.');
        if (error.response && error.response.status === 401) {
          // navigate('/adminlogin');
        }
      }
    };

    fetchAdminData();
  }, [cookies.token, navigate]);

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <Card.Body>
          <h2 className="profile-title">Admin Profile</h2>
          <div className="profile-details">
            <div className="profile-detail">
              <h5>Name: {adminData.name || 'admin'}</h5>
            </div>
            <div className="profile-detail">
              <h5>Email: {adminData.email || 'admin@gmail.com'}</h5>
            </div>
            <div className="profile-detail">
              <h5>Role: {adminData.role || 'admin'}</h5>
            </div>
            <div className="profile-detail">
              <h5>
                Last Login: {adminData.lastLogin
                  ? new Date(adminData.lastLogin).toLocaleString()
                  : 'Recently'}
              </h5>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
