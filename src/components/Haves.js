import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import "./Haves.css";
import ReactPaginate from "react-paginate";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Haves = () => {
  const [haves, setHaves] = useState([]);
  const [userWishes, setUserWishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHaves, setFilteredHaves] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedHave, setSelectedHave] = useState(null);
  const havesPerPage = 4;

  const fetchUserWishes = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      console.error("User ID or token missing");
      return;
    }
    try {
      const response = await axios.get(`/users/${userId}/wishes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserWishes(response.data || []);
    } catch (error) {
      console.error("Error fetching user wishes:", error);
    }
  }, []);

  const fetchHaves = useCallback(async () => {
    try {
      const response = await axios.get("/haves");
      setHaves(response.data);
      setFilteredHaves(response.data);
      sessionStorage.setItem("allHaves", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching haves:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedHaves = sessionStorage.getItem("allHaves");
    if (storedHaves) {
      setHaves(JSON.parse(storedHaves));
      setFilteredHaves(JSON.parse(storedHaves));
      setLoading(false);
    } else {
      fetchHaves();
    }
  }, [fetchHaves]);

  const fetchRelevantHaves = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      console.error("User ID or token missing");
      return;
    }
    try {
      setSearching(true);
      const response = await axios.post(
        `/haves/relevant`,
        { userWishes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setSearching(false);
      if (response.data.length === 0) {
        fetchHaves();
      } else {
        setHaves(response.data);
        setFilteredHaves(response.data);
        sessionStorage.setItem("relevantHaves", JSON.stringify(response.data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching relevant haves:", error);
      setSearching(false);
      setLoading(false);
    }
  }, [userWishes, fetchHaves]);

  useEffect(() => {
    fetchUserWishes();
  }, [fetchUserWishes]);

  useEffect(() => {
    const storedRelevantHaves = sessionStorage.getItem("relevantHaves");
    if (storedRelevantHaves) {
      setHaves(JSON.parse(storedRelevantHaves));
      setFilteredHaves(JSON.parse(storedRelevantHaves));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const results = haves.filter(
      (have) =>
        have.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        have.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (have.user &&
          have.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredHaves(results);
  }, [searchTerm, haves]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleShowRelevant = () => {
    sessionStorage.removeItem("relevantHaves");
    setLoading(true);
    fetchRelevantHaves();
  };

  const handleShowAll = async () => {
    sessionStorage.removeItem("relevantHaves");
    setLoading(true);
    await fetchHaves();
  };

  const openModal = (have) => {
    setSelectedHave(have);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedHave(null);
  };

  const renderHaves = () => {
    const offset = currentPage * havesPerPage;
    const currentHaves = filteredHaves.slice(offset, offset + havesPerPage);

    return (
      <>
        {currentHaves.map((have) => (
          <div
            key={have.id}
            className="have-card"
            onClick={() => openModal(have)}
          >
            <h3>{have.category}</h3>
            <p>{have.description}</p>
            {have.user && (
              <>
                <p>
                  <strong>Posted by:</strong> {have.user.name}
                </p>
                <p>
                  <strong>Contact:</strong> {have.user.phoneNumber}
                </p>
              </>
            )}
            <button onClick={() => handleInvite(have.user.id)}>Send Invite</button>
          </div>
        ))}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredHaves.length / havesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </>
    );
  };

  const handleInvite = (userId) => {
    setSelectedHave({ userId });
    setModalIsOpen(true);
  };

  const sendInvite = async (userId, wishId) => {
    const token = sessionStorage.getItem("token");
    const senderId = sessionStorage.getItem("userId");  
    try {
      await axios.post(
        `/wishes/${wishId}/invite`,
        { userId, senderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      alert("Invite sent successfully");
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Failed to send invite");
    }
  };
  

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const selectedWishId = e.target.wishId.value;
    sendInvite(selectedHave.userId, selectedWishId);
    closeModal();
  };

  return (
    <div className="haves-container">
      {loading ? (
        <div className="loader-container">
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      ) : (
        <>
          <h1>Haves</h1>
          <input
            type="text"
            placeholder="Search haves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {searching && (
            <p>
              Searching for relevant haves. Till then, here are all the haves:
            </p>
          )}
          {filteredHaves.length === 0 ? (
            <p>No relevant haves found. Showing all haves:</p>
          ) : (
            renderHaves()
          )}
          <div className="button-container">
            <button className="show-more-button" onClick={handleShowRelevant}>
              Show More Relevant Haves
            </button>
            <button className="show-more-button" onClick={handleShowAll}>
              Show All Haves
            </button>
          </div>
          {selectedHave && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className="modal-content"
              overlayClassName="modal-overlay"
              contentLabel="Invite User"
            >
              <div className="modal-header">
                <h2>Invite User to Join a Wish</h2>
                <button onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleInviteSubmit}>
                  <label htmlFor="wishId">Select Wish:</label>
                  <select id="wishId" name="wishId" required>
                    {userWishes.map((wish) => (
                      <option key={wish.id} value={wish.id}>
                        {wish.description}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Send Invite</button>
                </form>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Haves;
