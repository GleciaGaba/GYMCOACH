import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./ChatSearch.css";

interface ChatSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const ChatSearch: React.FC<ChatSearchProps> = ({
  onSearch,
  placeholder = "Rechercher une conversation...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="chat-search">
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="clear-search-btn"
            type="button"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatSearch;
