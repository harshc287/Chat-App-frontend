import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import Messages from './Messages';
import MessageInput from './MessageInput';
import TypingIndicator from '../common/TypingIndicator';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUsers, 
  FaEllipsisV 
} from 'react-icons/fa';

const ChatBox = () => {
  const { selectedChat, isTyping } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, isTyping]);

  if (!selectedChat) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-icon">
          <i className="bi bi-chat-dots-fill"></i>
        </div>
        <h3>Welcome to ChatApp</h3>
        <p>Select a conversation or start a new chat</p>
      </div>
    );
  }

  const isGroupChat = selectedChat.isGroupChat;
  const displayName = isGroupChat 
    ? selectedChat.chatName 
    : selectedChat.users.find(u => u?._id !== user._id)?.username || 'User';

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-info">
          <div className="chat-avatar">
            {isGroupChat ? (
              <div className="avatar-group-chat">
                <FaUsers />
              </div>
            ) : (
              <div className="avatar-single-chat">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="chat-details">
            <h5 className="chat-title">{displayName}</h5>
            {isGroupChat ? (
              <p className="chat-meta">{selectedChat.users.length} members</p>
            ) : (
              <p className="chat-meta online">Online</p>
            )}
          </div>
        </div>
        <button className="chat-menu-btn">
          <FaEllipsisV />
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        <Messages />
        
        {isTyping && (
          <div className="typing-container">
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatBox;