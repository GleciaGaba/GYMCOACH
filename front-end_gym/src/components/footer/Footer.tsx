// src/components/Footer.tsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Gym Coach App
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="footer-links">
              <a href="/about">À propos</a>
              <a href="/contact">Contact</a>
              <a href="/terms">CGU</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
