import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navigation = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const handleLogout = () => {
    onLogout();
    navigate('/'); // navigate to home page
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{backgroundColor:'#DECBA4'}}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/wishes">Wishes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${userId}`}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/terms">Terms and Conditions</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link logout-button" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
