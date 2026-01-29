import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator-container">
      <div className="typing-bubble">
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
        <span className="typing-text">Typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;