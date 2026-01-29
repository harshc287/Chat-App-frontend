import React, { useState } from 'react';
import { Modal, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import UserListItem from './UserListItem';

const CreateGroupModal = ({ show, onHide }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const { createGroupChat } = useChat();
  const { user } = useAuth();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      // You'll need to implement user search API call
      // For now, using the authService
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/search?search=${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('chat-user-token')}`
        }
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleUserSelect = (userToAdd) => {
    if (selectedUsers.find(u => u._id === userToAdd._id)) {
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error('Select at least 2 users for group chat');
      return;
    }

    setLoading(true);
    try {
      const users = selectedUsers.map(u => u._id);
      await createGroupChat({
        name: groupName,
        users: JSON.stringify(users)
      });
      
      toast.success('Group created successfully!');
      onHide();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Users</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            {searchResults.length > 0 && (
              <ListGroup className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {searchResults.map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleUserSelect(user)}
                  />
                ))}
              </ListGroup>
            )}
          </Form.Group>

          {selectedUsers.length > 0 && (
            <div className="mb-3">
              <Form.Label>Selected Users ({selectedUsers.length})</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <Badge
                    key={user._id}
                    bg="primary"
                    className="d-flex align-items-center"
                    style={{ fontSize: '14px', padding: '5px 10px' }}
                  >
                    {user.username}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: '8px' }}
                      onClick={() => handleUserRemove(user._id)}
                      aria-label="Remove"
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;