package com.gymcoach.backend_gym.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint pour se connecter au WebSocket avec CORS configuré
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174", 
                    "http://localhost:5175",
                    "http://localhost:5176",
                    "http://localhost:5177",
                    "http://localhost:3000",
                    "http://localhost:8080"
                )
                .withSockJS(); // Support pour les navigateurs qui ne supportent pas WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Préfixe pour les messages envoyés par le client
        registry.setApplicationDestinationPrefixes("/app");
        
        // Préfixe pour les messages envoyés par le serveur (broker)
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        
        // Préfixe pour les messages privés (un-à-un)
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Ajouter l'intercepteur d'authentification
        registration.interceptors(webSocketAuthInterceptor);
    }
} 