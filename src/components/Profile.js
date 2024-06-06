import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CommonStyles.css';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    tasks: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setSkills(response.data.skills || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleAddSkill = async () => {
    const token = sessionStorage.getItem("token");
    if (newSkill) {
      try {
        const updatedSkills = [...skills, newSkill];
        await axios.put(`http://localhost:8080/users/${id}`, { skills: updatedSkills }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSkills(updatedSkills);
        setNewSkill('');
      } catch (error) {
        console.error('Error updating skills:', error);
      }
    }
  };

  return (
    <div className="common-container profile-page">
      <div className="profile-section">
        <h1>Your Profile</h1>
        <div className="user-details">
          <div className="user-detail-row">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
          <div className="user-detail-row">
            <p><strong>Address:</strong> {userData.address}</p>
            <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
          </div>
          <div className="user-detail-row">
            <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
          </div>
        </div>
      </div>
      <div className="skills-section">
        <h2>Your Skills</h2>
        <div className="skills-list">
          {skills.map((skill, index) => (
            <span key={index} className="skill-item">• {skill}</span>
          ))}
        </div>
        <div className="add-skill">
          <input 
            type="text" 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            placeholder="Add a new skill" 
          />
          <button onClick={handleAddSkill} className="btn btn-custom">Add Skill</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
