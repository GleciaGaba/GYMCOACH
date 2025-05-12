// src/pages/SignupPage.tsx
import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signupCoach } from '../../api/auth';
import './SignupPage.css';

interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignupPage: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }
    try {
      const { data } = await signupCoach(form);
      // data: { token: string, email: string }
      localStorage.setItem('token', data.token);
      // tu peux aussi stocker email si besoin
      navigate('/'); // redirige vers l’accueil ou dashboard
    } catch (err: any) {
      // axios envoie l’erreur dans err.response.data.message
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="signup-hero">
      <div className="overlay" />
      <div className="form-container">
        <div className="signup-card">
          <h2>Inscription Coach</h2>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

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

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={12}
              />
              <Form.Text className="text-muted">
                Au moins 12 caractères.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-submit">
              S'inscrire
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
