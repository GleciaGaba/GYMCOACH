package com.gymcoach.backend_gym.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // Clé secrète (16+ bytes) à mettre dans application.properties ou .yml
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Durée de validité en ms (ex : 24h = 24 * 60 * 60 * 1000)
    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        // on utilise HS256
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /** 
     * Génère un JWT pour l'utilisateur donné avec ID dans 'sub' et email/role dans des claims séparés
     * @param userId ID de l'utilisateur
     * @param email Email de l'utilisateur
     * @param role Rôle de l'utilisateur
     * @return Token JWT
     */
    public String generateToken(Long userId, String email, String role) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(String.valueOf(userId))  // ID dans 'sub' (frontend expectation)
            .claim("email", email)               // Email dans un claim séparé
            .claim("role", role)                 // Rôle dans un claim séparé
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    /** 
     * Génère un JWT avec email dans 'sub' (ancien format pour compatibilité)
     * @param email Email de l'utilisateur
     * @return Token JWT
     */
    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(email)  // Email dans 'sub' (ancien format)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    /** 
     * Récupère l'email depuis le token (gère les deux formats)
     * @param token Token JWT
     * @return Email de l'utilisateur
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = parseClaims(token);
            // Essayer d'abord le nouveau format (email dans claim)
            String email = claims.get("email", String.class);
            if (email != null) {
                return email;
            }
            // Fallback vers l'ancien format (email dans 'sub')
            return claims.getSubject();
        } catch (Exception e) {
            // En cas d'erreur, essayer l'ancien format
            return parseClaims(token).getSubject();
        }
    }

    /** 
     * Récupère l'ID utilisateur depuis le token (nouveau format uniquement)
     * @param token Token JWT
     * @return ID de l'utilisateur ou null si ancien format
     */
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = parseClaims(token);
            // Nouveau format : ID dans 'sub'
            String subject = claims.getSubject();
            // Vérifier si le subject est un nombre (ID) ou un email
            try {
                return Long.valueOf(subject);
            } catch (NumberFormatException e) {
                // Ancien format : email dans 'sub', pas d'ID disponible
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    /** 
     * Récupère le rôle depuis le token (nouveau format uniquement)
     * @param token Token JWT
     * @return Rôle de l'utilisateur ou null si ancien format
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /** 
     * Récupère le username depuis le token (compatibilité)
     * @param token Token JWT
     * @return Username (email) de l'utilisateur
     */
    public String getUsernameFromToken(String token) {
        return getEmailFromToken(token);
    }

    /** 
     * Valide la signature et l'expiration du token
     * @param token Token JWT
     * @param userDetails Détails de l'utilisateur
     * @return true si valide, false sinon
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = parseClaims(token);
            String email = getEmailFromToken(token);
            return email.equals(userDetails.getUsername())
                   && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            // signature invalide, token mal formé, expiré, etc.
            return false;
        }
    }

    /** 
     * Parse et renvoie les Claims contenus dans le token
     * @param token Token JWT
     * @return Claims du token
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
