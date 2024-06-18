import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CommonStyles.css";
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
  const [newWish, setNewWish] = useState({ category: "", description: "" });

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
          `http://localhost:8080/users/${userId}/haves`,
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
          `http://localhost:8080/users/${userId}/wishes`,
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
        setNewWish({ category: "", description: "" });
      } catch (error) {
        console.error("Error updating wishes:", error);
      }
    }
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
                <strong>Date of Birth:</strong> {formatDate(userData.dateOfBirth)}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="skills-section">
        <h2 style={{ color: "white" }}>Your Haves</h2>
        <div className="skills-list">
          {userData.haves.map((have, index) => (
            <span key={index} className="skill-item">
              • {have.category}: {have.description}
            </span>
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
        <h2 style={{ color: "white" }}>Your Wishes</h2>
        <div className="skills-list">
          {userData.wishes.map((wish, index) => (
            <span key={index} className="skill-item">
              • {wish.category}: {wish.description}
            </span>
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