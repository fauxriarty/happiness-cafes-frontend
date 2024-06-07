import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import './AdminPortal.css';
import { FaArrowLeft } from 'react-icons/fa';  

const sdgs = [
  'Food & Nutrition',
  'Water & Sanitation',
  'Shelter & Housing',
  'Health & Well-being',
  'Primary Education',
  'Vocational Training',
  'Adult Education & Literacy',
  'Skill Development',
  'Employment & Job Creation',
  'Entrepreneurship & Business Development',
  'Energy',
  'Transportation',
  'Waste Management',
  'Gender Equality & Women\'s Empowerment',
  'Social Services',
  'Local & Regional Partnerships',
  'International Aid & Cooperation',
  'Knowledge Sharing Platforms',
  'Volunteer Networks'
];

const AdminPortal = () => {
  const navigate = useNavigate(); 

  const [query, setQuery] = useState({ category: '', location: '', description: '', adminLocation: '' });
  const [users, setUsers] = useState([]);

  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/admin/query', query);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="admin-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back
      </button>
      <h2>HC Admin Portal</h2>
      <form className="query-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="adminLocation">HC Location</label>
          <input
            type="text"
            id="adminLocation"
            name="adminLocation"
            value={query.adminLocation}
            onChange={handleQueryChange}
            required
          />
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
              <option key={i} value={sdg}>{sdg}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="location">User Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={query.location}
            onChange={handleQueryChange}
            required
          />
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
        <button type="submit" className="btn-submit">Submit Query</button>
      </form>
      <div className="user-list">
        <h3>Users in Selected Category</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phoneNumber}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Resource:</strong> {user.description}</p>
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
