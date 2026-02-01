import React, { useState } from 'react';
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
import { getToken } from '../../utils/helpers';
import {
  FaSearch,
  FaUsers,
  FaUserPlus,
  FaComment,
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
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/search?search=${query}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
     if (!res.ok) {
      throw new Error('Unauthorized');
    }
    const data = await res.json();
    setSearchResults(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSearch(false);
  }
};

const handleFindPeople = async () => {
  setLoadingSearch(true);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/search`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    const data = await res.json();
    setSearchResults(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingSearch(false);
  }
};



  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat._id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getUnreadCount = (chatId) =>
    notification.filter(n => n.chat === chatId).length;

  const getDisplayName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const other = chat.users.find(u => u._id !== user._id);
    return other?.username || 'User';
  };

  const renderTooltip = (text) => (
    <Tooltip>{text}</Tooltip>
  );

  return (
    <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed ? (
          <>
            <div className="sidebar-title-row">
              <h5>
                <FaComment className="me-2" /> Messages
              </h5>
              <Button variant="link" onClick={onToggle}>
                <FaChevronLeft />
              </Button>
            </div>

            <InputGroup className="search-box">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>

            <div className="action-buttons">
              <Button onClick={() => setShowCreateGroup(true)}>
                <FaUsers className="me-2" /> New Group
              </Button>
              <Button variant="outline-primary" onClick={handleFindPeople}>
                <FaUserPlus className="me-2" /> Find People
              </Button>
            </div>
          </>
        ) : (
          <Button variant="link" onClick={onToggle}>
            <FaChevronRight />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="sidebar-body">
        {loadingSearch ? (
          <Loader size={30} />
        ) : (
          <ListGroup className="chat-list">

  {/* 🔍 SEARCH RESULTS */}
  {searchResults.length > 0 && (
    <>
      {searchResults.map((u) => (
        <UserListItem
          key={u._id}
          user={u}
          isSearchResult
          handleFunction={() => {
            accessChat(u._id);
            setSearchResults([]);
            setSearchQuery('');
          }}
        />
      ))}
    </>
  )}

  {/* 💬 CHATS LIST (only when not searching) */}
  {searchResults.length === 0 &&
    chats.map((chat) => {
      const unread = getUnreadCount(chat._id);
      const active = selectedChat?._id === chat._id;

      return (
        <ListGroup.Item
          key={chat._id}
          onClick={() => handleChatClick(chat)}
          className={`chat-item ${active ? 'active' : ''}`}
        >
          <div className="chat-info">
            <h6>{getDisplayName(chat)}</h6>
            <small>
              {chat.latestMessage
                ? truncateText(chat.latestMessage.content, 25)
                : 'No messages yet'}
            </small>
          </div>

          {unread > 0 && <Badge bg="primary">{unread}</Badge>}
        </ListGroup.Item>
      );
    })}
</ListGroup>

        )}
      </div>

      <CreateGroupModal
        show={showCreateGroup}
        onHide={() => setShowCreateGroup(false)}
      />
    </aside>
  );
};

export default Sidebar;
