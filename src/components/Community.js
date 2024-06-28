import React, { useState, useEffect, useCallback } from "react";
import axios from '../axiosConfig'; 
import "./Community.css";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Community = () => {
  const [wishes, setWishes] = useState([]);
  const [invites, setInvites] = useState([]);
  const [activeWishes, setActiveWishes] = useState([]);
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

  const fetchInvites = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      const response = await axios.get(
        `/wishes/invites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId
          }
        }
      );
      setInvites(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invites:", error);
      setLoading(false);
    }
  }, []);

  const fetchActiveWishes = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      return;
    }
    try {
      const response = await axios.get(
        `/wishes/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId
          }
        }
      );
      setActiveWishes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching active wishes:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchInvites();
    fetchActiveWishes();
  }, [fetchRequests, fetchInvites, fetchActiveWishes]);

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
      fetchInvites();
      fetchActiveWishes();
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
          <h1 style={{margin:'16px'}}>Community Requests</h1>
          {wishes.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            wishes.map((wish) => (
              <div key={wish.id} className="card mt-4" onClick={() => openModal(wish)}>
                <h3>{wish.description}</h3>
                <p>Participants: {wish.participants ? wish.participants.length : 0}</p>

                {wish.requests && wish.requests.length > 0 ? (
                  wish.requests.map((request) => (
                    <div key={request.id} className="request-card">
                      <p><strong>Requested by:</strong> {request.user ? request.user.name : "Unknown"}</p>
                      {request.status === 'pending' ? (
                        <>
                          <button onClick={() => handleResponse(request.id, 'accepted')}>Accept</button>
                          <button onClick={() => handleResponse(request.id, 'rejected')}>Reject</button>
                        </>
                      ) : (
                        <p><strong>Status:</strong> {request.status}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No requests available for this wish.</p>
                )}
              </div>
            ))
          )}
          <h1 className="mt-5"style={{margin:'16px'}}>Invites</h1>
          {invites.length === 0 ? (
            <p style={{margin:'16px'}}>No invites found.</p>
          ) : (
            invites.map((invite) => (
              <div key={invite.id} className="card mt-4" onClick={() => openModal(invite.wish)}>
                <h3>{invite.wish.description}</h3>
                <p>Invited by: {invite.sender ? invite.sender.name : "Unknown"}</p>
                {invite.status === 'pending' && (
                  <>
                    <button onClick={() => handleInviteResponse(invite.id, 'accepted')}>Accept</button>
                    <button onClick={() => handleInviteResponse(invite.id, 'rejected')}>Reject</button>
                  </>
                )}
              </div>
            ))
          )}
          <h1 className="mt-5" style={{margin:'16px'}}>Active Wishes</h1>
          {activeWishes.length === 0 ? (
            <p style={{margin:'16px'}}>No active wishes found.</p>
          ) : (
            activeWishes.map((wish) => (
              <div key={wish.id} className="card mt-4" onClick={() => openModal(wish)}>
                <h3>{wish.description}</h3>
                <p>Created by: {wish.user ? wish.user.name : "Unknown"}</p>
                <p>Participants: {wish.participants ? wish.participants.length : 0}</p>
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
