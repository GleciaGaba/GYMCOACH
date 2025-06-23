import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatTestComponent = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [userId, setUserId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Connexion WebSocket
  const connectWebSocket = () => {
    if (!jwtToken) {
      addLog("❌ JWT Token requis pour WebSocket");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect(
      { Authorization: `Bearer ${jwtToken}` },
      (frame) => {
        addLog("✅ WebSocket connecté");
        setIsConnected(true);
        setStompClient(client);

        // S'abonner aux messages privés
        client.subscribe("/user/queue/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          addLog(`📨 Message reçu: ${receivedMessage.content}`);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // S'abonner aux indicateurs de frappe
        client.subscribe("/user/queue/typing", (message) => {
          const typingEvent = JSON.parse(message.body);
          addLog(`⌨️ ${typingEvent.senderId} est en train d'écrire...`);
        });

        // Notifier la connexion
        client.send(
          "/app/chat.addUser",
          {},
          JSON.stringify({
            type: "JOIN",
            senderId: userId,
            timestamp: new Date(),
          })
        );
      },
      (error) => {
        addLog(`❌ Erreur WebSocket: ${error}`);
        setIsConnected(false);
      }
    );
  };

  // Déconnexion WebSocket
  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.disconnect();
      setIsConnected(false);
      addLog("🔌 WebSocket déconnecté");
    }
  };

  // Récupérer les conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/chat/conversations",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        addLog(`✅ ${data.length} conversations récupérées`);
      } else {
        addLog(`❌ Erreur API: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Erreur réseau: ${error.message}`);
    }
  };

  // Envoyer un message via REST
  const sendMessageRest = async () => {
    if (!newMessage || !receiverId) {
      addLog("❌ Message et destinataire requis");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/chat/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: receiverId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Message envoyé via REST: ${data.content}`);
        setNewMessage("");
      } else {
        addLog(`❌ Erreur envoi: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Erreur réseau: ${error.message}`);
    }
  };

  // Envoyer un message via WebSocket
  const sendMessageWebSocket = () => {
    if (!stompClient || !isConnected) {
      addLog("❌ WebSocket non connecté");
      return;
    }

    if (!newMessage || !receiverId) {
      addLog("❌ Message et destinataire requis");
      return;
    }

    const message = {
      type: "MESSAGE",
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
      timestamp: new Date(),
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
    addLog(`📤 Message envoyé via WebSocket: ${newMessage}`);
    setNewMessage("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🧪 Test Chat API & WebSocket</h1>

      {/* Configuration */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>⚙️ Configuration</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>JWT Token: </label>
          <input
            type="text"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="Collez votre JWT token ici"
            style={{ width: "400px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>User ID: </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Votre ID utilisateur"
            style={{ width: "200px" }}
          />
        </div>
      </div>

      {/* Contrôles WebSocket */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>🔌 WebSocket</h3>
        <button
          onClick={connectWebSocket}
          disabled={isConnected}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Connecter WebSocket
        </button>
        <button
          onClick={disconnectWebSocket}
          disabled={!isConnected}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Déconnecter WebSocket
        </button>
        <span style={{ color: isConnected ? "green" : "red" }}>
          {isConnected ? "✅ Connecté" : "❌ Déconnecté"}
        </span>
      </div>

      {/* Test API REST */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>🌐 API REST</h3>
        <button
          onClick={fetchConversations}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Récupérer Conversations
        </button>
        <div style={{ marginTop: "10px" }}>
          <strong>Conversations ({conversations.length}):</strong>
          <ul>
            {conversations.map((conv, index) => (
              <li key={index}>
                {conv.otherParticipantName} - {conv.lastMessage}
                {conv.unreadCount > 0 && ` (${conv.unreadCount} non lus)`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Envoi de messages */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>💬 Envoi de messages</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>Destinataire ID: </label>
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="ID du destinataire"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Message: </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message"
            style={{ width: "300px" }}
          />
        </div>
        <button
          onClick={sendMessageRest}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Envoyer via REST
        </button>
        <button
          onClick={sendMessageWebSocket}
          disabled={!isConnected}
          style={{ marginRight: "10px", padding: "5px 10px" }}
        >
          Envoyer via WebSocket
        </button>
      </div>

      {/* Messages reçus */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>📨 Messages reçus ({messages.length})</h3>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #eee",
            padding: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "5px",
                padding: "5px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <strong>{msg.senderId}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div style={{ padding: "10px", border: "1px solid #ccc" }}>
        <h3>📋 Logs</h3>
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #eee",
            padding: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {logs.map((log, index) => (
            <div
              key={index}
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatTestComponent;
