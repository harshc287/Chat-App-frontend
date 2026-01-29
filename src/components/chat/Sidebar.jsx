import React, { useState, useEffect } from 'react';
import { 
  ListGroup, 
  InputGroup, 
  Form, 
  Button, 
  Badge,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import UserListItem from './UserListItem';
import CreateGroupModal from './CreateGroupModal';
import Loader from '../common/Loader';
import {
  FaSearch,
  FaUsers,
  FaUserPlus,
  FaComment,
  FaPlus,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa';
import { truncateText, formatDate } from '../../utils/helpers';
const Sidebar = ({ collapsed, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const { 
    chats, 
    selectedChat, 
    accessChat, 
    notification, 
    loading, 
    setSelectedChat,
    fetchMessages
  } = useChat();
  
  const { user } = useAuth();

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/search?search=${query}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('chat-user-token')}`
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleUserClick = async (user) => {
    await accessChat(user._id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat._id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getUnreadCount = (chatId) => {
    return notification.filter(n => n.chat === chatId).length;
  };

  const getDisplayName = (chat) => {
    if (!chat || !chat.users || !user) return 'Chat';

    if (chat.isGroupChat) {
      return chat.chatName || 'Group Chat';
    }

    const otherUser = chat.users.find(u => u?._id !== user._id);
    return otherUser?.username || 'User';
  };

  const getLatestMessage = (chat) => {
    if (chat.latestMessage) {
      const sender = chat.latestMessage.sender?._id === user._id ? 'You: ' : '';
      const content = chat.latestMessage.content || '';
      return sender + truncateText(content, collapsed ? 8 : 25);
    }
    return 'No messages yet';
  };

  const getOnlineStatus = (chat) => {
    if (chat.isGroupChat) return null;
    const otherUser = chat.users.find(u => u?._id !== user._id);
    return otherUser?.online;
  };

  // Tooltip for collapsed sidebar items
  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  return (
    <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!collapsed ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 sidebar-title">
                <FaComment className="me-2 sidebar-icon" />
                Messages
              </h5>
              <Button
                variant="link"
                className="collapse-btn"
                onClick={onToggle}
              >
                <FaChevronLeft />
              </Button>
            </div>

            {/* Search Bar */}
            <InputGroup className="search-box">
              <InputGroup.Text className="search-icon">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </InputGroup>

            {/* Action Buttons */}
            <div className="action-buttons mt-3">
              <Button
                variant="primary"
                className="action-btn"
                onClick={() => setShowCreateGroup(true)}
              >
                <FaUsers className="me-2" />
                New Group
              </Button>
              <Button
                variant="outline-primary"
                className="action-btn"
                onClick={() => handleSearch('')}
              >
                <FaUserPlus className="me-2" />
                Find People
              </Button>
            </div>
          </>
        ) : (
          <div className="collapsed-header">
            <Button
              variant="link"
              className="expand-btn"
              onClick={onToggle}
            >
              <FaChevronRight />
            </Button>
            <div className="logo-mini">
              <FaComment />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Body */}
      <div className="sidebar-body">
        {/* Search Results */}
        {searchResults.length > 0 && !collapsed && (
          <div className="search-results">
            <h6 className="section-title">Search Results</h6>
            <ListGroup className="chat-list">
              {searchResults.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleUserClick(user)}
                  collapsed={collapsed}
                />
              ))}
            </ListGroup>
          </div>
        )}

        {/* Chat List */}
        {loadingSearch ? (
          <div className="text-center py-4">
            <Loader size={30} />
          </div>
        ) : (
          <div className="chats-section">
            {!collapsed && <h6 className="section-title">Recent Chats</h6>}
            <ListGroup className="chat-list">
              {chats.map((chat) => {
                const unreadCount = getUnreadCount(chat._id);
                const isSelected = selectedChat?._id === chat._id;
                const onlineStatus = getOnlineStatus(chat);

                if (collapsed) {
                  return (
                    <OverlayTrigger
                      key={chat._id}
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip(getDisplayName(chat))}
                    >
                      <ListGroup.Item
                        onClick={() => handleChatClick(chat)}
                        className={`chat-item collapsed-item ${isSelected ? 'active' : ''}`}
                      >
                        <div className="chat-avatar-collapsed">
                          {chat.isGroupChat ? (
                            <div className="avatar-group-collapsed">
                              <FaUsers size={16} />
                            </div>
                          ) : (
                            <div className="avatar-single-collapsed">
                              {getDisplayName(chat).substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          {!chat.isGroupChat && onlineStatus && (
                            <span className="online-indicator-collapsed"></span>
                          )}
                          {unreadCount > 0 && (
                            <Badge bg="danger" className="unread-badge-collapsed">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </div>
                      </ListGroup.Item>
                    </OverlayTrigger>
                  );
                }

                return (
                  <ListGroup.Item
                    key={chat._id}
                    onClick={() => handleChatClick(chat)}
                    className={`chat-item ${isSelected ? 'active' : ''}`}
                  >
                    <div className="chat-item-content">
                      <div className="chat-avatar">
                        {chat.isGroupChat ? (
                          <div className="avatar-group">
                            <FaUsers size={20} />
                          </div>
                        ) : (
                          <div className="avatar-single">
                            {getDisplayName(chat).substring(0, 1).toUpperCase()}
                          </div>
                        )}
                        {!chat.isGroupChat && onlineStatus && (
                          <span className="online-indicator"></span>
                        )}
                      </div>
                      
                      <div className="chat-info">
                        <div className="chat-header">
                          <h6 className="chat-name">{getDisplayName(chat)}</h6>
                          {chat.latestMessage && (
                            <small className="chat-time">
                              {formatDate(chat.latestMessage.createdAt)}
                            </small>
                          )}
                        </div>
                        
                        <div className="chat-preview">
                          <p className="mb-0 text-truncate">
                            {getLatestMessage(chat)}
                          </p>
                          {unreadCount > 0 && (
                            <Badge bg="primary" className="unread-badge">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        )}

        {chats.length === 0 && !loading && !loadingSearch && !collapsed && (
          <div className="empty-state">
            <div className="empty-icon">
              <FaComment size={48} />
            </div>
            <h5>No conversations yet</h5>
            <p className="text-muted">Start chatting by searching for users</p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        show={showCreateGroup}
        onHide={() => setShowCreateGroup(false)}
      />
    </div>
  );
};

export default Sidebar;