import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = ({ isAuthenticated }) => {
  return (
    <div className="home-container text-center d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-4 mb-4">Welcome to Happiness Cafes!</h1>
      
        <>
          <p className="lead mb-5">Join us to share happiness and contribute to social causes.</p>
          <div className="button-group">
            <Link to="/login" className="btn btn-custom btn-lg mx-3" style={{ backgroundColor:'turquoise'}}>Login</Link>
            <Link to="/register" className="btn btn-custom btn-lg mx-3" style={{ backgroundColor:'turquoise'}}>Feedback</Link>
          </div>  

          <a href='/admin' className="lead mb-5" style={{ color:'white', fontSize: '14px', marginTop: '64px', fontStyle:'italic', marginRight:'28px'}}>Admin?</a>

        </>
      
    </div>
  );
};

export default Home;
