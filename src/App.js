import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Registration from './components/Registration';
// import TaskList from './components/TaskList';
// import SkillSearch from './components/SkillSearch';
// import PointsDisplay from './components/PointsDisplay';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container mt-3">
      <Routes> {}
          <Route path="/register" element={<Registration />} />
          {/* <Route path="/tasks" element={<TaskList />} />
          <Route path="/search" element={<SkillSearch />} />
          <Route path="/points" element={<PointsDisplay />} /> */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
