import React, { useState, useEffect, useCallback } from "react";
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

  const fetchUserHaves = useCallback(async () => {
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user haves:", error);
      setLoading(false);
    }
  }, []);

  const fetchWishes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/wishes");
      setWishes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishes:", error);
      setLoading(false);
    }
  }, []);

  const fetchRelevantWishes = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/wishes/relevant`, {
        userId,
        userHaves
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length === 0) {
        fetchWishes(); // Fetch all wishes if no relevant wishes found
      } else {
        setWishes(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching relevant wishes:", error);
      setLoading(false);
    }
  }, [userHaves, fetchWishes]);

  useEffect(() => {
    fetchUserHaves();
  }, [fetchUserHaves]);

  useEffect(() => {
    if (userHaves.length > 0) {
      fetchRelevantWishes();
    } else {
      fetchWishes();
    }
  }, [userHaves, fetchRelevantWishes, fetchWishes]);

  const renderWishes = () => {
    const offset = currentPage * wishesPerPage;
    const currentWishes = wishes.slice(offset, offset + wishesPerPage);

    return (
      <>
        {currentWishes.map((wish) => (
          <div key={wish.id} className="wish-card">
            <h3>{wish.title}</h3> {/* Adjust to display title */}
            <p>{wish.description}</p>
            <p><strong>Skills Required:</strong> {wish.skills ? wish.skills.join(", ") : "Not specified"}</p>
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
          pageCount={Math.ceil(wishes.length / wishesPerPage)}
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
          {wishes.length === 0 ? (
            <p>No relevant wishes found. Showing all wishes:</p>
          ) : (
            renderWishes()
          )}
        </>
      )}
    </div>
  );
};

export default Wishes;
