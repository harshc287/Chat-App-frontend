import React from 'react';
import { ListGroup, Image, Badge } from 'react-bootstrap';
import { FaCircle, FaCheck } from 'react-icons/fa';
import { getUserInitials, truncateText } from '../../utils/helpers';

const UserListItem = ({ user, handleFunction, isSelected = false, isSearchResult = false }) => {
  return (
    <ListGroup.Item
      onClick={handleFunction}
      className={`user-list-item ${isSelected ? 'selected' : ''} ${isSearchResult ? 'search-result' : ''}`}
    >
      <div className="user-avatar">
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            roundedCircle
            className="avatar-image"
          />
        ) : (
          <div className="avatar-default">
            {getUserInitials(user.username)}
          </div>
        )}
        {user.online && (
          <span className="online-status">
            <FaCircle size={8} />
          </span>
        )}
      </div>
      
      <div className="user-info">
        <div className="user-header">
          <h6 className="username">{truncateText(user.username, 20)}</h6>
          {user.lastSeen && !user.online && (
            <small className="last-seen">
              {new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          )}
        </div>
        
        <div className="user-preview">
          <p className="mb-0">
            {user.isTyping ? (
              <span className="typing-text">typing...</span>
            ) : user.latestMessage ? (
              <>
                {user.latestMessage.sender === user._id ? '' : 'You: '}
                {truncateText(user.latestMessage.content, 25)}
              </>
            ) : user.email ? (
              <span className="email-text">{truncateText(user.email, 25)}</span>
            ) : (
              <span className="default-text">Start a conversation</span>
            )}
          </p>
          
          {user.unreadCount > 0 && (
            <Badge bg="primary" className="message-count">
              {user.unreadCount}
            </Badge>
          )}
          
          {user.latestMessage && user.latestMessage.read && user.latestMessage.sender !== user._id && (
            <FaCheck className="read-indicator" size={12} />
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
};

export default UserListItem;