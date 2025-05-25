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

    /** Génère un JWT pour l’utilisateur donné **/
    public String generateToken(String username) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + jwtExpirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    /** Récupère le username depuis le token **/
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /** Valide la signature et l’expiration du token **/
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = parseClaims(token);
            String username = claims.getSubject();
            return username.equals(userDetails.getUsername())
                   && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            // signature invalide, token mal formé, expiré, etc.
            return false;
        }
    }

    /** Parse et renvoie les Claims contenus dans le token **/
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
