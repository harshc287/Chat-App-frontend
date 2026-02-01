
import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const Messages = () => {
  const { messages } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const shouldShowDateHeader = (index) => {
    if (index === 0) return true;

    const current = new Date(messages[index].createdAt).toDateString();
    const previous = new Date(messages[index - 1].createdAt).toDateString();

    return current !== previous;
  };

  if (!messages.length) {
    return (
      <div className="empty-messages">
        <div className="empty-messages-icon">
          <i className="bi bi-chat-heart-fill"></i>
        </div>
        <h4>Start the conversation</h4>
        <p className="text-muted">Send your first message to begin chatting</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {messages.map((message, index) => {
        const isOwn = message.sender._id === user._id;

        return (
          <React.Fragment key={message._id}>
            {shouldShowDateHeader(index) && (
              <div className="date-divider">
                <span>{formatDateHeader(message.createdAt)}</span>
              </div>
            )}

            <div className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && !message.chat?.isGroupChat && (
                <div className="message-avatar">
                  <div className="avatar">
                    {message.sender.username?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <div className="message-content-wrapper">
                {!isOwn && !message.chat?.isGroupChat && (
                  <div className="message-sender-name">
                    {message.sender.username}
                  </div>
                )}

                <div className="message-bubble">
                  <div className="message-text">{message.content}</div>

                  <div className="message-footer">
                    <span className="message-time">
                      {formatTime(message.createdAt)}
                    </span>

                    {isOwn && (
                      <span className="message-status">
                        {message.readBy?.length ? (
                          <i className="bi bi-check-all read"></i>
                        ) : (
                          <i className="bi bi-check unread"></i>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
