package com.gymcoach.backend_gym.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Imports Lombok
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(nullable = false, unique = true)
    private String email;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

     /** Token unique envoyé par e-mail, it permet de lier un lien de confirmation à un utilisateur. */
    @Column(name = "verification_token", unique = true)
    private String verificationToken;

    /** Facultatif : expiration du token, évite les confirmations trop anciennes. */
    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;
}
