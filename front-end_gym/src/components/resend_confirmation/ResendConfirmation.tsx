import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Composant pour renvoyer le mail de confirmation d'inscription
export default function ResendConfirmation() {

  // État pour stocker l'email saisi par l'utilisateur
  const [email, setEmail] = useState('');


  // État pour indiquer si la requête est en cours
  const [loading, setLoading] = useState(false);


  // Hook pour naviguer vers une autre route après envoi
  const navigate = useNavigate();

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault(); // Empêche le rechargement de la page

    setLoading(true);   // Active le spinner / désactive le bouton
    
    try {
      // Appel à l'API pour renvoyer le lien de confirmation
      const resp = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      
      if (!resp.ok) {
        // Récupération du message d'erreur renvoyé par le serveur
        const error = await resp.json();
        toast.error(error.message || 'Erreur lors de l’envoi du lien');
      } else {
        // Succès : notification et redirection vers la page de connexion
        toast.success('Un nouveau lien de confirmation vous a été envoyé');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Impossible de contacter le serveur');
    } finally {
      setLoading(false); // Réactive le bouton
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        {/* En-tête de la carte */}
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Renvoyer le lien de confirmation</h5>
        </div>
        {/* Corps de la carte avec le formulaire */}
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Votre adresse e-mail</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="exemple@domaine.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Bouton d'envoi, désactivé pendant le loading */}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Renvoyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
