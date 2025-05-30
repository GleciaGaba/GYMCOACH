// src/pages/login/LoginPage.tsx
import React, { useState, FormEvent } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "../../components/change-password/ChangePasswordModal";
import "./LoginPage.css"; // on réutilise le même CSS que pour SignupPage

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await login(form.email, form.password);
      const userData = JSON.parse(response);

      if (userData.password_changed === false) {
        setShowChangePassword(true);
        return;
      }

      navigate(`/dashboard_${userData.role.toLowerCase()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      navigate(`/dashboard_${userRole.toLowerCase()}`);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Card className="login-card">
          <Card.Header>
            <h2>Bienvenue</h2>
            <p className="text-muted">Connectez-vous à votre compte</p>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Entrez votre email"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Entrez votre mot de passe"
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
              <div className="text-center mt-4">
                <p className="mb-0">
                  Pas encore de compte ?{" "}
                  <Link to="/signup" className="text-primary">
                    Inscrivez-vous
                  </Link>
                </p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <ChangePasswordModal
        show={showChangePassword}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
};

export default LoginPage;
