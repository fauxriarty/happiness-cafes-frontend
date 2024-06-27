import React, { useState, useEffect } from 'react';
import '../CommonStyles.css';

const logo = process.env.PUBLIC_URL + '/logo.png';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = logo;
    img.onload = () => setLoading(false);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-container">
    <div className="common-container">
      <div className="logo-container">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <img src={logo} alt="Descriptive text" style={{ width: '500px', height: '300px' }} />
        )}
      </div>
      <h1>Welcome to the Landing Page</h1>
      <p>Explore our features and enjoy your stay!</p>
    </div>
      </div>
    </div>
  );
};

export default LandingPage;
