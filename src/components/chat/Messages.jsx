// import React, { useEffect, useRef } from 'react';
// import { useChat } from '../../contexts/ChatContext';
// import { useAuth } from '../../contexts/AuthContext';

// const Messages = () => {
//   const { messages } = useChat();
//   const { user } = useAuth();
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   if (messages.length === 0) {
//     return (
//       <div className="text-center mt-5">
//         <i className="bi bi-chat-text display-1 text-muted"></i>
//         <h5 className="mt-3 text-muted">No messages yet</h5>
//         <p className="text-muted">Start the conversation by sending a message!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="messages-container">
//       {messages.map((message) => {
//         const isOwnMessage = message.sender._id === user._id;
        
//         return (
//           <div
//             key={message._id}
//             className={`d-flex mb-3 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
//           >
//             <div className={`message-bubble ${isOwnMessage ? 'own-message' : 'other-message'}`}>
//               {!isOwnMessage && !message.chat?.isGroupChat && (
//                 <div className="message-sender">
//                   {message.sender.username}
//                 </div>
//               )}
//               <div className="message-content">
//                 {message.content}
//               </div>
//               <div className="message-time">
//                 {formatTime(message.createdAt)}
//                 {isOwnMessage && message.readBy && message.readBy.length > 0 && (
//                   <i className="bi bi-check-all ms-1 text-primary"></i>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//       <div ref={messagesEndRef} />
      
// <style>{`
//   .message-bubble {
//     max-width: 70%;
//     padding: 10px 15px;
//     border-radius: 18px;
//     position: relative;
//   }
  
//   .own-message {
//     background-color: #007bff;
//     color: white;
//     border-bottom-right-radius: 4px;
//   }
  
//   .other-message {
//     background-color: #f1f1f1;
//     color: #333;
//     border-bottom-left-radius: 4px;
//   }
  
//   .message-sender {
//     font-weight: 600;
//     font-size: 12px;
//     margin-bottom: 2px;
//     color: #666;
//   }
  
//   .message-content {
//     word-wrap: break-word;
//   }
  
//   .message-time {
//     font-size: 11px;
//     text-align: right;
//     margin-top: 5px;
//     opacity: 0.8;
//   }
// `}</style>
//     </div>
//   );
// };

// export default Messages;


import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';


const Messages = () => {
  const { messages } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  const shouldShowDateHeader = (message, index) => {
    if (index === 0) return true;
    
    const currentDate = new Date(message.createdAt).toDateString();
    const prevDate = new Date(messages[index - 1].createdAt).toDateString();
    
    return currentDate !== prevDate;
  };

  if (messages.length === 0) {
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
        const isOwnMessage = message.sender._id === user._id;
        const showDateHeader = shouldShowDateHeader(message, index);
        
        return (
          <React.Fragment key={message._id}>
            {showDateHeader && (
              <div className="date-divider">
                <span>{formatDateHeader(message.createdAt)}</span>
              </div>
            )}
            
            <div className={`message-wrapper ${isOwnMessage ? 'own' : 'other'}`}>
              {!isOwnMessage && !message.chat?.isGroupChat && (
                <div className="message-avatar">
                  <div className="avatar">
                    {message.sender.username?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              
              <div className="message-content-wrapper">
                {!isOwnMessage && !message.chat?.isGroupChat && (
                  <div className="message-sender-name">
                    {message.sender.username}
                  </div>
                )}
                
                <div className="message-bubble">
                  <div className="message-text">
                    {message.content}
                  </div>
                  <div className="message-footer">
                    <span className="message-time">
                      {formatTime(message.createdAt)}
                    </span>
                    {isOwnMessage && (
                      <div className="message-status">
                        {message.readBy && message.readBy.length > 0 ? (
                          <i className="bi bi-check-all read"></i>
                        ) : (
                          <i className="bi bi-check unread"></i>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} className="messages-end" />
    </div>
  );
};

export default Messages;