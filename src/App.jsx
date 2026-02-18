import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Header from './components/common/Header';
import Sidebar from './components/chat/Sidebar';
import ChatBox from './components/chat/ChatBox';
import './App.css';
import Profile from './components/auth/Profile';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <SocketProvider>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout
                        sidebarCollapsed={sidebarCollapsed}
                        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </SocketProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

const MainLayout = ({ sidebarCollapsed, toggleSidebar }) => {
  return (
    <div className="main-layout">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <Container fluid className="main-content">
        <Row className="h-100">
          {/* Collapsible Sidebar */}
          <Col
            xs={sidebarCollapsed ? 1 : 12}
            md={sidebarCollapsed ? 1 : 4}
            lg={sidebarCollapsed ? 1 : 3}
            className={`sidebar-column ${sidebarCollapsed ? 'collapsed' : ''}`}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={toggleSidebar}
            />
          </Col>

          {/* Chat Area - Adjusts based on sidebar state */}
          <Col
            xs={sidebarCollapsed ? 11 : 12}
            md={sidebarCollapsed ? 11 : 8}
            lg={sidebarCollapsed ? 11 : 9}
            className="chat-column"
          >
            <ChatBox />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;