import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const logo = useMemo(() => process.env.PUBLIC_URL + '/logo.png', []);

  return (
    <div className="home-container text-center d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-4 mb-3 mt-8">Welcome to Happiness Cafe!</h1>
      <>
        <p className="lead mb-0">Join us to share happiness and contribute to social causes.</p>
        <div className="content-container d-flex">
          <img src={logo} alt="Descriptive text" className="home-logo" />
          <div className="button-group d-flex flex-column">
            <Link to="/login" className="btn btn-custom btn-lg mb-3">Login</Link>
            <Link to="/register" className="btn btn-custom btn-lg mb-3">Feedback</Link>
            <a href='/admin' className="admin-link lead">Admin?</a>
          </div>
        </div>
      </>
    </div>
  );
};

export default Home;
