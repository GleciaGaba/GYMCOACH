package com.gymcoach.backend_gym.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    private final String from;

    public MailService(JavaMailSender mailSender,
                       @Value("${app.mail.from}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendCredentials(String to, String password) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Vos accès Gym Coach App");
        msg.setText(
          "Bonjour !\n\n" +
          "Votre compte Gym Coach App a été créé.\n" +
          "Email : " + to + "\n" +
          "Mot de passe : " + password + "\n\n" +
          "Pensez à changer votre mot de passe après connexion."
        );
        mailSender.send(msg);
    }
}

