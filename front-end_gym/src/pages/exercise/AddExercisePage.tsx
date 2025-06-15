import React, { useState, FormEvent, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { exerciseApi, CreateExerciseDto } from "../../api/exercise";
import axios from "axios";
import { API_URL } from "../../config";
import "./AddExercisePage.css";

interface MuscleGroup {
  id: number;
  label: string;
}

const AddExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [form, setForm] = useState<CreateExerciseDto>({
    name: "",
    description: "",
    muscleGroupId: 0,
    difficulty: "INTERMEDIATE",
    equipment: "",
    instructions: "",
    exerciseUrl: "",
  });

  // Vérifier que l'utilisateur est un coach
  useEffect(() => {
    if (!user || user.role !== "COACH") {
      setError(
        "Vous devez être connecté en tant que coach pour accéder à cette page"
      );
      navigate("/login");
    }
  }, [user, navigate]);

  // Charger les groupes musculaires
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_URL}/muscle-groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMuscleGroups(response.data);
        if (response.data.length > 0) {
          setForm((prev) => ({ ...prev, muscleGroupId: response.data[0].id }));
        }
      } catch (err) {
        setError("Erreur lors du chargement des groupes musculaires");
      }
    };
    fetchMuscleGroups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "muscleGroupId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation côté client
    if (!form.name.trim()) {
      setError("Le nom de l'exercice est obligatoire");
      return;
    }
    if (!form.muscleGroupId) {
      setError("Le groupe musculaire est obligatoire");
      return;
    }
    if (!form.description.trim()) {
      setError("La description est obligatoire");
      return;
    }
    if (!form.equipment.trim()) {
      setError("L'équipement est obligatoire");
      return;
    }
    if (!form.instructions.trim()) {
      setError("Les instructions sont obligatoires");
      return;
    }

    try {
      setLoading(true);
      await exerciseApi.createExercise(form);
      setSuccess("L'exercice a été créé avec succès !");

      // Réinitialiser le formulaire après succès
      setForm({
        name: "",
        description: "",
        muscleGroupId: muscleGroups[0]?.id || 0,
        difficulty: "INTERMEDIATE",
        equipment: "",
        instructions: "",
        exerciseUrl: "",
      });

      // Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        navigate("/dashboard_coach");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la création de l'exercice:", err);
      setError(err.message || "Erreur lors de la création de l'exercice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-exercise-container">
      <Container>
        <Card className="add-exercise-card">
          <Card.Header>
            <h2>Ajouter un nouvel exercice</h2>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de l'exercice</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le nom de l'exercice"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez l'exercice"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Groupe musculaire</Form.Label>
                    <Form.Select
                      name="muscleGroupId"
                      value={form.muscleGroupId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Sélectionnez un groupe musculaire
                      </option>
                      {muscleGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Niveau de difficulté</Form.Label>
                    <Form.Select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      required
                    >
                      <option value="BEGINNER">Débutant</option>
                      <option value="INTERMEDIATE">Intermédiaire</option>
                      <option value="ADVANCED">Avancé</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Équipement nécessaire</Form.Label>
                    <Form.Control
                      type="text"
                      name="equipment"
                      value={form.equipment}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Haltères, Barre, etc."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="instructions"
                      value={form.instructions}
                      onChange={handleChange}
                      required
                      placeholder="Détaillez les étapes de l'exercice"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL de la vidéo (optionnel)</Form.Label>
                    <Form.Control
                      type="url"
                      name="exerciseUrl"
                      value={form.exerciseUrl}
                      onChange={handleChange}
                      placeholder="Lien vers une vidéo de démonstration"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? "Création en cours..." : "Créer l'exercice"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/dashboard_coach")}
                >
                  Annuler
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddExercisePage;
