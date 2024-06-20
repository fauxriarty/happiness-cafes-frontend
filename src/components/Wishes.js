import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Wishes.css";
import ReactPaginate from 'react-paginate';
import ClipLoader from "react-spinners/ClipLoader";

const Wishes = () => {
  const [wishes, setWishes] = useState([]);
  const [userHaves, setUserHaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const wishesPerPage = 4;

  useEffect(() => {
    fetchUserHaves();
    fetchWishes();
  }, []);

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
      setLoading(false); // set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching user haves:", error);
      setLoading(false); //set loading to false on error
    }
  };

  const fetchWishes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/wishes");
      setWishes(response.data);
      setLoading(false); //set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching wishes:", error);
      setLoading(false); // loading to false on error
    }
  };

  const matchesUserSkills = (wish) => {
    return wish.skills.some((skill) =>
      userHaves.some((have) => have.description.toLowerCase().includes(skill.toLowerCase()))
    );
  };

  const renderWishes = () => {
    const matchedWishes = wishes.filter(matchesUserSkills);
    const displayedWishes = matchedWishes.length === 0 ? wishes : matchedWishes;
    const offset = currentPage * wishesPerPage;
    const currentWishes = displayedWishes.slice(offset, offset + wishesPerPage);

    return (
      <>
        {currentWishes.map((wish) => (
          <div key={wish.id} className="wish-card">
            <h3>{wish.category}</h3>
            <p>{wish.description}</p>
            <p><strong>Skills Required:</strong> {wish.skills.join(", ")}</p>
            {wish.user && (
              <>
                <p><strong>Posted by:</strong> {wish.user.name}</p>
                <p><strong>Contact:</strong> {wish.user.phoneNumber}</p>
              </>
            )}
          </div>
        ))}
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(displayedWishes.length / wishesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </>
    );
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="wishes-container">
      {loading ? (
        <div className="loader-container">
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      ) : (
        <>
          <h1>Wishes</h1>
          {renderWishes()}
        </>
      )}
    </div>
  );
};

export default Wishes;
