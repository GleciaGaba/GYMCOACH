import React from "react";
import { FaWifi, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import "./ChatStatus.css";

interface ChatStatusProps {
  isConnected: boolean;
  lastError?: string;
  connectionAttempts: number;
}

const ChatStatus: React.FC<ChatStatusProps> = ({
  isConnected,
  lastError,
  connectionAttempts,
}) => {
  const getStatusIcon = () => {
    if (isConnected) {
      return <FaCheckCircle className="status-icon connected" />;
    } else if (connectionAttempts > 0) {
      return <FaExclamationTriangle className="status-icon warning" />;
    } else {
      return <FaWifi className="status-icon disconnected" />;
    }
  };

  const getStatusText = () => {
    if (isConnected) {
      return "Connecté";
    } else if (connectionAttempts > 0) {
      return `Tentative de reconnexion (${connectionAttempts})`;
    } else {
      return "Déconnecté";
    }
  };

  return (
    <div
      className={`chat-status ${isConnected ? "connected" : "disconnected"}`}
    >
      {getStatusIcon()}
      <span className="status-text">{getStatusText()}</span>
      {lastError && (
        <div className="error-tooltip">
          <span className="error-text">{lastError}</span>
        </div>
      )}
    </div>
  );
};

export default ChatStatus;
