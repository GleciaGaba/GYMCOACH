// Exemple d'utilisation WebSocket pour le chat en temps réel
// À intégrer dans votre frontend (React, Vue.js, etc.)

// Configuration WebSocket
const SOCKET_URL = "http://localhost:8080/ws";
const JWT_TOKEN = "your-jwt-token-here"; // Récupérer depuis localStorage ou autre

// Connexion WebSocket avec STOMP
let stompClient = null;

function connectWebSocket() {
  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);

  // Headers avec le token JWT pour l'authentification
  const headers = {
    Authorization: `Bearer ${JWT_TOKEN}`,
  };

  stompClient.connect(
    headers,
    // Callback de succès
    function (frame) {
      console.log("Connecté au WebSocket:", frame);

      // S'abonner aux messages privés
      stompClient.subscribe("/user/queue/messages", function (message) {
        const receivedMessage = JSON.parse(message.body);
        handleIncomingMessage(receivedMessage);
      });

      // S'abonner aux indicateurs de frappe
      stompClient.subscribe("/user/queue/typing", function (message) {
        const typingEvent = JSON.parse(message.body);
        handleTypingIndicator(typingEvent);
      });

      // S'abonner aux notifications de lecture
      stompClient.subscribe("/user/queue/read", function (message) {
        const readEvent = JSON.parse(message.body);
        handleReadNotification(readEvent);
      });

      // Notifier que l'utilisateur est connecté
      const currentUserId = getCurrentUserId(); // Récupérer depuis votre état
      stompClient.send(
        "/app/chat.addUser",
        {},
        JSON.stringify({
          type: "JOIN",
          senderId: currentUserId,
          timestamp: new Date(),
        })
      );
    },
    // Callback d'erreur
    function (error) {
      console.error("Erreur de connexion WebSocket:", error);
    }
  );
}

// Envoyer un message
function sendMessage(content, receiverId) {
  if (stompClient && stompClient.connected) {
    const currentUserId = getCurrentUserId();
    const message = {
      type: "MESSAGE",
      senderId: currentUserId,
      receiverId: receiverId,
      content: content,
      timestamp: new Date(),
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
  }
}

// Envoyer un indicateur de frappe
function sendTypingIndicator(receiverId, isTyping) {
  if (stompClient && stompClient.connected) {
    const currentUserId = getCurrentUserId();
    const typingEvent = {
      type: "TYPING",
      senderId: currentUserId,
      receiverId: receiverId,
      content: isTyping ? "typing..." : "",
      timestamp: new Date(),
    };

    stompClient.send("/app/chat.typing", {}, JSON.stringify(typingEvent));
  }
}

// Marquer les messages comme lus
function markMessagesAsRead(chatId, senderId) {
  if (stompClient && stompClient.connected) {
    const currentUserId = getCurrentUserId();
    const readEvent = {
      type: "READ",
      senderId: currentUserId,
      receiverId: senderId,
      chatId: chatId,
      timestamp: new Date(),
    };

    stompClient.send("/app/chat.read", {}, JSON.stringify(readEvent));
  }
}

// Gérer les messages entrants
function handleIncomingMessage(message) {
  console.log("Nouveau message reçu:", message);
  // Mettre à jour l'interface utilisateur
  // Exemple: ajouter le message à la liste des messages
  displayMessage(message);
}

// Gérer les indicateurs de frappe
function handleTypingIndicator(typingEvent) {
  console.log("Indicateur de frappe:", typingEvent);
  // Afficher "X est en train d'écrire..."
  if (typingEvent.content === "typing...") {
    showTypingIndicator(typingEvent.senderId);
  } else {
    hideTypingIndicator(typingEvent.senderId);
  }
}

// Gérer les notifications de lecture
function handleReadNotification(readEvent) {
  console.log("Messages lus:", readEvent);
  // Mettre à jour le statut des messages (marquer comme lus)
  markMessagesAsReadInUI(readEvent.chatId);
}

// Déconnexion
function disconnectWebSocket() {
  if (stompClient) {
    const currentUserId = getCurrentUserId();
    stompClient.send(
      "/app/chat.disconnect",
      {},
      JSON.stringify({
        type: "LEAVE",
        senderId: currentUserId,
        timestamp: new Date(),
      })
    );
    stompClient.disconnect();
  }
}

// Fonctions utilitaires (à adapter selon votre framework)
function getCurrentUserId() {
  // Récupérer l'ID utilisateur depuis votre état d'application
  return localStorage.getItem("userId") || "current-user-id";
}

function displayMessage(message) {
  // Implémenter l'affichage du message dans votre UI
  console.log("Afficher message:", message);
}

function showTypingIndicator(userId) {
  // Afficher l'indicateur de frappe
  console.log("Utilisateur en train d'écrire:", userId);
}

function hideTypingIndicator(userId) {
  // Masquer l'indicateur de frappe
  console.log("Utilisateur a arrêté d'écrire:", userId);
}

function markMessagesAsReadInUI(chatId) {
  // Marquer les messages comme lus dans l'interface
  console.log("Messages marqués comme lus pour le chat:", chatId);
}

// Exemple d'utilisation
document.addEventListener("DOMContentLoaded", function () {
  // Se connecter au WebSocket au chargement de la page
  connectWebSocket();

  // Exemple d'envoi de message
  document.getElementById("send-button").addEventListener("click", function () {
    const content = document.getElementById("message-input").value;
    const receiverId = document.getElementById("receiver-id").value;

    if (content && receiverId) {
      sendMessage(content, receiverId);
      document.getElementById("message-input").value = "";
    }
  });

  // Exemple d'indicateur de frappe
  document
    .getElementById("message-input")
    .addEventListener("input", function () {
      const receiverId = document.getElementById("receiver-id").value;
      if (receiverId) {
        sendTypingIndicator(receiverId, true);
      }
    });
});

// Nettoyer à la fermeture de la page
window.addEventListener("beforeunload", function () {
  disconnectWebSocket();
});
