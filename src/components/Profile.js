import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CommonStyles.css";
import { FaMinus, FaPlus } from "react-icons/fa";

import "./Profile.css";

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

const Profile = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const userId = routeId || sessionStorage.getItem("userId");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    city: "",
    state: "",
    phoneNumber: "",
    dateOfBirth: "",
    haves: [],
    wishes: [],
  });

  const [newHave, setNewHave] = useState({ category: "", description: "" });
  const [newWish, setNewWish] = useState({
    category: "",
    description: "",
    skills: [],
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // redirect to login if userId is not available
      return;
    }

    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setUserData({
          ...user,
          haves: user.haves || [],
          wishes: user.wishes || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleAddHave = async () => {
    const token = sessionStorage.getItem("token");
    if (newHave.category && newHave.description) {
      try {
        const response = await axios.put(
          `http://localhost:8080/${userId}/haves`,
          newHave,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData((prevState) => ({
          ...prevState,
          haves: response.data.haves,
        }));
        setNewHave({ category: "", description: "" });
      } catch (error) {
        console.error("Error updating haves:", error);
      }
    }
  };

  const handleAddWish = async () => {
    const token = sessionStorage.getItem("token");
    if (newWish.category && newWish.description) {
      try {
        const response = await axios.put(
          `http://localhost:8080/${userId}/wishes`,
          newWish,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData((prevState) => ({
          ...prevState,
          wishes: response.data.wishes,
        }));
        setNewWish({ category: "", description: "", skills: [] });
      } catch (error) {
        console.error("Error updating wishes:", error);
      }
    }
  };

  const handleRemoveHave = async (haveId) => {
    try {
      setUserData((prevState) => ({
        ...prevState,
        haves: prevState.haves.filter((have) => have.id !== haveId),
      }));
    } catch (error) {
      console.error("Error removing have:", error);
    }
  };

  const handleRemoveWish = async (wishId) => {
    try {
      setUserData((prevState) => ({
        ...prevState,
        wishes: prevState.wishes.filter((wish) => wish.id !== wishId),
      }));
    } catch (error) {
      console.error("Error removing wish:", error);
    }
  };

  const handleSkillUpdate = async (wishId, skill, action) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:8080/${userId}/wishes/${wishId}/skills`,
        { skill, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prevState) => ({
        ...prevState,
        wishes: response.data.wishes,
      }));
    } catch (error) {
      console.error(`Error ${action} skill:`, error);
    }
  };

  const handleAddWishSkill = (wishIndex) => {
    const newWishes = [...userData.wishes];
    if (newWishes[wishIndex].newSkill) {
      const skill = newWishes[wishIndex].newSkill;
      newWishes[wishIndex].skills.push(skill);
      handleSkillUpdate(newWishes[wishIndex].id, skill, "add");
      newWishes[wishIndex].newSkill = "";
      setUserData({ ...userData, wishes: newWishes });
    }
  };

  const handleWishSkillChange = (wishIndex, e) => {
    const newWishes = [...userData.wishes];
    newWishes[wishIndex].newSkill = e.target.value;
    setUserData({ ...userData, wishes: newWishes });
  };

  const handleRemoveWishSkill = (wishIndex, skillIndex) => {
    const newWishes = [...userData.wishes];
    const skillToRemove = newWishes[wishIndex].skills[skillIndex];
    newWishes[wishIndex].skills.splice(skillIndex, 1);
    handleSkillUpdate(newWishes[wishIndex].id, skillToRemove, "remove");
    setUserData({ ...userData, wishes: newWishes });
  };

  return (
    <div className="common-container profile-page">
      <div className="profile-section">
        <h1>Your Profile</h1>
        <div className="user-details">
          <div className="user-detail-row">
            {userData.name && (
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
            )}
            {userData.email && (
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
            )}
          </div>
          <div className="user-detail-row">
            {userData.city && (
              <p>
                <strong>City:</strong> {userData.city}
              </p>
            )}
            {userData.state && (
              <p>
                <strong>State:</strong> {userData.state}
              </p>
            )}
          </div>
          <div className="user-detail-row">
            {userData.phoneNumber && (
              <p>
                <strong>Phone Number:</strong> {userData.phoneNumber}
              </p>
            )}
            {userData.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {formatDate(userData.dateOfBirth)}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="skills-section">
        <h2>Your Haves</h2>
        <div className="card-container">
          {userData.haves.map((have, index) => (
            <div key={index} className="card">
              <div className="card-content">
                <span>
                  <strong>{have.category}:</strong> {have.description}
                </span>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveHave(have.id)}
                >
                  <FaMinus />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="add-skill">
          <select
            value={newHave.category}
            onChange={(e) =>
              setNewHave({ ...newHave, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {sdgs.map((sdg, i) => (
              <option key={i} value={sdg}>
                {sdg}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newHave.description}
            onChange={(e) =>
              setNewHave({ ...newHave, description: e.target.value })
            }
            placeholder="Add a new have"
          />
          <button onClick={handleAddHave} className="btn btn-custom">
            Add
          </button>
        </div>
      </div>
      <div className="skills-section">
        <h2>Your Wishes</h2>
        <div className="card-container">
          {userData.wishes.map((wish, wishIndex) => (
            <div key={wishIndex} className="card">
              <div className="card-content">
                <span>
                  <strong>{wish.category}:</strong> {wish.description}
                </span>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveWish(wish.id)}
                >
                  <FaMinus />
                </button>
              </div>
              <div className="skills-required">
                {(wish.skills || []).map(
                  (
                    skill,
                    skillIndex // Ensure skills is treated as an array
                  ) => (
                    <div key={skillIndex} className="skill-item">
                      <span>{skill}</span>
                      <button
                        className="remove-button"
                        onClick={() =>
                          handleRemoveWishSkill(wishIndex, skillIndex)
                        }
                      >
                        <FaMinus />
                      </button>
                    </div>
                  )
                )}
                <div className="add-skill">
                  <input
                    type="text"
                    value={wish.newSkill || ""}
                    onChange={(e) => handleWishSkillChange(wishIndex, e)}
                    placeholder="New skill"
                  />
                  <button
                    className="btn btn-secondary mb-2"
                    onClick={() => handleAddWishSkill(wishIndex)}
                  >
                    <FaPlus /> Add Skill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="add-skill">
          <select
            value={newWish.category}
            onChange={(e) =>
              setNewWish({ ...newWish, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {sdgs.map((sdg, i) => (
              <option key={i} value={sdg}>
                {sdg}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newWish.description}
            onChange={(e) =>
              setNewWish({ ...newWish, description: e.target.value })
            }
            placeholder="Add a new wish"
          />
          <button onClick={handleAddWish} className="btn btn-custom">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
