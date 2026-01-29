import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ChatBox from './ChatBox';
import Header from '../common/Header';
import { FaBars } from 'react-icons/fa';

const ChatContainer = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const isMobile = window.innerWidth < 768;

  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      
      {isMobile && (
        <div className="mobile-toggle">
          <Button
            variant="primary"
            className="sidebar-toggle-btn"
            onClick={() => setShowMobileSidebar(true)}
          >
            <FaBars size={20} />
          </Button>
        </div>
      )}
      
      <Container fluid className="flex-grow-1 p-0">
        <Row className="h-100 m-0">
          {/* Sidebar - Desktop */}
          {!isMobile && (
            <Col md={4} lg={3} className="p-0 h-100">
              <div className="sidebar-desktop h-100">
                <Sidebar />
              </div>
            </Col>
          )}
          
          {/* Mobile Sidebar */}
          {isMobile && (
            <Sidebar
              mobile={showMobileSidebar}
              onClose={() => setShowMobileSidebar(false)}
            />
          )}
          
          {/* Chat Area */}
          <Col md={8} lg={9} className="p-0 h-100">
            <div className="chat-area h-100">
              <ChatBox />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatContainer;