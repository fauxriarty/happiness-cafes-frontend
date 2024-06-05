// src/App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Registration from './components/Registration';
import Home from './components/Home';
import Login from './components/Login';
import Wishes from './components/Wishes';
import Profile from './components/Profile';
import Terms from './components/Terms';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      {isAuthenticated && <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      <div className="container-fluid m-0 p-0">
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Registration onRegister={handleLogin} />} />
              <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            </>
          ) : (
            <>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/wishes" element={<Wishes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<Navigate to="/landing" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
