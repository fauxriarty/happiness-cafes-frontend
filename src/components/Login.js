import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Form.css';
import { FaArrowLeft } from 'react-icons/fa'; 

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        credentials
      );
      alert("Login successful!");
      onLogin();
      console.log(response.data);
      navigate("/");
      sessionStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed!");
    }
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft />
      </button>
      <div className="form-box">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
