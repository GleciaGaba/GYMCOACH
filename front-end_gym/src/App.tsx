// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignupPage from './pages/signup/SignupPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import LoginPage from './pages/login/LoginPage';
import ResendConfirmation from './components/resend_confirmation/ResendConfirmation';

const App: React.FC = () => (
  <>
    <Header />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/coach" element={<LoginPage />} />
      <Route path="/resend-confirmation" element={<ResendConfirmation />} />
      
      {/* autres routes… */}
    </Routes>
    <Footer />
 </>
  
);

export default App;
