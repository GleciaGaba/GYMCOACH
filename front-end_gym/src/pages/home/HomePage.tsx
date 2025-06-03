// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "./HomePage.css"; // pour y mettre le CSS du hero

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <div className="hero-overlay">
        <Container className="hero-content text-white d-flex flex-column justify-content-center h-100">
          <h1 className="display-3 fw-bold mb-4">Bienvenue sur Gym Coach</h1>
          <h2 className="lead mb-4 fw-bold">
            Votre partenaire pour atteindre vos objectifs sportifs
          </h2>
          <div className="hero-buttons">
            <Button
              variant="primary"
              size="lg"
              className="me-3"
              onClick={() => navigate("/login")}
            >
              Connexion
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate("/signup")}
            >
              Inscription
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
