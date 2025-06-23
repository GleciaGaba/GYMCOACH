import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Conversation } from "../../api/chat";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ChatStatus from "./ChatStatus";
import webSocketService from "../../services/WebSocketService";
import "./ChatPage.css";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Mode mock activé - WebSocket désactivé
  useEffect(() => {
    console.log("Mode mock activé - WebSocket désactivé pour les tests");
    setIsWebSocketConnected(true); // Simuler une connexion réussie
    setLastError(null);

    // En mode réel, on utiliserait :
    /*
    if (user?.token) {
      webSocketService.connect(user.token);
      webSocketService.setCallbacks({
        onConnected: () => {
          console.log('WebSocket connecté dans ChatPage');
          setIsWebSocketConnected(true);
          setConnectionAttempts(0);
          setLastError(null);
        },
        onDisconnected: () => {
          console.log('WebSocket déconnecté dans ChatPage');
          setIsWebSocketConnected(false);
        },
        onError: (error) => {
          console.error('Erreur WebSocket dans ChatPage:', error);
          setIsWebSocketConnected(false);
          setLastError(error.message || 'Erreur de connexion');
        },
        onReconnecting: (attempt) => {
          console.log(`Tentative de reconnexion ${attempt}`);
          setConnectionAttempts(attempt);
        }
      });
    }
    */

    return () => {
      // Cleanup si nécessaire
    };
  }, [user?.token]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStatusClick = () => {
    if (!isWebSocketConnected && user?.token) {
      // En mode réel, on reconnecterait
      console.log("Tentative de reconnexion WebSocket");
    }
  };

  const handleOfflineModeChange = (offline: boolean) => {
    setIsOfflineMode(offline);
  };

  return (
    <div className="chat-page">
      {/* Notification de mode hors ligne */}
      {isOfflineMode && (
        <div className="offline-notification">
          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-wifi-off me-2"></i>
            <strong>Mode hors ligne :</strong> Vous utilisez actuellement les
            données de démonstration.
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="chat-sidebar">
          <ChatList
            onConversationSelect={handleConversationSelect}
            selectedConversationId={selectedConversation?.id}
            onOfflineModeChange={handleOfflineModeChange}
          />
        </div>

        <div className="chat-main">
          <ChatWindow conversation={selectedConversation} />
        </div>
      </div>

      {/* Indicateur de statut WebSocket amélioré */}
      <div onClick={handleStatusClick}>
        <ChatStatus
          isConnected={isWebSocketConnected}
          lastError={lastError || undefined}
          connectionAttempts={connectionAttempts}
        />
      </div>
    </div>
  );
};

export default ChatPage;
