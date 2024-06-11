import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { FaArrowLeft } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
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
      const { token, userId } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      onLogin(userId);
      navigate("/landing");
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed!");
    }
  };

  return (
    <div className="form-container">
      <button
        className="back-button"
        style={{ marginTop: "145px", marginLeft: "-905px" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
      </button>
      <div className="form-box">
        <h2 style={{ margin: "15px" }}>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3" style={{ margin: "15px" }}>
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={credentials.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3" style={{ margin: "15px" }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <small className="form-text text-muted">
              Your password is your date of birth in DDMMYYYY format
            </small>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginBottom: "15px" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
