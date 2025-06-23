import React, { useEffect, useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { Message } from "../../api/chat";
import "./ChatNotification.css";

interface ChatNotificationProps {
  message: Message;
  senderName: string;
  onClose: () => void;
  onOpenChat: () => void;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({
  message,
  senderName,
  onClose,
  onOpenChat,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-fermeture après 5 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre l'animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleClick = () => {
    onOpenChat();
    handleClose();
  };

  const truncateMessage = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className={`chat-notification ${isVisible ? "visible" : "hidden"}`}>
      <div className="notification-content" onClick={handleClick}>
        <div className="notification-header">
          <FaBell className="notification-icon" />
          <span className="notification-title">Nouveau message</span>
          <button className="notification-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="notification-body">
          <div className="notification-sender">{senderName}</div>
          <div className="notification-message">
            {truncateMessage(message.content)}
          </div>
        </div>

        <div className="notification-footer">
          <span className="notification-time">
            {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="notification-action">Cliquer pour ouvrir</span>
        </div>
      </div>
    </div>
  );
};

export default ChatNotification;
