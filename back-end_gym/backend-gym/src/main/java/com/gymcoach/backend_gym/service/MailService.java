package com.gymcoach.backend_gym.service;

public interface MailService {
    /**
     * Envoie un email de vérification contenant le lien d'activation
     * @param to            adresse email du destinataire
     * @param confirmUrl    URL complète sur laquelle l'utilisateur cliquera pour confirmer son compte
     */
    void sendVerificationEmail(String to, String confirmUrl);
}
