import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    
    axios
      .post(`${API_URL}/employee/employee_login`, values)
      // .post(`http://localhost:4000/employee/employee_login`, values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem('valid', true);
          navigate('/employee_detail/' + result.data.id);
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isGuest) {
      handleSubmit();
      setIsGuest(false); // Reset the guest flag
    }
  }, [values]);

  const handleGuestLogin = () => {
    localStorage.setItem('valid', true);
    setError(null);
    setValues({ email: 'jay@gmail.com', password: '123456' });
    setIsGuest(true); // Trigger the useEffect for submission
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded border w-sm-75 w-md-50 w-lg-25 loginForm">
        <div className="text-warning">
          {error && <div>{error}</div>}
        </div>
        <h2 className="text-center">Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email :</strong></label>
            <input
              className="form-control rounded-0"
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password :</strong></label>
            <input
              className="form-control rounded-0"
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </div>
          <button className="btn btn-success w-100 w-lg-50 rounded-0 mb-2">LOGIN</button>
          <div className="mb-1">
            <input type="checkbox" id="checkbox" className="me-2" />
            <label htmlFor="checkbox">Agree to Terms & Conditions</label>
          </div>
        </form>

        <button
          className="btn btn-primary w-100 rounded-0 mt-3"
          onClick={handleGuestLogin}
        >
          Login as Guest Employee
        </button>
      </div>
    </div>
  );
};

export default EmployeeLogin;
