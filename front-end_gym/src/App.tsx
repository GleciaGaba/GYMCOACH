// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';

const App: React.FC = () => (
  <Router>
    {/* NAVBAR */}
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="Gym Coach App Logo" className="h-8"/>
          {/*<span className="text-white font-bold text-lg">Gym Coach</span>*/}
        </Link>
        {/* Liens nav */}
        <div className="flex items-center space-x-6">
          <Link to="/coach" className="text-white no-underline hover:underline">Coach</Link>
          <Link to="/sportif" className="text-white no-underline hover:underline">Sportif</Link>
        </div>

      </div>
    </nav>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* autres routes… */}
    </Routes>
  </Router>
);

export default App;
