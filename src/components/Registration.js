import React, { useState } from "react";
import axios from '../axiosConfig'; 
import { useNavigate } from "react-router-dom";
import "./Form.css";
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

const Registration = ({ Registration }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    isWhatsApp: false,
    newsletter: false,
    email: "",
    occupation: "",
    dateOfBirth: "",
    pincode: "",
    state: "",
    city: "",
  });

  const [haves, setHaves] = useState([{ category: "", description: "" }]);
  const [wishes, setWishes] = useState([
    { category: "", description: "", skills: [] },
  ]);

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };

  const handlePincodeChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (value.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        if (response.data[0].Status === "Success") {
          setUser((prevUser) => ({
            ...prevUser,
            state: response.data[0].PostOffice[0].State,
            city: response.data[0].PostOffice[0].District,
          }));
        } else {
          alert("Invalid pincode");
        }
      } catch (error) {
        console.error("Error fetching state and city:", error);
      }
    }
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

  const handleWishSkillsChange = (index, skillIndex, e) => {
    const { value } = e.target;
    const newWishes = [...wishes];
    newWishes[index].skills[skillIndex] = value;
    setWishes(newWishes);
  };

  const addHave = () => {
    setHaves([...haves, { category: "", description: "" }]);
  };

  const addWish = () => {
    setWishes([...wishes, { category: "", description: "", skills: [] }]);
  };

  const addWishSkill = (index) => {
    const newWishes = [...wishes];
    newWishes[index].skills.push("");
    setWishes(newWishes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredHaves = haves.filter(
      (have) => have.category && have.description
    );
    const filteredWishes = wishes.filter(
      (wish) => wish.category && wish.description
    );

    const dataToSubmit = {
      ...user,
      dateOfBirth: `${user.dateOfBirth}T00:00:00.000Z`, // append time to dateOfBirth
      haves: filteredHaves,
      wishes: filteredWishes,
    };

    try {
      const response = await axios.post("/users/", dataToSubmit);
      alert("User registered successfully!");
      const { token, user: registeredUser } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", registeredUser.id);
      sessionStorage.setItem("isLoggedIn", "true");
      window.location.reload();
      setTimeout(() => {
        navigate("/landing");
      }, 1000); // delay of 1 second
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="form-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </button>
      <div className="form-box">
        <h2 style={{ margin: "15px" }}>New to the Family?</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
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
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleUserChange}
                required
              />
            </div>
          </div>
          <div className="form-check-group">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isWhatsApp"
                name="isWhatsApp"
                checked={user.isWhatsApp}
                onChange={handleUserChange}
              />
              <label htmlFor="isWhatsApp" className="form-check-label">
                Is this a WhatsApp number?
              </label>
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
              <label htmlFor="newsletter" className="form-check-label">
                Sign up for our newsletter
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email (optional)
              </label>
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
              <label htmlFor="occupation" className="form-label">
                Occupation
              </label>
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
              <label htmlFor="pincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                className="form-control"
                id="pincode"
                name="pincode"
                value={user.pincode}
                onChange={handlePincodeChange}
                required
              />
              {user.state && user.city && (
                <small className="form-text text-muted">{`${user.city}, ${user.state}`}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={user.dateOfBirth}
                onChange={handleUserChange}
                required
              />
              <small className="form-text text-muted">
                Your password will be your date of birth in DDMMYYYY format
              </small>
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
                    <option key={i} value={sdg}>
                      {sdg}
                    </option>
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
          <button type="button" className="btn btn-secondary" onClick={addHave}>
            Add Another Abundance
          </button>
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
                    <option key={i} value={sdg}>
                      {sdg}
                    </option>
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
              <div className="form-group">
                <label className="form-label">Skills Required</label>
                {wish.skills.map((skill, skillIndex) => (
                  <input
                    key={skillIndex}
                    type="text"
                    className="form-control"
                    name="skills"
                    value={skill}
                    onChange={(e) =>
                      handleWishSkillsChange(index, skillIndex, e)
                    }
                    placeholder="Skill"
                  />
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addWishSkill(index)}
                >
                  Add Skill
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addWish}>
            Add Another Wish
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
