import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';
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


const Registration = ({ onRegister }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    isWhatsApp: false,
    newsletter: false,
    email: '',
    occupation: '',
    dateOfBirth: '',
    address: ''
  });

  const [haves, setHaves] = useState([{ category: '', description: '' }]);
  const [wishes, setWishes] = useState([{ category: '', description: '' }]);

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleHavesChange = (index, e) => {
    const { name, value } = e.target;
    const newHaves = [...haves];
    newHaves[index][name] = value;
    setHaves(newHaves);
  };

  const handleWishesChange = (index, e) => {
    const { name, value } = e.target;
    const newWishes = [...wishes];
    newWishes[index][name] = value;
    setWishes(newWishes);
  };

  const addHave = () => {
    setHaves([...haves, { category: '', description: '' }]);
  };

  const addWish = () => {
    setWishes([...wishes, { category: '', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users', { ...user, haves, wishes });
      alert('User registered successfully!');
      onRegister();
      console.log(response.data);
      navigate('/landing');
      sessionStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed!');
    }
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft />
      </button>
      <div className="form-box">
        <h2>New to the Family?</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={user.name}
                onChange={handleUserChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleUserChange}
                required
              />
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isWhatsApp"
                  name="isWhatsApp"
                  checked={user.isWhatsApp}
                  onChange={handleUserChange}
                />
                <label htmlFor="isWhatsApp" className="form-check-label">Is this a WhatsApp number?</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="newsletter"
                  name="newsletter"
                  checked={user.newsletter}
                  onChange={handleUserChange}
                />
                <label htmlFor="newsletter" className="form-check-label">Sign up for our newsletter</label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email (optional)</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={user.email}
                onChange={handleUserChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="occupation" className="form-label">Occupation</label>
              <input
                type="text"
                className="form-control"
                id="occupation"
                name="occupation"
                value={user.occupation}
                onChange={handleUserChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={user.address}
                onChange={handleUserChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={user.dateOfBirth}
                onChange={handleUserChange}
                required
              />
              <small className="form-text text-muted">Your password will be your date of birth in DDMMYYYY format</small>
            </div>
          </div>
          <h3>Your Haves (Abundances)</h3>
          {haves.map((have, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={have.category}
                  onChange={(e) => handleHavesChange(index, e)}
                >
                  <option value="">Select Category</option>
                  {sdgs.map((sdg, i) => (
                    <option key={i} value={sdg}>{sdg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={have.description}
                  onChange={(e) => handleHavesChange(index, e)}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addHave}>Add Another Abundance</button>
          <h3>Your Wishes</h3>
          {wishes.map((wish, index) => (
            <div key={index} className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={wish.category}
                  onChange={(e) => handleWishesChange(index, e)}
                >
                  <option value="">Select Category</option>
                  {sdgs.map((sdg, i) => (
                    <option key={i} value={sdg}>{sdg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={wish.description}
                  onChange={(e) => handleWishesChange(index, e)}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addWish}>Add Another Wish</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
