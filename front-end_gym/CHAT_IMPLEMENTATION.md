# Implémentation du Système de Chat Coach/Sportif

## Vue d'ensemble

Ce document décrit l'implémentation complète du système de chat en temps réel entre les coaches et les sportifs dans l'application Gym Coach.

## Architecture

### 1. API REST (Spring Boot)

- **Authentification** : Utilise le système JWT existant
- **Endpoints** :
  - `GET /api/chat/conversations` - Liste des conversations
  - `GET /api/chat/conversation/{otherUserId}` - Messages d'une conversation
  - `POST /api/chat/send` - Envoyer un message
  - `PUT /api/chat/conversation/{chatId}/read` - Marquer comme lu
  - `GET /api/chat/unread-count` - Compter les messages non lus

### 2. WebSocket (STOMP)

- **Connexion** : `ws://localhost:8080/ws`
- **Authentification** : JWT dans les headers de connexion
- **Topics** :
  - `/user/queue/messages` - Messages privés
  - `/user/queue/typing` - Indicateurs de frappe
  - `/user/queue/read` - Notifications de lecture

## Structure des Fichiers

```
src/
├── api/
│   └── chat.ts                    # API REST pour le chat
├── services/
│   └── WebSocketService.ts        # Service WebSocket
├── components/
│   └── chat/
│       ├── ChatList.tsx           # Liste des conversations
│       ├── ChatList.css
│       ├── ChatWindow.tsx         # Fenêtre de chat
│       ├── ChatWindow.css
│       ├── ChatPage.tsx           # Page principale
│       └── ChatPage.css
└── pages/
    └── chat/
        └── ChatPage.tsx           # Route de la page
```

## Fonctionnalités Implémentées

### 1. Liste des Conversations (ChatList)

- ✅ Affichage des conversations avec nom, dernier message, timestamp
- ✅ Compteur de messages non lus
- ✅ Sélection de conversation
- ✅ État de chargement et gestion d'erreurs
- ✅ Design responsive

### 2. Fenêtre de Chat (ChatWindow)

- ✅ Historique des messages
- ✅ Envoi de messages (REST + WebSocket)
- ✅ Indicateurs de frappe
- ✅ Statut de lecture des messages
- ✅ Scroll automatique
- ✅ Gestion des erreurs

### 3. WebSocket Service

- ✅ Connexion automatique avec JWT
- ✅ Reconnexion automatique
- ✅ Gestion des événements (message, typing, read)
- ✅ Callbacks configurables
- ✅ Gestion des erreurs

### 4. Intégration

- ✅ Route `/chat` ajoutée au routeur
- ✅ Boutons d'accès dans les dashboards
- ✅ Authentification requise
- ✅ Responsive design

## Utilisation

### 1. Accès au Chat

- **Coach** : Dashboard → "Chat avec les sportifs"
- **Sportif** : Dashboard → "Chat"

### 2. Navigation

- Clic sur une conversation dans la liste
- Messages s'affichent dans la fenêtre de droite
- Indicateur de statut WebSocket en bas à droite

### 3. Fonctionnalités

- **Envoi** : Tapez et appuyez sur Entrée ou cliquez "Envoyer"
- **Typing** : Indicateur automatique pendant la frappe
- **Lecture** : Messages marqués comme lus automatiquement
- **Notifications** : Badges sur les conversations non lues

## Configuration Backend Requise

### Endpoints REST

```java
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @GetMapping("/conversations")
    public List<Conversation> getConversations();

    @GetMapping("/conversation/{otherUserId}")
    public List<Message> getConversationMessages(@PathVariable Long otherUserId);

    @PostMapping("/send")
    public Message sendMessage(@RequestBody SendMessageRequest request);

    @PutMapping("/conversation/{chatId}/read")
    public void markAsRead(@PathVariable Long chatId);

    @GetMapping("/unread-count")
    public int getUnreadCount();
}
```

### Configuration WebSocket

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
               .setAllowedOrigins("http://localhost:5173")
               .withSockJS();
    }
}
```

## Sécurité

### Authentification

- JWT requis pour toutes les requêtes REST
- JWT dans les headers WebSocket
- Vérification des permissions utilisateur

### Autorisation

- Un utilisateur ne peut voir que ses propres conversations
- Validation côté serveur des IDs utilisateur
- Protection contre l'accès non autorisé

## Gestion des Erreurs

### REST API

- 401 : Token expiré/invalide → Redirection login
- 403 : Accès refusé → Message d'erreur
- 500 : Erreur serveur → Retry automatique

### WebSocket

- Connexion perdue → Reconnexion automatique
- Erreur de parsing → Log et ignore
- Timeout → Retry avec backoff

## Performance

### Optimisations

- Pagination des messages (à implémenter)
- Debounce pour les événements typing
- Lazy loading des conversations
- Cache des messages récents

### Monitoring

- Indicateur de statut WebSocket
- Logs de connexion/déconnexion
- Métriques de performance

## Tests

### Tests Manuels

1. Connexion avec différents rôles
2. Envoi/réception de messages
3. Indicateurs de frappe
4. Statut de lecture
5. Reconnexion WebSocket
6. Responsive design

### Tests Automatisés (à implémenter)

- Tests unitaires des composants
- Tests d'intégration API
- Tests WebSocket
- Tests E2E

## Déploiement

### Variables d'Environnement

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

### Build

```bash
npm run build
```

## Maintenance

### Logs

- Console logs pour debug
- Erreurs WebSocket
- Performance API

### Monitoring

- Statut des connexions WebSocket
- Temps de réponse API
- Utilisation mémoire

## Évolutions Futures

### Fonctionnalités

- [ ] Envoi de fichiers/images
- [ ] Messages vocaux
- [ ] Notifications push
- [ ] Emojis et réactions
- [ ] Messages éphémères
- [ ] Groupes de chat

### Améliorations

- [ ] Pagination des messages
- [ ] Recherche dans les conversations
- [ ] Export des conversations
- [ ] Thèmes personnalisables
- [ ] Mode sombre

## Support

Pour toute question ou problème :

1. Vérifier les logs console
2. Contrôler la connexion WebSocket
3. Vérifier l'authentification JWT
4. Tester les endpoints API
