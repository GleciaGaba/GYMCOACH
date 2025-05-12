// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignupPage from './pages/signup/SignupPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const App: React.FC = () => (
  <Router>
    <Header />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* autres routes… */}
    </Routes>
    <Footer />
  </Router>
  
);

export default App;
