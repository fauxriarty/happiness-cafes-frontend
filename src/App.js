import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Registration from './components/Registration';
import Home from './components/Home';
import Login from './components/Login';
import Wishes from './components/Wishes';
import Profile from './components/Profile';
import Terms from './components/Terms';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load the authentication state from sessionStorage when the component mounts
  useEffect(() => {
    const storedIsAuthenticated = sessionStorage.getItem('isAuthenticated');
    setIsAuthenticated(storedIsAuthenticated === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true'); // Store the authentication state in sessionStorage
  };

  return (
    <Router>
      <Navigation isAuthenticated={isAuthenticated} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration onRegister={handleLogin} />} />
          {isAuthenticated && (
            <>
              <Route path="/wishes" element={<Wishes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/terms" element={<Terms />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;