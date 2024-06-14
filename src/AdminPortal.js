import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPortal.css";
import { FaArrowLeft } from "react-icons/fa";

const sdgs = [
  "Food & Nutrition",
  "Water & Sanitation",
  "Shelter & Housing",
  "Health & Well-being",
  "Primary Education",
  "Vocational Training",
  "Adult Education & Literacy",
  "Skill Development",
  "Employment & Job Creation",
  "Entrepreneurship & Business Development",
  "Energy",
  "Transportation",
  "Waste Management",
  "Gender Equality & Women's Empowerment",
  "Social Services",
  "Local & Regional Partnerships",
  "International Aid & Cooperation",
  "Knowledge Sharing Platforms",
  "Volunteer Networks",
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const AdminPortal = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState({
    category: "",
    state: "",
    description: "",
  });
  const [users, setUsers] = useState([]);

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };

  const fetchUsersByCategoryAndState = async (category, state, description) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/geminiQueryByCategoryAndState",
        { category, state, description }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsersByCategoryAndState(
      query.category,
      query.state,
      query.description
    );
  };

  return (
    <div className="admin-container">
      <button
        className="back-button"
        style={{ marginLeft: "18px" }}
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
      </button>
      <h2 style={{ marginTop: "18px" }}>HC Admin Portal</h2>
      <form className="query-form" onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label htmlFor="state">HC Location (State)</label>
          <select
            id="state"
            name="state"
            value={query.state}
            onChange={handleQueryChange}
            required
          >
            <option value="">Select State</option>
            {states.map((state, i) => (
              <option key={i} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={query.category}
            onChange={handleQueryChange}
            required
          >
            <option value="">Select Category</option>
            {sdgs.map((sdg, i) => (
              <option key={i} value={sdg}>
                {sdg}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={query.description}
            onChange={handleQueryChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">
          Submit Query
        </button>
      </form>
      <div className="user-list">
        <h3>Users in Selected Category</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
                <p>
                  <strong>City:</strong> {user.city}
                </p>
                <p>
                  <strong>State:</strong> {user.state}
                </p>
                <p>
                  <strong>Pincode:</strong> {user.pincode}
                </p>
                <p>
                  <strong>Reason:</strong> {user.reason}
                </p>
                {user.warning && (
                  <p style={{ color: "red" }}>
                    <strong>Warning:</strong> {user.warning}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
