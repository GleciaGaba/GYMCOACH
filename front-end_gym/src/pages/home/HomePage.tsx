// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import "./HomePage.css"; // pour y mettre le CSS du hero

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`hero-section ${isLoaded ? "loaded" : ""}`}
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="hero-overlay">
          <Container className="hero-content text-white d-flex flex-column justify-content-center h-60">
            <h1 className="hero-title">
              <span>Bienvenue sur</span>
              <br />
              <span className="gradient-text">Gym Coach</span>
            </h1>
            <h2 className="hero-subtitle">
              Votre partenaire pour atteindre vos objectifs sportifs
            </h2>
            <div className="hero-buttons">
              <Button
                variant="primary"
                size="lg"
                className="me-3"
                onClick={() => navigate("/login")}
              >
                <span>Connexion</span>
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                onClick={() => navigate("/signup")}
              >
                <span>Inscription</span>
              </Button>
            </div>
          </Container>
        </div>
      </div>

      <section className="features-section">
        <Container>
          <h2 className="section-title">Nos Fonctionnalités</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">💪</div>
                <h3>Programmes Personnalisés</h3>
                <p>Des entraînements adaptés à vos objectifs et votre niveau</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Suivi de Progression</h3>
                <p>Visualisez votre évolution et restez motivé</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Communauté Active</h3>
                <p>Échangez avec d'autres passionnés de fitness</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
