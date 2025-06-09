import React, { useState, FormEvent } from "react";
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
import "./AddExercisePage.css";

interface ExerciseForm {
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  instructions: string;
  videoUrl?: string;
  imageUrl?: string;
}

const AddExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ExerciseForm>({
    name: "",
    description: "",
    muscleGroup: "",
    difficulty: "INTERMEDIATE",
    equipment: "",
    instructions: "",
    videoUrl: "",
    imageUrl: "",
  });

  // Vérifier que l'utilisateur est un coach
  React.useEffect(() => {
    if (!user || user.role !== "COACH") {
      setError(
        "Vous devez être connecté en tant que coach pour accéder à cette page"
      );
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      // TODO: Implémenter l'appel API pour créer l'exercice
      // await createExercise(form);

      setSuccess("L'exercice a été créé avec succès !");

      // Réinitialiser le formulaire après succès
      setForm({
        name: "",
        description: "",
        muscleGroup: "",
        difficulty: "INTERMEDIATE",
        equipment: "",
        instructions: "",
        videoUrl: "",
        imageUrl: "",
      });
    } catch (err: any) {
      console.error("Erreur lors de la création de l'exercice:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la création de l'exercice"
      );
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
                    <Form.Control
                      type="text"
                      name="muscleGroup"
                      value={form.muscleGroup}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Pectoraux, Jambes, etc."
                    />
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
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL de la vidéo (optionnel)</Form.Label>
                    <Form.Control
                      type="url"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="Lien vers une vidéo de démonstration"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL de l'image (optionnel)</Form.Label>
                    <Form.Control
                      type="url"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="Lien vers une image de l'exercice"
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
