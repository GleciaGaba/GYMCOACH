// src/pages/login/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/auth';
import './LoginPage.css';  // on réutilise le même CSS que pour SignupPage

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await apiLogin(form);
      const { token } = response.data;
      // stocker le token (context ou localStorage)...
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="signup-hero">
      {/* Overlay semi-transparent */}
      <div className="overlay" />

      <div className="form-container">
        <div className="signup-card">
          <h2>Connexion</h2>

          {/* Affiche l'erreur si besoin */}
          {error && <p className="text-danger">{error}</p>}

          <Form onSubmit={handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Mot de passe */}
            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Bouton */}
            <Button variant="primary" type="submit" className="btn-submit">
              Se connecter
            </Button>
          </Form>

          {/* Lien vers signup */}
          <p className="mt-3">
            Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
