package com.gymcoach.backend_gym.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour la classe JwtUtils
 * Cette classe teste toutes les fonctionnalités liées à la gestion des JWT (JSON Web Tokens)
 */
class JwtUtilsTest {

    // Instance de JwtUtils à tester
    private JwtUtils jwtUtils;
    
    // Clé secrète utilisée pour les tests (doit être la même que dans application.properties)
    private final String testSecret = "w4cV8hHpU9KAGJf4yZqjS0l+3XxYbDpRMVt8a2Z5Q0g=";
    
    // Durée de validité du token en millisecondes (24h)
    private final long testExpiration = 86400000;

    /**
     * Configuration initiale avant chaque test
     * Initialise une nouvelle instance de JwtUtils avec les paramètres de test
     */
    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        // Injection des valeurs de test via ReflectionTestUtils
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", testExpiration);
    }

    /**
     * Test de génération de token
     * Vérifie que le token généré est valide et au bon format (header.payload.signature)
     */
    @Test
    void generateToken_ShouldCreateValidToken() {
        // Given
        String username = "testuser";

        // When
        String token = jwtUtils.generateToken(username);

        // Then
        assertNotNull(token, "Le token ne devrait pas être null");
        assertTrue(token.split("\\.").length == 3, "Le token devrait avoir le format header.payload.signature");
    }

    /**
     * Test d'extraction du username depuis le token
     * Vérifie que le username extrait correspond à celui utilisé pour générer le token
     */
    @Test
    void getUsernameFromToken_ShouldReturnCorrectUsername() {
        // Given
        String username = "testuser";
        String token = jwtUtils.generateToken(username);

        // When
        String extractedUsername = jwtUtils.getUsernameFromToken(token);

        // Then
        assertEquals(username, extractedUsername, "Le username extrait devrait correspondre au username original");
    }

    /**
     * Test de validation d'un token valide
     * Vérifie qu'un token valide est accepté avec le bon username
     */
    @Test
    void validateToken_ShouldReturnTrueForValidToken() {
        // Given
        String username = "testuser";
        UserDetails userDetails = new User(username, "password", new ArrayList<>());
        String token = jwtUtils.generateToken(username);

        // When
        boolean isValid = jwtUtils.validateToken(token, userDetails);

        // Then
        assertTrue(isValid, "Le token valide devrait être accepté");
    }

    /**
     * Test de validation avec un mauvais username
     * Vérifie qu'un token est rejeté si le username ne correspond pas
     */
    @Test
    void validateToken_ShouldReturnFalseForInvalidUsername() {
        // Given
        String username = "testuser";
        UserDetails userDetails = new User("differentuser", "password", new ArrayList<>());
        String token = jwtUtils.generateToken(username);

        // When
        boolean isValid = jwtUtils.validateToken(token, userDetails);

        // Then
        assertFalse(isValid, "Le token devrait être rejeté avec un mauvais username");
    }

    /**
     * Test de validation d'un token expiré
     * Vérifie qu'un token expiré est rejeté
     */
    @Test
    void validateToken_ShouldReturnFalseForExpiredToken() {
        // Given
        String username = "testuser";
        UserDetails userDetails = new User(username, "password", new ArrayList<>());
        
        // Création d'un token expiré en modifiant la durée de validité
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000L); // Token expiré
        String expiredToken = jwtUtils.generateToken(username);
        
        // Restauration de la durée normale
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", testExpiration);

        // When
        boolean isValid = jwtUtils.validateToken(expiredToken, userDetails);

        // Then
        assertFalse(isValid, "Le token expiré devrait être rejeté");
    }

    /**
     * Test de validation d'un token mal formé
     * Vérifie qu'un token invalide est rejeté
     */
    @Test
    void validateToken_ShouldReturnFalseForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.format";
        UserDetails userDetails = new User("testuser", "password", new ArrayList<>());

        // When
        boolean isValid = jwtUtils.validateToken(invalidToken, userDetails);

        // Then
        assertFalse(isValid, "Le token mal formé devrait être rejeté");
    }
} 