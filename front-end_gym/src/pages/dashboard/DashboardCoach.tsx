import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaUsers, FaChartLine, FaCalendarAlt, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./DashboardCoach.css";

const DashboardCoach: React.FC = () => {
  const navigate = useNavigate();
  // Données de démonstration (à remplacer par des données réelles de l'API)
  const stats = {
    totalSportifs: 12,
    activePrograms: 5,
    upcomingSessions: 3,
    notifications: 2,
  };

  const recentSportifs = [
    { id: 1, name: "Jean Dupont", lastSession: "2024-03-15", progress: "+15%" },
    { id: 2, name: "Marie Martin", lastSession: "2024-03-14", progress: "+8%" },
    {
      id: 3,
      name: "Pierre Durand",
      lastSession: "2024-03-13",
      progress: "+12%",
    },
  ];

  return (
    <div className="dashboard-container">
      <Container fluid>
        {/* En-tête du dashboard */}
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">Tableau de bord Coach</h1>
            <p className="dashboard-subtitle">
              Bienvenue sur votre espace personnel
            </p>
          </Col>
        </Row>

        {/* Cartes de statistiques */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalSportifs}</h3>
                  <p>Sportifs actifs</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <h3>{stats.activePrograms}</h3>
                  <p>Programmes actifs</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaCalendarAlt />
                </div>
                <div className="stat-content">
                  <h3>{stats.upcomingSessions}</h3>
                  <p>Sessions à venir</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">
                  <FaBell />
                </div>
                <div className="stat-content">
                  <h3>{stats.notifications}</h3>
                  <p>Notifications</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions rapides et liste des sportifs */}
        <Row>
          <Col md={4}>
            <Card className="action-card mb-4">
              <Card.Header>
                <h5>Actions rapides</h5>
              </Card.Header>
              <Card.Body>
                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={() => navigate("/add-sportif")}
                >
                  Ajouter un sportif
                </Button>
                <Button variant="outline-primary" className="w-100 mb-2">
                  Créer un programme
                </Button>
                <Button variant="outline-primary" className="w-100">
                  Planifier une session
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5>Sportifs récents</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Dernière session</th>
                        <th>Progression</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSportifs.map((sportif) => (
                        <tr key={sportif.id}>
                          <td>{sportif.name}</td>
                          <td>{sportif.lastSession}</td>
                          <td>
                            <span className="progress-badge">
                              {sportif.progress}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                            >
                              Voir
                            </Button>
                            <Button variant="outline-success" size="sm">
                              Éditer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardCoach;
