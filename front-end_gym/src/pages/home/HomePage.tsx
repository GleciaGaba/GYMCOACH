// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './HomePage.css'; // pour y mettre le CSS du hero

const HomePage: React.FC = () => (
  <div className="hero-section">
    {/* 1) Overlay sombre */}
    <div className="hero-overlay" />

    {/* 2) Contenu centré */}
    <Container className="hero-content text-white d-flex flex-column justify-content-center h-100">
      <h1 className="display-3 fw-bold mb-4">
        Atteignez vos objectifs !
        
      </h1>
      <h2 className="lead mb-4 fw-bold">
        Votre coaching, votre rythme, vos résultats.
      </h2>
      <Link to="/signup">
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </Link>
    </Container>
  </div>
);

export default HomePage;
