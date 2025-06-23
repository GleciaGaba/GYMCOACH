# 🚀 Guide d'intégration Frontend - Chat Coach/Sportif

## 📋 Résumé du projet

Votre backend Spring Boot est maintenant configuré avec :

- ✅ **API REST** pour la gestion des conversations et messages
- ✅ **WebSocket** pour la communication en temps réel
- ✅ **CORS** configuré pour tous les ports de développement
- ✅ **Authentification JWT** sécurisée
- ✅ **Base de données MongoDB** pour les messages
- ✅ **Tests complets** validés

---

## 🛠️ Installation des dépendances

### **Pour React/Vue.js :**

```bash
npm install sockjs-client @stomp/stompjs
```

### **Pour Vanilla JavaScript :**

```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.0.0/bundles/stomp.umd.min.js"></script>
```

---

## 🔧 Configuration CORS

Le backend accepte maintenant les requêtes depuis :

- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternative)
- `http://localhost:5175` (Vite alternative)
- `http://localhost:5176` (Vite alternative)
- `http://localhost:5177` (Vite alternative)
- `http://localhost:3000` (React default)
- `http://localhost:8080` (Spring Boot)

---

## 📡 Endpoints API REST

### **Base URL :** `http://localhost:8080`

| Méthode | Endpoint                               | Description                 | Headers requis                |
| ------- | -------------------------------------- | --------------------------- | ----------------------------- |
| `GET`   | `/api/chat/conversations`              | Liste des conversations     | `Authorization: Bearer <JWT>` |
| `GET`   | `/api/chat/conversation/{otherUserId}` | Messages d'une conversation | `Authorization: Bearer <JWT>` |
| `POST`  | `/api/chat/send`                       | Envoyer un message          | `Authorization: Bearer <JWT>` |
| `PUT`   | `/api/chat/conversation/{chatId}/read` | Marquer comme lu            | `Authorization: Bearer <JWT>` |
| `GET`   | `/api/chat/unread-count`               | Nombre de messages non lus  | `Authorization: Bearer <JWT>` |
| `GET`   | `/api/chat/unread-messages`            | Messages non lus            | `Authorization: Bearer <JWT>` |

### **Exemple d'utilisation :**

```javascript
// Récupérer les conversations
const response = await fetch("http://localhost:8080/api/chat/conversations", {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  },
});

// Envoyer un message
const response = await fetch("http://localhost:8080/api/chat/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    content: "Bonjour coach !",
    receiverId: "2",
  }),
});
```

---

## 🔌 Configuration WebSocket

### **URL de connexion :** `http://localhost:8080/ws`

### **Destinations de souscription :**

- `/user/queue/messages` - Messages privés reçus
- `/user/queue/typing` - Indicateurs de frappe
- `/user/queue/read` - Notifications de lecture

### **Destinations d'envoi :**

- `/app/chat.sendMessage` - Envoyer un message
- `/app/chat.typing` - Indicateur de frappe
- `/app/chat.read` - Marquer comme lu
- `/app/chat.addUser` - Connexion utilisateur
- `/app/chat.disconnect` - Déconnexion

### **Exemple de connexion :**

```javascript
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: `Bearer ${jwtToken}` },
  (frame) => {
    console.log("Connecté au WebSocket");

    // S'abonner aux messages
    stompClient.subscribe("/user/queue/messages", (message) => {
      const receivedMessage = JSON.parse(message.body);
      console.log("Nouveau message:", receivedMessage);
    });
  },
  (error) => {
    console.error("Erreur WebSocket:", error);
  }
);
```

---

## 🧪 Composant de test

Utilisez le fichier `ChatTestComponent.jsx` fourni pour tester rapidement :

1. Copiez le composant dans votre projet React
2. Installez les dépendances : `npm install sockjs-client @stomp/stompjs`
3. Collez votre JWT token et votre User ID
4. Testez les fonctionnalités une par une

---

## 🎯 Implémentation recommandée

### **1. Service de chat (chatService.js)**

```javascript
class ChatService {
  constructor(jwtToken) {
    this.jwtToken = jwtToken;
    this.baseUrl = "http://localhost:8080/api/chat";
    this.stompClient = null;
  }

  async getConversations() {
    const response = await fetch(`${this.baseUrl}/conversations`, {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async sendMessage(content, receiverId) {
    const response = await fetch(`${this.baseUrl}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, receiverId }),
    });
    return response.json();
  }

  connectWebSocket(onMessageReceived, onTypingReceived) {
    const socket = new SockJS("http://localhost:8080/ws");
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      { Authorization: `Bearer ${this.jwtToken}` },
      () => {
        this.stompClient.subscribe("/user/queue/messages", (message) => {
          onMessageReceived(JSON.parse(message.body));
        });

        this.stompClient.subscribe("/user/queue/typing", (message) => {
          onTypingReceived(JSON.parse(message.body));
        });
      }
    );
  }
}
```

### **2. Hook React (useChat.js)**

```javascript
import { useState, useEffect, useRef } from "react";

export const useChat = (jwtToken, userId) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const chatService = useRef(null);

  useEffect(() => {
    if (jwtToken) {
      chatService.current = new ChatService(jwtToken);
      chatService.current.connectWebSocket(
        (message) => setMessages((prev) => [...prev, message]),
        (typing) => console.log("Typing:", typing)
      );
      setIsConnected(true);
    }
  }, [jwtToken]);

  const sendMessage = async (content, receiverId) => {
    if (chatService.current) {
      const message = await chatService.current.sendMessage(
        content,
        receiverId
      );
      setMessages((prev) => [...prev, message]);
    }
  };

  return { conversations, messages, sendMessage, isConnected };
};
```

---

## 🚨 Gestion des erreurs

### **Erreurs CORS :**

- Vérifiez que le backend tourne sur le port 8080
- Vérifiez que votre frontend utilise un port autorisé
- Redémarrez le backend après modification de la config CORS

### **Erreurs WebSocket :**

- Vérifiez que le JWT token est valide
- Vérifiez les logs du backend pour les erreurs d'authentification
- Implémentez une logique de reconnexion automatique

### **Erreurs d'authentification :**

- Vérifiez que le token JWT n'est pas expiré
- Vérifiez que le header `Authorization` est bien envoyé
- Implémentez un refresh token si nécessaire

---

## 📱 Interface utilisateur recommandée

### **Composants à créer :**

1. **ChatList** - Liste des conversations avec aperçu
2. **ChatWindow** - Fenêtre de chat avec historique
3. **MessageInput** - Zone de saisie avec indicateur de frappe
4. **TypingIndicator** - "X est en train d'écrire..."
5. **UnreadBadge** - Badge pour messages non lus

### **Fonctionnalités à implémenter :**

- ✅ Affichage des conversations triées par dernier message
- ✅ Envoi/réception de messages en temps réel
- ✅ Indicateur de frappe
- ✅ Marquage automatique comme lu
- ✅ Notifications pour nouveaux messages
- ✅ Gestion des erreurs de connexion

---

## 🔍 Debug et tests

### **Outils recommandés :**

- **Postman** pour tester l'API REST
- **DevTools** du navigateur pour vérifier les requêtes réseau
- **Console** pour les logs WebSocket
- **Composant de test** fourni pour validation rapide

### **Tests à effectuer :**

1. ✅ Connexion WebSocket réussie
2. ✅ Récupération des conversations via REST
3. ✅ Envoi de message via REST
4. ✅ Réception de message en temps réel
5. ✅ Indicateur de frappe fonctionnel
6. ✅ Marquage comme lu automatique

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez le guide de test CORS (`CORS_TEST_GUIDE.md`)
2. Vérifiez les logs du backend Spring Boot
3. Utilisez le composant de test pour isoler le problème
4. Contactez l'équipe backend pour assistance

---

**🎉 Votre système de chat est prêt à être intégré !**
