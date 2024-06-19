import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CommonStyles.css";

const Wishes = () => {
  const [wishes, setWishes] = useState([]);
  const [userHaves, setUserHaves] = useState([]);

  useEffect(() => {
    const fetchUserHaves = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (!userId || !token) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserHaves(response.data.haves || []);
      } catch (error) {
        console.error("Error fetching user haves:", error);
      }
    };

    const fetchWishes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/wishes");
        setWishes(response.data);
      } catch (error) {
        console.error("Error fetching wishes:", error);
      }
    };

    fetchUserHaves();
    fetchWishes();
  }, []);

  const matchesUserSkills = (wish) => {
    return wish.skills.some((skill) =>
      userHaves.some((have) => have.description.toLowerCase().includes(skill.toLowerCase()))
    );
  };

  const matchedWishes = wishes.filter(matchesUserSkills);

  return (
    <div className="wishes-container">
      <h1>Wishes</h1>
      {matchedWishes.length > 0 ? (
        matchedWishes.map((wish) => (
          <div key={wish.id} className="wish-item">
            <h3>{wish.category}</h3>
            <p>{wish.description}</p>
            <p><strong>Skills Required:</strong> {wish.skills.join(", ")}</p>
          </div>
        ))
      ) : (
        <p>No matching wishes found.</p>
      )}
    </div>
  );
};

export default Wishes;
