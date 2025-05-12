// src/components/Footer.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => (
  <footer className="bg-dark text-white py-4 mt-auto">
    <Container>
      <Row>
        {/* Colonne gauche : copyright */}
        <Col md={6}>
          <p className="mb-0">&copy; {new Date().getFullYear()} Gym Coach App. Tous droits réservés.</p>
        </Col>
        {/* Colonne droite : liens utilitaires */}
        <Col md={6} className="text-md-end">
          <a href="/about" className="text-white me-3 text-decoration-none">À propos</a>
          <a href="/contact" className="text-white me-3 text-decoration-none">Contact</a>
          <a href="/terms" className="text-white text-decoration-none">CGU</a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
