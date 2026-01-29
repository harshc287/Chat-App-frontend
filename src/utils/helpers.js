import { USER_INFO, USER_TOKEN } from './constants';

// Local storage helpers
export const setToken = (token) => {
  localStorage.setItem(USER_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(USER_TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(USER_TOKEN);
};

export const setUserInfo = (user) => {
  localStorage.setItem(USER_INFO, JSON.stringify(user));
};

export const getUserInfo = () => {
  const user = localStorage.getItem(USER_INFO);
  return user ? JSON.parse(user) : null;
};

export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO);
};

// Format date
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  } else {
    return d.toLocaleDateString();
  }
};

// Truncate text
export const truncateText = (text, length = 30) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

// Get user initials
export const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Check if user is online (dummy function - you'll implement based on your logic)
export const isUserOnline = (userId) => {
  // This should be replaced with actual online status from socket
  return false;
};