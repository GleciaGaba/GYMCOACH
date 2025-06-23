package com.gymcoach.backend_gym.config;

import com.gymcoach.backend_gym.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorization = accessor.getNativeHeader("Authorization");
            
            if (authorization != null && !authorization.isEmpty()) {
                String token = authorization.get(0).replace("Bearer ", "");
                
                try {
                    // Valider le token JWT
                    String email = jwtUtils.getUsernameFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    
                    if (jwtUtils.validateToken(token, userDetails)) {
                        // Ajouter l'utilisateur à la session WebSocket
                        accessor.setUser(() -> email);
                        log.info("Utilisateur authentifié pour WebSocket: {}", email);
                    } else {
                        log.warn("Token JWT invalide pour WebSocket");
                        return null; // Rejeter la connexion
                    }
                } catch (Exception e) {
                    log.error("Erreur d'authentification WebSocket: {}", e.getMessage());
                    return null; // Rejeter la connexion
                }
            } else {
                log.warn("Token d'autorisation manquant pour WebSocket");
                return null; // Rejeter la connexion
            }
        }
        
        return message;
    }
} 