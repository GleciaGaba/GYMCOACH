import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { changePassword } from "../../api/sportif";

interface ChangePasswordModalProps {
  show: boolean;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  show,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (form.newPassword.length < 12) {
      setError("Le nouveau mot de passe doit contenir au moins 12 caractères");
      return;
    }

    try {
      setLoading(true);
      await changePassword(form.oldPassword, form.newPassword);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du changement de mot de passe"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Changement de mot de passe obligatoire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">
          Pour des raisons de sécurité, vous devez changer votre mot de passe
          temporaire.
        </Alert>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe temporaire</Form.Label>
            <Form.Control
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={12}
            />
            <Form.Text className="text-muted">
              Le mot de passe doit contenir au moins 12 caractères
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? "Changement en cours..." : "Changer le mot de passe"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
