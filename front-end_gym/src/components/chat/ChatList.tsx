import React, { useState, useEffect, useMemo } from "react";
import { Conversation, getConversations } from "../../api/chat";
import { getSportifs, getMyCoach } from "../../api/sportif";
import { useAuth } from "../../contexts/AuthContext";
import ChatSearch from "./ChatSearch";
import "./ChatList.css";

interface Sportif {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  is_active: boolean;
}

interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ChatListProps {
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: number;
  onOfflineModeChange?: (offline: boolean) => void;
  refreshTrigger?: number;
}

const ChatList: React.FC<ChatListProps> = ({
  onConversationSelect,
  selectedConversationId,
  onOfflineModeChange,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sportifs, setSportifs] = useState<Sportif[]>([]);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isCoach = user?.role === "COACH";
  const isSportif = user?.role === "SPORTIF";

  useEffect(() => {
    console.log(
      "DEBUG - ChatList useEffect triggered, refreshTrigger:",
      refreshTrigger
    );
    loadAll();
  }, [refreshTrigger]);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les conversations
      let convRes: Conversation[] = [];
      try {
        convRes = await getConversations();
      } catch (convErr: any) {
        console.warn("Erreur lors du chargement des conversations:", convErr);
      }

      setConversations(convRes);

      // Charger les données selon le rôle
      if (isCoach) {
        // Pour les coaches : charger les sportifs
        try {
          const sportifsRes = await getSportifs();
          setSportifs(sportifsRes);
        } catch (sportifsErr: any) {
          console.error("Erreur lors du chargement des sportifs:", sportifsErr);
          throw sportifsErr;
        }
      } else if (isSportif) {
        // Pour les sportifs : charger leur coach
        try {
          const coachData = await getMyCoach();
          setCoach(coachData);
        } catch (coachErr: any) {
          console.error("Erreur lors du chargement du coach:", coachErr);
          throw coachErr;
        }
      }

      onOfflineModeChange?.(false);
    } catch (err: any) {
      console.error("Erreur lors du chargement:", err);
      setError(
        isCoach
          ? "Erreur lors du chargement des sportifs"
          : "Erreur lors du chargement du coach"
      );
      onOfflineModeChange?.(true);
    } finally {
      setLoading(false);
    }
  };

  // Fusionne les données selon le rôle
  const contactsAffiches = useMemo(() => {
    console.log("DEBUG - Conversations:", conversations);
    console.log("DEBUG - Sportifs:", sportifs);
    console.log("DEBUG - Coach:", coach);

    if (isCoach) {
      // Pour les coaches : afficher les sportifs
      return sportifs
        .filter((s) => s.is_active)
        .map((sportif) => {
          // Essayer de trouver une conversation par ID exact
          let conversation = conversations.find(
            (c) => c.otherUserId === sportif.id
          );

          // Si pas trouvé, essayer par nom (fallback)
          if (!conversation) {
            conversation = conversations.find(
              (c) =>
                c.otherUserName &&
                (c.otherUserName
                  .toLowerCase()
                  .includes(sportif.firstName.toLowerCase()) ||
                  c.otherUserName
                    .toLowerCase()
                    .includes(sportif.lastName.toLowerCase()))
            );
          }

          console.log(
            `DEBUG - Sportif ${sportif.id} (${sportif.firstName} ${sportif.lastName}) - Conversation trouvée:`,
            conversation
          );
          return {
            ...sportif,
            conversation,
            type: "sportif" as const,
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
    } else if (isSportif && coach) {
      // Pour les sportifs : afficher leur coach
      let conversation = conversations.find((c) => c.otherUserId === coach.id);

      // Si pas trouvé, essayer par nom (fallback)
      if (!conversation) {
        conversation = conversations.find(
          (c) =>
            c.otherUserName &&
            (c.otherUserName
              .toLowerCase()
              .includes(coach.firstName.toLowerCase()) ||
              c.otherUserName
                .toLowerCase()
                .includes(coach.lastName.toLowerCase()))
        );
      }

      console.log(
        `DEBUG - Coach ${coach.id} (${coach.firstName} ${coach.lastName}) - Conversation trouvée:`,
        conversation
      );
      return [
        {
          ...coach,
          conversation,
          type: "coach" as const,
        },
      ];
    }
    return [];
  }, [sportifs, coach, conversations, searchQuery, isCoach, isSportif]);

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

  const handleContactClick = (contact: any) => {
    if (contact.conversation) {
      onConversationSelect(contact.conversation);
    } else {
      // Crée une conversation factice pour l'affichage (id: -1)
      const newConv: Conversation = {
        id: -1, // temporaire, sera remplacé à l'envoi du premier message
        otherUserId: contact.id,
        otherUserName: `${contact.firstName} ${contact.lastName}`,
        lastMessage: "",
        lastMessageTimestamp: "",
        unreadCount: 0,
      };
      onConversationSelect(newConv);
    }
  };

  const getHeaderTitle = () => {
    if (isCoach) return "Sportifs actifs";
    if (isSportif) return "Mon coach";
    return "Contacts";
  };

  if (loading) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h3>{getHeaderTitle()}</h3>
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
          <h3>{getHeaderTitle()}</h3>
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
        <h3>{getHeaderTitle()}</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={loadAll}>
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
      <ChatSearch onSearch={handleSearch} />
      <div className="chat-list-content">
        {contactsAffiches.length === 0 ? (
          <div className="chat-list-empty">
            <p>
              {searchQuery
                ? "Aucun contact trouvé"
                : isCoach
                ? "Aucun sportif actif"
                : "Aucun coach assigné"}
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
          contactsAffiches.map((contact) => (
            <div
              key={contact.id}
              className={`chat-list-item ${
                contact.conversation
                  ? "active-conversation"
                  : "inactive-conversation"
              } ${
                selectedConversationId ===
                (contact.conversation ? contact.conversation.id : -1)
                  ? "active"
                  : ""
              }`}
              onClick={() => handleContactClick(contact)}
              style={{
                background: contact.conversation ? "#e6ffe6" : "#e6f0ff",
                cursor: "pointer",
              }}
            >
              <div className="chat-list-item-avatar">
                <div className="avatar-placeholder">
                  {contact.firstName.charAt(0).toUpperCase()}
                </div>
                {contact.conversation &&
                  contact.conversation.unreadCount > 0 && (
                    <span className="unread-badge">
                      {contact.conversation.unreadCount}
                    </span>
                  )}
              </div>
              <div className="chat-list-item-content">
                <div className="chat-list-item-header">
                  <h6 className="chat-list-item-name">
                    {contact.firstName} {contact.lastName}
                  </h6>
                  <span className="chat-list-item-time">
                    {contact.conversation
                      ? formatTimestamp(
                          contact.conversation.lastMessageTimestamp
                        )
                      : ""}
                  </span>
                </div>
                <div className="chat-list-item-message">
                  {contact.conversation ? (
                    <p
                      className={
                        contact.conversation.unreadCount > 0 ? "unread" : ""
                      }
                    >
                      {truncateMessage(contact.conversation.lastMessage)}
                      {contact.conversation.unreadCount > 0 ? (
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
                    <p style={{ color: "#007bff", fontStyle: "italic" }}>
                      {isCoach
                        ? "Cliquez pour démarrer une conversation"
                        : "Cliquez pour démarrer une conversation avec votre coach"}
                    </p>
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
