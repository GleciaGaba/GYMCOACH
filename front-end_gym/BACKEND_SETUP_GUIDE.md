# Guide de Configuration Backend - Système de Chat

## 🚀 **Étapes de Configuration**

### **1. Ajouter les Dépendances Maven**

Dans votre `pom.xml`, ajoutez ces dépendances :

```xml
<!-- WebSocket Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Web Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Security (si pas déjà présent) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JPA (si pas déjà présent) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### **2. Créer les Classes de Configuration**

#### **CorsConfig.java**

```java
package com.gymcoach.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",
                    "http://localhost:5176"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### **WebSocketConfig.java**

```java
package com.gymcoach.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/user");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
               .setAllowedOrigins(
                   "http://localhost:5173",
                   "http://localhost:5174",
                   "http://localhost:5175",
                   "http://localhost:5176"
               )
               .withSockJS();
    }
}
```

### **3. Créer les Modèles**

#### **Message.java**

```java
package com.gymcoach.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private boolean read = false;

    // Constructeurs, Getters, Setters
}
```

#### **Conversation.java**

```java
package com.gymcoach.model;

import java.time.LocalDateTime;

public class Conversation {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageTimestamp;
    private int unreadCount;

    // Constructeurs, Getters, Setters
}
```

#### **ChatMessage.java**

```java
package com.gymcoach.model;

public class ChatMessage {
    private String type;
    private Long senderId;
    private Long receiverId;
    private String content;
    private String timestamp;

    // Constructeurs, Getters, Setters
}
```

### **4. Créer le Service**

#### **ChatService.java**

```java
package com.gymcoach.service;

import com.gymcoach.model.Conversation;
import com.gymcoach.model.Message;
import com.gymcoach.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Conversation> getConversations() {
        // Implémentation pour récupérer les conversations
        return null; // À implémenter selon votre logique métier
    }

    public List<Message> getConversationMessages(Long otherUserId) {
        // Implémentation pour récupérer les messages
        return null; // À implémenter selon votre logique métier
    }

    public Message sendMessage(String content, Long receiverId) {
        // Implémentation pour envoyer un message
        return null; // À implémenter selon votre logique métier
    }

    public void markAsRead(Long chatId) {
        // Implémentation pour marquer comme lu
    }

    public int getUnreadCount() {
        // Implémentation pour compter les messages non lus
        return 0; // À implémenter selon votre logique métier
    }

    public void markMessageAsRead(Long messageId) {
        // Implémentation pour marquer un message comme lu
    }
}
```

### **5. Créer le Contrôleur**

Voir le fichier `backend-chat-controller.java` créé précédemment.

### **6. Configuration Security (Optionnel)**

Si vous utilisez Spring Security, ajoutez cette configuration :

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

## 🧪 **Test de Validation**

### **1. Démarrer le Backend**

```bash
./mvnw spring-boot:run
```

### **2. Tester les Endpoints**

```bash
# Test de base
curl http://localhost:8080/api/chat/conversations

# Test WebSocket
curl http://localhost:8080/ws/info
```

### **3. Vérifier les Logs**

- Le serveur doit démarrer sur le port 8080
- Pas d'erreurs CORS dans les logs
- WebSocket endpoint accessible

## 🔧 **Dépannage**

### **Erreurs CORS**

- Vérifier que CorsConfig est bien chargé
- Vérifier les origines autorisées
- Redémarrer le serveur après modification

### **Erreurs WebSocket**

- Vérifier que WebSocketConfig est bien chargé
- Vérifier les dépendances Maven
- Vérifier les logs de démarrage

### **Erreurs de Base de Données**

- Vérifier la configuration JPA
- Vérifier les entités et repositories
- Vérifier la connexion à la base

## 📝 **Notes Importantes**

1. **Adaptez les packages** selon votre structure de projet
2. **Implémentez la logique métier** dans ChatService
3. **Ajoutez la gestion d'erreurs** appropriée
4. **Testez chaque endpoint** individuellement
5. **Vérifiez la sécurité** selon vos besoins

## 🚀 **Prochaines Étapes**

1. Implémenter la logique métier dans ChatService
2. Créer les repositories nécessaires
3. Ajouter la gestion d'erreurs
4. Tester avec le frontend
5. Optimiser les performances
