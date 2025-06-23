// websocket-example.js
// Exemple d'utilisation du système WebSocket pour le chat

// 1. Connexion WebSocket
const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);

// Configuration de la connexion
stompClient.connect(
  { Authorization: "Bearer " + JWT_TOKEN }, // JWT token dans les headers
  onConnect,
  onError
);

// 2. Callbacks de connexion
function onConnect() {
  console.log("WebSocket connecté");

  // S'abonner aux topics
  subscribeToTopics();

  // Exemple d'envoi d'un message
  sendMessage();
}

function onError(error) {
  console.error("Erreur WebSocket:", error);
}

// 3. Souscriptions aux topics
function subscribeToTopics() {
  // Messages privés
  stompClient.subscribe("/user/queue/messages", (message) => {
    const chatMessage = JSON.parse(message.body);
    console.log("Message reçu:", chatMessage);
    displayMessage(chatMessage);
  });

  // Indicateurs de frappe
  stompClient.subscribe("/user/queue/typing", (message) => {
    const data = JSON.parse(message.body);
    console.log("Typing reçu:", data);
    showTypingIndicator(data.userId, data.isTyping);
  });

  // Notifications de lecture
  stompClient.subscribe("/user/queue/read", (message) => {
    const data = JSON.parse(message.body);
    console.log("Read reçu:", data);
    markMessageAsRead(data.messageId);
  });
}

// 4. Envoi d'événements
function sendMessage() {
  const chatMessage = {
    type: "MESSAGE",
    senderId: currentUserId,
    receiverId: otherUserId,
    content: "Hello!",
    timestamp: new Date().toISOString(),
  };

  stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
}

function sendTyping(isTyping) {
  const typingEvent = {
    type: "TYPING",
    userId: currentUserId,
    receiverId: otherUserId,
    isTyping: isTyping,
    timestamp: new Date().toISOString(),
  };

  stompClient.send("/app/chat.typing", {}, JSON.stringify(typingEvent));
}

function sendRead(messageId) {
  const readEvent = {
    type: "READ",
    messageId: messageId,
    receiverId: otherUserId,
    timestamp: new Date().toISOString(),
  };

  stompClient.send("/app/chat.read", {}, JSON.stringify(readEvent));
}

// 5. Gestion des événements côté client
function displayMessage(chatMessage) {
  // Afficher le message dans l'interface
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.innerHTML = `
    <div class="message-content">
      <p>${chatMessage.content}</p>
      <span class="message-time">${new Date(
        chatMessage.timestamp
      ).toLocaleTimeString()}</span>
    </div>
  `;

  document.querySelector(".messages-container").appendChild(messageElement);
  scrollToBottom();
}

function showTypingIndicator(userId, isTyping) {
  const typingElement = document.querySelector(".typing-indicator");
  if (isTyping) {
    typingElement.textContent = "Utilisateur est en train d'écrire...";
    typingElement.style.display = "block";
  } else {
    typingElement.style.display = "none";
  }
}

function markMessageAsRead(messageId) {
  // Marquer visuellement le message comme lu
  const messageElement = document.querySelector(
    `[data-message-id="${messageId}"]`
  );
  if (messageElement) {
    messageElement.classList.add("read");
  }
}

function scrollToBottom() {
  const container = document.querySelector(".messages-container");
  container.scrollTop = container.scrollHeight;
}

// 6. Gestion de la déconnexion
function disconnect() {
  if (stompClient) {
    stompClient.disconnect();
  }
}

// 7. Exemple d'utilisation avec gestion des erreurs
document.addEventListener("DOMContentLoaded", () => {
  // Connexion automatique au chargement de la page
  if (JWT_TOKEN) {
    stompClient.connect(
      { Authorization: "Bearer " + JWT_TOKEN },
      onConnect,
      onError
    );
  }

  // Gestion de la fermeture de la page
  window.addEventListener("beforeunload", () => {
    disconnect();
  });
});

// 8. Reconnexion automatique en cas de perte de connexion
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function reconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(
      `Tentative de reconnexion ${reconnectAttempts}/${maxReconnectAttempts}`
    );

    setTimeout(() => {
      stompClient.connect(
        { Authorization: "Bearer " + JWT_TOKEN },
        () => {
          console.log("Reconnexion réussie");
          reconnectAttempts = 0;
          subscribeToTopics();
        },
        (error) => {
          console.error("Échec de reconnexion:", error);
          reconnect();
        }
      );
    }, 3000); // Attendre 3 secondes avant de réessayer
  } else {
    console.error("Nombre maximum de tentatives de reconnexion atteint");
  }
}

// 9. Exemple d'intégration avec React
/*
// Dans un composant React
useEffect(() => {
  // Connexion WebSocket
  webSocketService.connect(user.token);
  
  // Configuration des callbacks
  webSocketService.setCallbacks({
    onMessageReceived: (message) => {
      setMessages(prev => [...prev, message]);
    },
    onTypingReceived: (userId, isTyping) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    },
    onReadReceived: (messageId) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    }
  });

  return () => {
    webSocketService.disconnect();
  };
}, [user.token]);
*/
