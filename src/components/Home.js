import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ isAuthenticated }) => {
  return (
    <div className="home-container text-center d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-4 mb-4">Welcome to Happiness Cafes!</h1>
      {isAuthenticated ? (
        <>
          <p className="lead mb-4">Explore the various sections to learn more:</p>
          <ul className="list-unstyled">
            <li><strong>Home:</strong> Understand the concept of happiness cafes and how it can benefit you.</li>
            <li><strong>Wishes:</strong> See relevant wishes posted by others and create your own.</li>
            <li><strong>Profile:</strong> Edit your details and add more skills.</li>
            <li><strong>Terms and Conditions:</strong> Understand the terms and conditions of using the platform.</li>
          </ul>
        </>
      ) : (
        <>
          <p className="lead mb-5">Join us to share happiness and contribute to social causes.</p>
          <div className="button-group">
            <Link to="/login" className="btn btn-custom btn-lg mx-3">Login</Link>
            <Link to="/register" className="btn btn-custom btn-lg mx-3">Sign Up</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
