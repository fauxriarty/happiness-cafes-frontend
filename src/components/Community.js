import React, { useState, useEffect, useCallback } from "react";
import axios from '../axiosConfig'; 
import "./Community.css";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Community = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState(null);

  const fetchRequests = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      const response = await axios.get(
        `/wishes/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId
          }
        }
      );
      setWishes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleResponse = async (requestId, status) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        `/wishes/requests/${requestId}/respond`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      fetchRequests(); 
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const handleInviteResponse = async (inviteId, status) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        `/wishes/invites/${inviteId}/respond`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      fetchRequests(); 
    } catch (error) {
      console.error("Error responding to invite:", error);
    }
  };

  const openModal = (wish) => {
    setSelectedWish(wish);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedWish(null);
  };

  return (
    <div className={`community-container ${modalIsOpen ? 'blur' : ''}`}>
      {loading ? (
        <div className="loader-container">
          <ClipLoader color={"#123abc"} loading={loading} size={50} />
        </div>
      ) : (
        <>
          <h1>Community Requests</h1>
          {wishes.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            wishes.map((wish) => (
              <div key={wish.id} className="wish-card" onClick={() => openModal(wish)}>
                <h3>{wish.description}</h3>
                <p>Participants: {wish.participants ? wish.participants.length : 0}</p>
                {wish.requests && wish.requests.length > 0 ? (
                  wish.requests.map((request) => (
                    <div key={request.id} className="request-card">
                      <p><strong>Requested by:</strong> {request.user ? request.user.name : "Unknown"}</p>
                      <p><strong>Status:</strong> {request.status}</p>
                      {request.status === 'pending' && (
                        <>
                          <button onClick={() => handleResponse(request.id, 'accepted')}>Accept</button>
                          <button onClick={() => handleResponse(request.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No requests available for this wish.</p>
                )}
                {wish.invites && wish.invites.length > 0 ? (
                  wish.invites.map((invite) => (
                    <div key={invite.id} className="invite-card">
                      <p><strong>Invited by:</strong> {invite.user ? invite.user.name : "Unknown"}</p>
                      <p><strong>Status:</strong> {invite.status}</p>
                      {invite.status === 'pending' && (
                        <>
                          <button onClick={() => handleInviteResponse(invite.id, 'accepted')}>Accept</button>
                          <button onClick={() => handleInviteResponse(invite.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No invites available for this wish.</p>
                )}
              </div>
            ))
          )}
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
                <button onClick={closeModal}>&times;</button>
              </div>
              <div className="modal-body">
                <p>{selectedWish.description}</p>
                <b>Participants:</b>
                {selectedWish.participants && selectedWish.participants.length > 0 ? (
                  selectedWish.participants.map((participant) => (
                    <div key={participant.user.id} className="participant-card">
                      <p><strong>{participant.user.name}</strong></p>
                      <p>Haves: {participant.user.haves ? participant.user.haves.map(have => have.description).join(", ") : "None"}</p>
                      <p>Contact: {participant.user.phoneNumber}</p>
                    </div>
                  ))
                ) : (
                  <p style={{marginTop:'16px'}}>No participants yet.</p>
                )}
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Community;
