import React from 'react';
import '../CommonStyles.css';


const logo = process.env.PUBLIC_URL + '/logo.png';
  
const LandingPage = () => {
  return (
    <div className="common-container">
      
      <img src={logo} alt="Descriptive text" style={{ width: '500px', height: '300px' }} />        
      <h1>Welcome to the Landing Page</h1>
      <p>Explore our features and enjoy your stay!</p>
    </div>
  );
};

export default LandingPage;
