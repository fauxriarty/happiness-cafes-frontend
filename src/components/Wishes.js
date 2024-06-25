import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import "./Wishes.css";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Wishes = () => {
  const [wishes, setWishes] = useState([]);
  const [userHaves, setUserHaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState(null);
  const wishesPerPage = 4;

  const fetchUserHaves = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      const response = await axios.get(`/${userId}`, {
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
      console.log("Fetching all wishes...");
      const response = await axios.get("/wishes");
      console.log("Fetched wishes:", response.data);
      setWishes(response.data);
      setFilteredWishes(response.data);
    } catch (error) {
      console.error("Error fetching wishes:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes(); 
  }, [fetchWishes]);

  const fetchRelevantWishes = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      setSearching(true);
      const response = await axios.post(
        `/wishes/relevant`,
        {
          userId,
          userHaves,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearching(false);
      if (response.data.length === 0) {
        fetchWishes();
      } else {
        setWishes(response.data);
        setFilteredWishes(response.data);
        sessionStorage.setItem("relevantWishes", JSON.stringify(response.data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching relevant wishes:", error);
      setSearching(false);
      setLoading(false);
    }
  }, [userHaves, fetchWishes]);

  useEffect(() => {
    fetchUserHaves();
  }, [fetchUserHaves]);

  useEffect(() => {
    const storedWishes = sessionStorage.getItem("relevantWishes");
    if (storedWishes) {
      setWishes(JSON.parse(storedWishes));
      setFilteredWishes(JSON.parse(storedWishes));
      setLoading(false);
    } else {
      fetchWishes();
    }
  }, [fetchWishes]);

  useEffect(() => {
    if (userHaves.length > 0) {
      fetchRelevantWishes();
    }
  }, [userHaves, fetchRelevantWishes]);

  useEffect(() => {
    const results = wishes.filter(
      (wish) =>
        wish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wish.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wish.skills &&
          wish.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        (wish.user &&
          wish.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredWishes(results);
  }, [searchTerm, wishes]);

  const handleRequestJoin = async (wishId) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        `/wishes/request/${wishId}`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Request sent successfully");
    } catch (error) {
      console.error("Error requesting to join:", error);
      alert("Failed to send request");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleShowRelevant = () => {
    sessionStorage.removeItem("relevantWishes");
    setLoading(true);
    fetchUserHaves();
  };

  const handleShowAll = async () => {
    console.log("Fetching all wishes...");
    sessionStorage.removeItem("relevantWishes");
    setLoading(true);
    await fetchWishes();
  };

  const openModal = (wish) => {
    setSelectedWish(wish);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedWish(null);
  };

  const renderWishes = () => {
    const offset = currentPage * wishesPerPage;
    const currentWishes = filteredWishes.slice(offset, offset + wishesPerPage);

    return (
      <>
        {currentWishes.map((wish) => (
          <div
            key={wish.id}
            className="wish-card"
            onClick={() => openModal(wish)}
          >
            <h3>{wish.category}</h3>
            <p>{wish.description}</p>
            <p>
              <strong>Skills Required:</strong>{" "}
              {wish.skills ? wish.skills.join(", ") : "Not specified"}
            </p>
            {wish.user && (
              <>
                <p>
                  <strong>Posted by:</strong> {wish.user.name}
                </p>
                <p>
                  <strong>Contact:</strong> {wish.user.phoneNumber}
                </p>
              </>
            )}
            <p>
              <strong>Participants:</strong>{" "}
              {wish.participants ? wish.participants.length : 0}
            </p>
            <button onClick={() => handleRequestJoin(wish.id)}>
              Request to Join
            </button>
          </div>
        ))}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredWishes.length / wishesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </>
    );
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
          <input
            type="text"
            placeholder="Search wishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {searching && (
            <p>
              Searching for relevant wishes. Till then, here are all the wishes:
            </p>
          )}
          {filteredWishes.length === 0 ? (
            <p>No relevant wishes found. Showing all wishes:</p>
          ) : (
            renderWishes()
          )}
          <div className="button-container">
            <button className="show-more-button" onClick={handleShowRelevant}>
              Show More Relevant Wishes
            </button>
            <button className="show-more-button" onClick={handleShowAll}>
              Show All Wishes
            </button>
          </div>
          {selectedWish && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className="modal-content"
              overlayClassName="modal-overlay"
              contentLabel="Wish Details"
            >
              <div className="modal-header">
                <h2>Wish Details</h2>
                <button onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <p>{selectedWish.description}</p>
                <b>Participants:</b>
                {selectedWish.participants &&
                selectedWish.participants.length > 0 ? (
                  selectedWish.participants.map((participant) => (
                    <div key={participant.user.id}>
                      <p>
                        <strong>{participant.user.name}</strong>
                      </p>
                      <p>
                        Haves:{" "}
                        {participant.user.haves &&
                        participant.user.haves.length > 0
                          ? participant.user.haves
                              .map((have) => have.description)
                              .join(", ")
                          : "Not specified"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ marginTop: "16px" }}>No participants yet.</p>
                )}
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Wishes;
