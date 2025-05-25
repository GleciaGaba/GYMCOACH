package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public MailServiceImpl(JavaMailSender mailSender,
                           @Value("${spring.mail.username}") String fromAddress) {
        this.mailSender  = mailSender;
        this.fromAddress = fromAddress;
    }

    @Override
    public void sendVerificationEmail(String to, String confirmUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart message
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject("Confirmez votre inscription à Gym Coach App");

            // corps du mail en HTML
            String content = """
                <p>Bonjour,</p>
                <p>Merci de vous être inscrit sur <strong>Gym Coach App</strong> !</p>
                <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
                <p><a href="%s">Confirmer mon compte</a></p>
                <br>
                <p>Ce lien expire dans 24 h.</p>
                <p>Si vous n’avez pas créé de compte, ignorez cet e-mail.</p>
                """.formatted(confirmUrl);

            helper.setText(content, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email de vérification", e);
        }
    }
}
