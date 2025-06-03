import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardSportif.css";

const DashboardSportif: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-sportif">
      <Container fluid>
        <Row className="mb-4 align-items-center">
          <Col>
            <h1>Tableau de bord - Sportif</h1>
            <p className="text-muted">
              Bienvenue, {user?.firstName} {user?.lastName}
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" onClick={handleLogout}>
              Déconnexion
            </Button>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Profil</Card.Title>
                <Card.Text>
                  Modifier votre profil ou changer votre mot de passe.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/profil")}>
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Informations</Card.Title>
                <Card.Text>
                  Hydratation, anthropométrie, historique des feedbacks.
                </Card.Text>
                <Button
                  variant="info"
                  onClick={() => navigate("/informations")}
                >
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Entraînements</Card.Title>
                <Card.Text>
                  Voir, effectuer ou laisser un feedback sur vos entraînements.
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => navigate("/entrainements")}
                >
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4 mt-2">
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Coach</Card.Title>
                <Card.Text>Voir les informations de votre coach.</Card.Text>
                <Button variant="secondary" onClick={() => navigate("/coach")}>
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Chat</Card.Title>
                <Card.Text>
                  Discuter avec votre coach ou d'autres sportifs.
                </Card.Text>
                <Button variant="warning" onClick={() => navigate("/chat")}>
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardSportif;
