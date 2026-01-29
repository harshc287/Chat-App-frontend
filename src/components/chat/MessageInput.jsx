import React, { useState, useRef } from 'react';
import { Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { useChat } from '../../contexts/ChatContext';
import { sendTypingIndicator } from '../../utils/socket';
import { 
  FaPaperPlane, 
  FaSmile, 
  FaPaperclip,
  FaImage,
  FaFile,
  FaMicrophone 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { selectedChat, sendMessage, setTyping } = useChat();
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Typing indicator logic
    if (!isTyping && newMessage.trim() !== '') {
      setIsTyping(true);
      setTyping(true);
      if (selectedChat) {
        sendTypingIndicator(selectedChat._id, true);
      }
    }

    // Clear typing indicator after 3 seconds of no typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        setTyping(false);
        if (selectedChat) {
          sendTypingIndicator(selectedChat._id, false);
        }
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat) return;

    try {
      await sendMessage(message);
      setMessage('');
      
      // Clear typing indicator
      setIsTyping(false);
      setTyping(false);
      if (selectedChat) {
        sendTypingIndicator(selectedChat._id, false);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload
      toast.info('File upload feature coming soon!');
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  if (!selectedChat) {
    return null;
  }

  return (
    <div className="p-3 border-top">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm">
              <FaSmile />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div className="p-2 d-flex flex-wrap" style={{ width: '200px' }}>
                {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className="btn btn-sm m-1"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm">
              <FaPaperclip />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleFileSelect}>
                <FaFile className="me-2" />
                File
              </Dropdown.Item>
              <Dropdown.Item onClick={handleFileSelect}>
                <FaImage className="me-2" />
                Image
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            style={{ resize: 'none' }}
          />

          <Button 
            variant="primary" 
            type="submit"
            disabled={!message.trim()}
          >
            <FaPaperPlane />
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageInput;