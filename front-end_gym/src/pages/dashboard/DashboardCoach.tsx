/**
 * DashboardCoach.tsx
 *
 * Ce composant représente le tableau de bord principal pour les coachs.
 * Il affiche les statistiques, les actions rapides et la liste des sportifs récents.
 */

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import {
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaBell,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardCoach.css";

// Interface pour typer les données des sportifs
interface Athlete {
  id: number;
  name: string;
  lastSession: string;
  isActive: boolean;
}

const DashboardCoach: React.FC = () => {
  // Hook pour la navigation entre les pages
  const navigate = useNavigate();

  // États pour gérer les données et le chargement
  const [recentSportifs, setRecentSportifs] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Données de démonstration pour les statistiques
   * À remplacer par des données réelles provenant de l'API
   */
  const stats = {
    totalSportifs: 12, // Nombre total de sportifs suivis
    activePrograms: 5, // Nombre de programmes d'entraînement actifs
    upcomingSessions: 3, // Nombre de sessions planifiées
    notifications: 2, // Nombre de notifications non lues
  };

  /**
   * Récupère la liste des sportifs depuis l'API
   */
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupération du token depuis le localStorage
        const rawToken = localStorage.getItem("token");
        console.log("Token présent:", !!rawToken); // Log pour vérifier si le token existe

        if (!rawToken) {
          throw new Error("Non authentifié");
        }

        // Préparation du token avec le préfixe Bearer si nécessaire
        const token = rawToken.startsWith("Bearer ")
          ? rawToken
          : `Bearer ${rawToken}`;
        console.log(
          "Format du token:",
          token.startsWith("Bearer ") ? "correct" : "ajout du préfixe Bearer"
        );

        // Configuration de l'instance axios avec les headers par défaut
        const api = axios.create({
          baseURL: "http://localhost:8080",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        console.log("Headers de la requête:", {
          Authorization: token,
          "Content-Type": "application/json",
        });

        // Récupération des sportifs
        const response = await api.get("/api/coaches/my-athletes");
        console.log(
          "Réponse API brute complète:",
          JSON.stringify(response.data, null, 2)
        ); // Log détaillé de la réponse

        if (!response.data) {
          throw new Error("Aucune donnée reçue");
        }

        // Transformer les données de l'API au format attendu
        const athletes = response.data.map((athlete: any) => {
          console.log(
            "Toutes les propriétés du sportif:",
            Object.keys(athlete)
          );
          console.log("Valeurs complètes du sportif:", athlete);

          return {
            id: athlete.id,
            name: `${athlete.firstName} ${athlete.lastName}`,
            lastSession: athlete.lastSession || "Pas de session",
            isActive: athlete.active === true,
          };
        });

        console.log("Données transformées:", athletes);

        setRecentSportifs(athletes);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des sportifs:", err);
        console.error("Détails de l'erreur:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
        });

        let errorMessage = "Erreur lors du chargement des sportifs";

        if (err.response) {
          if (err.response.status === 403) {
            errorMessage =
              "Accès refusé. Vérifiez que vous êtes bien connecté en tant que coach.";
            // Vérifier le token dans le localStorage
            const storedToken = localStorage.getItem("token");
            console.log("Token stocké:", storedToken);
          } else {
            errorMessage = `Erreur serveur: ${err.response.status} - ${
              err.response.data?.message || "Erreur inconnue"
            }`;
          }
        } else if (err.message === "Non authentifié") {
          errorMessage = "Vous devez être connecté pour voir vos sportifs";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  return (
    <div className="dashboard-container">
      <Container fluid>
        {/* En-tête du dashboard avec titre et sous-titre */}
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">Tableau de bord Coach</h1>
            <p className="dashboard-subtitle">
              Bienvenue sur votre espace personnel
            </p>
          </Col>
        </Row>

        {/* Section des statistiques avec 4 cartes */}
        <Row className="mb-4">
          {/* Carte : Nombre de sportifs actifs */}
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

          {/* Carte : Nombre de programmes actifs */}
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

          {/* Carte : Sessions à venir */}
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

          {/* Carte : Notifications */}
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

        {/* Section principale : Actions rapides et liste des sportifs */}
        <Row>
          {/* Colonne de gauche : Actions rapides */}
          <Col md={4}>
            <Card className="action-card mb-4">
              <Card.Header>
                <h5>Actions rapides</h5>
              </Card.Header>
              <Card.Body>
                {/* Bouton pour ajouter un nouveau sportif */}
                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={() => navigate("/add-sportif")}
                >
                  Ajouter un sportif
                </Button>
                {/* Bouton pour créer un nouveau programme */}
                <Button variant="outline-primary" className="w-100 mb-2">
                  Créer un programme
                </Button>
                {/* Bouton pour gérer les workouts */}
                <Button
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => navigate("/create-workout")}
                >
                  <i className="bi bi-dumbbell me-2"></i>
                  Gérer les Workouts
                </Button>
                {/* Bouton pour ajouter un exercice */}
                <Button
                  variant="outline-primary"
                  className="w-100 mb-2"
                  onClick={() => navigate("/add-exercise")}
                >
                  Ajouter un exercice
                </Button>
                {/* Bouton pour accéder au chat */}
                <Button
                  variant="outline-success"
                  className="w-100"
                  onClick={() => navigate("/chat")}
                >
                  <FaComments className="me-2" />
                  Chat avec les sportifs
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Colonne de droite : Liste des sportifs récents */}
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5>Sportifs récents</h5>
              </Card.Header>
              <Card.Body>
                {isLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </Spinner>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Dernière session</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSportifs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              Aucun sportif trouvé
                            </td>
                          </tr>
                        ) : (
                          recentSportifs.map((sportif) => (
                            <tr key={sportif.id}>
                              <td>{sportif.name}</td>
                              <td>{sportif.lastSession}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    sportif.isActive
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  {sportif.isActive ? "Actif" : "Inactif"}
                                </span>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    navigate(`/sportif/${sportif.id}`)
                                  }
                                >
                                  Voir
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/sportif/${sportif.id}/edit`)
                                  }
                                >
                                  Éditer
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardCoach;
