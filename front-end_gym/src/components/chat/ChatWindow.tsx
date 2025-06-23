import React, { useState, useEffect, useRef, useCallback } from "react";
import { Message, Conversation } from "../../api/chat";
import type { ConversationMessagesResponse } from "../../api/chat";
import {
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
} from "../../api/chat";
import { useAuth } from "../../contexts/AuthContext";
import webSocketService from "../../services/WebSocketService";
import "./ChatWindow.css";

interface ChatWindowProps {
  conversation: Conversation | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les messages de la conversation
  useEffect(() => {
    if (conversation) {
      loadMessages();
      markConversationAsRead();
    }
  }, [conversation]);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Configuration des callbacks WebSocket (désactivé en mode mock)
  useEffect(() => {
    // En mode mock, on n'utilise pas WebSocket
    console.log("Mode mock activé - WebSocket désactivé");

    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  const loadMessages = async () => {
    if (!conversation) return;

    try {
      setLoading(true);
      const data = (await getConversationMessages(conversation.otherUserId)) as
        | Message[]
        | ConversationMessagesResponse;
      if (
        data &&
        Array.isArray((data as ConversationMessagesResponse).messages)
      ) {
        setMessages((data as ConversationMessagesResponse).messages);
      } else if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async () => {
    if (!conversation) return;

    try {
      await markMessagesAsRead(conversation.id);
      // Mettre à jour les messages locaux pour marquer comme lus
      setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // Envoyer via API
      await sendMessage(messageContent, conversation.otherUserId);
      // Recharge la liste complète des messages depuis l'API
      await loadMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // Remettre le message dans l'input en cas d'erreur
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // En mode mock, on simule juste l'indicateur de frappe
    if (conversation && user) {
      // Annuler le timeout précédent
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Simuler l'indicateur de frappe
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.add(user.id);
        return newSet;
      });

      // Arrêter l'événement de frappe après 2 secondes
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(user.id);
          return newSet;
        });
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!conversation) {
    return (
      <div className="chat-window">
        <div className="chat-window-empty">
          <p>Sélectionnez une conversation pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-user-info">
          <div className="avatar-placeholder">
            {conversation.otherUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5>{conversation.otherUserName}</h5>
            {typingUsers.has(conversation.otherUserId) && (
              <small className="typing-indicator">
                {conversation.otherUserName} est en train d'écrire...
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="chat-window-messages">
        {loading ? (
          <div className="chat-window-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.senderId === user?.id ? "sent" : "received"
                }`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatTimestamp(message.timestamp)}
                    {message.senderId === user?.id && (
                      <span className="message-status">
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="chat-window-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Tapez votre message..."
          disabled={sending}
          className="form-control"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="btn btn-primary"
        >
          {sending ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Envoi...</span>
            </div>
          ) : (
            "Envoyer"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
