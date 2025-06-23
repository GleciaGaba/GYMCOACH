import React, { useState, useEffect, useMemo } from "react";
import { Conversation, getConversations } from "../../api/chat";
import { getSportifs } from "../../api/sportif";
import ChatSearch from "./ChatSearch";
import "./ChatList.css";

interface Sportif {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  is_active: boolean;
}

interface ChatListProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: number;
  onOfflineModeChange?: (offline: boolean) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  onConversationSelect,
  selectedConversationId,
  onOfflineModeChange,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sportifs, setSportifs] = useState<Sportif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les sportifs et les conversations séparément
      let convRes: Conversation[] = [];
      let sportifsRes: any = [];

      try {
        convRes = await getConversations();
      } catch (convErr: any) {
        console.warn("Erreur lors du chargement des conversations:", convErr);
        // On continue avec une liste vide de conversations
      }

      try {
        sportifsRes = await getSportifs();
      } catch (sportifsErr: any) {
        console.error("Erreur lors du chargement des sportifs:", sportifsErr);
        throw sportifsErr; // On arrête si on ne peut pas charger les sportifs
      }

      setConversations(convRes);
      setSportifs(sportifsRes);
      onOfflineModeChange?.(false);
    } catch (err: any) {
      console.error("Erreur lors du chargement des sportifs:", err);
      setError("Erreur lors du chargement des sportifs");
      onOfflineModeChange?.(true);
    } finally {
      setLoading(false);
    }
  };

  // Fusionne sportifs et conversations pour l'affichage
  const sportifsAffiches = useMemo(() => {
    return sportifs
      .filter((s) => s.is_active)
      .map((sportif) => {
        const conversation = conversations.find(
          (c) => c.otherUserId === sportif.id
        );
        return {
          ...sportif,
          conversation,
        };
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          (s.firstName + " " + s.lastName).toLowerCase().includes(query) ||
          (s.conversation &&
            s.conversation.lastMessage.toLowerCase().includes(query))
        );
      });
  }, [sportifs, conversations, searchQuery]);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message && message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSportifClick = (sportif: any) => {
    if (sportif.conversation) {
      onConversationSelect(sportif.conversation);
    } else {
      // Crée une conversation factice pour l'affichage (id: -1)
      const newConv: Conversation = {
        id: -1, // temporaire, sera remplacé à l'envoi du premier message
        otherUserId: sportif.id,
        otherUserName: `${sportif.firstName} ${sportif.lastName}`,
        lastMessage: "",
        lastMessageTimestamp: "",
        unreadCount: 0,
      };
      onConversationSelect(newConv);
    }
  };

  if (loading) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h3>Sportifs actifs</h3>
        </div>
        <ChatSearch onSearch={handleSearch} />
        <div className="chat-list-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h3>Sportifs actifs</h3>
        </div>
        <ChatSearch onSearch={handleSearch} />
        <div className="chat-list-error">
          <p className="text-danger">{error}</p>
          <button className="btn btn-outline-primary btn-sm" onClick={loadAll}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>Sportifs actifs</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={loadAll}>
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
      <ChatSearch onSearch={handleSearch} />
      <div className="chat-list-content">
        {sportifsAffiches.length === 0 ? (
          <div className="chat-list-empty">
            <p>
              {searchQuery ? "Aucun sportif trouvé" : "Aucun sportif actif"}
            </p>
            {searchQuery && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearchQuery("")}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          sportifsAffiches.map((sportif) => (
            <div
              key={sportif.id}
              className={`chat-list-item ${
                sportif.conversation
                  ? "active-conversation"
                  : "inactive-conversation"
              } ${
                selectedConversationId ===
                (sportif.conversation ? sportif.conversation.id : -1)
                  ? "active"
                  : ""
              }`}
              onClick={() => handleSportifClick(sportif)}
              style={{
                background: sportif.conversation ? "#e6ffe6" : "#e6f0ff",
                cursor: "pointer",
              }}
            >
              <div className="chat-list-item-avatar">
                <div className="avatar-placeholder">
                  {sportif.firstName.charAt(0).toUpperCase()}
                </div>
                {sportif.conversation &&
                  sportif.conversation.unreadCount > 0 && (
                    <span className="unread-badge">
                      {sportif.conversation.unreadCount}
                    </span>
                  )}
              </div>
              <div className="chat-list-item-content">
                <div className="chat-list-item-header">
                  <h6 className="chat-list-item-name">
                    {sportif.firstName} {sportif.lastName}
                  </h6>
                  <span className="chat-list-item-time">
                    {sportif.conversation
                      ? formatTimestamp(
                          sportif.conversation.lastMessageTimestamp
                        )
                      : ""}
                  </span>
                </div>
                <div className="chat-list-item-message">
                  {sportif.conversation ? (
                    <p
                      className={
                        sportif.conversation.unreadCount > 0 ? "unread" : ""
                      }
                    >
                      {truncateMessage(sportif.conversation.lastMessage)}
                      {sportif.conversation.unreadCount > 0 ? (
                        <span style={{ color: "red", marginLeft: 8 }}>
                          • Non lu
                        </span>
                      ) : (
                        <span style={{ color: "green", marginLeft: 8 }}>
                          ✓✓ Lu
                        </span>
                      )}
                    </p>
                  ) : (
                    <p style={{ color: "#007bff" }}>Aucune conversation</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
