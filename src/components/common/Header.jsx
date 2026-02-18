import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Button,
  Dropdown,
  Image,
  Badge
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { getUserInitials } from '../../utils/helpers';

const Header = ({ sidebarCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { notification } = useChat();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const unreadNotifications = notification.length;

  return (
    <>
      <Navbar expand="lg" className="app-header" fixed="top">
        <Container fluid>
          {/* Sidebar Toggle Button */}
          {/* <Button
            variant="link"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FaBars />

            </Button> */}

          {/* App Logo */}
          <Navbar.Brand as={Link} to="/" className="app-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="bi bi-chat-heart-fill"></i>
              </div>
              {!sidebarCollapsed && (
                <span className="logo-text">ChatApp</span>
              )}
            </div>
          </Navbar.Brand>

          {/* Search Bar */}
          {/* <div className={`search-container ${showSearch ? 'expanded' : ''}`}>
            {showSearch ? (
              <form onSubmit={handleSearch} className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search messages, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button
                    variant="link"
                    className="search-close"
                    onClick={() => setShowSearch(false)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="link"
                className="search-toggle"
                onClick={() => setShowSearch(true)}
              >
                <FaSearch />
              </Button>
            )}
          </div> */}

          {/* Header Actions */}
          <div className="header-actions">
            {/* Dark Mode Toggle */}
            <Button
              variant="link"
              className="action-btn"
              onClick={toggleDarkMode}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>

            {/* Notifications */}
            <div className="notification-wrapper">
              <Button
                variant="link"
                className="action-btn"
                title="Notifications"
              >
                <FaBell />
                {unreadNotifications > 0 && (
                  <Badge bg="danger" className="notification-badge">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </Button>
            </div>

            {/* User Profile */}
            <Dropdown align="end" className="user-dropdown">
              <Dropdown.Toggle as="div" className="user-toggle">
                <div className="user-profile">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      roundedCircle
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-fallback">
                      {getUserInitials(user.username)}
                    </div>
                  )}
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <small className="user-status">Online</small>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu">
                <div className="profile-header">
                  <div className="d-flex align-items-center">
                    <div className="profile-avatar">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          roundedCircle
                          width="50"
                          height="50"
                        />
                      ) : (
                        <div className="profile-avatar-fallback">
                          {getUserInitials(user.username)}
                        </div>
                      )}
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">{user.username}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </div>

                <Dropdown.Divider />

                <Dropdown.Item onClick={() => navigate('/profile')}>
                  Profile
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" />
                  Settings
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Header Spacer */}
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;