package com.gymcoach.backend_gym.security;

import io.jsonwebtoken.Claims;
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
        // Configuration des propriétés de test
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecretKey123456789012345678901234567890");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L); // 1 heure
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

    @Test
    void testGenerateTokenWithUserId() {
        // Test de génération du token avec le nouveau format
        Long userId = 123L;
        String email = "test@example.com";
        String role = "COACH";
        
        String token = jwtUtils.generateToken(userId, email, role);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Vérifier que le token peut être parsé
        Long extractedUserId = jwtUtils.getUserIdFromToken(token);
        String extractedEmail = jwtUtils.getEmailFromToken(token);
        String extractedRole = jwtUtils.getRoleFromToken(token);
        
        assertEquals(userId, extractedUserId);
        assertEquals(email, extractedEmail);
        assertEquals(role, extractedRole);
    }

    @Test
    void testGenerateTokenWithEmail() {
        // Test de génération du token avec l'ancien format (compatibilité)
        String email = "test@example.com";
        
        String token = jwtUtils.generateToken(email);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Vérifier que l'email peut être extrait
        String extractedEmail = jwtUtils.getEmailFromToken(token);
        assertEquals(email, extractedEmail);
        
        // Vérifier que l'ID utilisateur n'est pas disponible (ancien format)
        Long extractedUserId = jwtUtils.getUserIdFromToken(token);
        assertNull(extractedUserId);
    }

    @Test
    void testGetEmailFromToken_NewFormat() {
        // Test d'extraction de l'email depuis le nouveau format
        Long userId = 123L;
        String email = "test@example.com";
        String role = "ATHLETE";
        
        String token = jwtUtils.generateToken(userId, email, role);
        String extractedEmail = jwtUtils.getEmailFromToken(token);
        
        assertEquals(email, extractedEmail);
    }

    @Test
    void testGetEmailFromToken_OldFormat() {
        // Test d'extraction de l'email depuis l'ancien format
        String email = "test@example.com";
        
        String token = jwtUtils.generateToken(email);
        String extractedEmail = jwtUtils.getEmailFromToken(token);
        
        assertEquals(email, extractedEmail);
    }

    @Test
    void testGetUserIdFromToken_NewFormat() {
        // Test d'extraction de l'ID utilisateur depuis le nouveau format
        Long userId = 456L;
        String email = "test@example.com";
        String role = "COACH";
        
        String token = jwtUtils.generateToken(userId, email, role);
        Long extractedUserId = jwtUtils.getUserIdFromToken(token);
        
        assertEquals(userId, extractedUserId);
    }

    @Test
    void testGetUserIdFromToken_OldFormat() {
        // Test d'extraction de l'ID utilisateur depuis l'ancien format (doit retourner null)
        String email = "test@example.com";
        
        String token = jwtUtils.generateToken(email);
        Long extractedUserId = jwtUtils.getUserIdFromToken(token);
        
        assertNull(extractedUserId);
    }

    @Test
    void testGetRoleFromToken_NewFormat() {
        // Test d'extraction du rôle depuis le nouveau format
        Long userId = 789L;
        String email = "test@example.com";
        String role = "ATHLETE";
        
        String token = jwtUtils.generateToken(userId, email, role);
        String extractedRole = jwtUtils.getRoleFromToken(token);
        
        assertEquals(role, extractedRole);
    }

    @Test
    void testGetRoleFromToken_OldFormat() {
        // Test d'extraction du rôle depuis l'ancien format (doit retourner null)
        String email = "test@example.com";
        
        String token = jwtUtils.generateToken(email);
        String extractedRole = jwtUtils.getRoleFromToken(token);
        
        assertNull(extractedRole);
    }

    @Test
    void testTokenValidation() {
        // Test de validation du token
        Long userId = 123L;
        String email = "test@example.com";
        String role = "COACH";
        
        String token = jwtUtils.generateToken(userId, email, role);
        
        // Le token devrait être valide
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        // Vérifier que les informations extraites sont correctes
        assertEquals(userId, jwtUtils.getUserIdFromToken(token));
        assertEquals(email, jwtUtils.getEmailFromToken(token));
        assertEquals(role, jwtUtils.getRoleFromToken(token));
    }
} 