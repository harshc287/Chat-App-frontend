import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import AuthLayout from "./AuthLayout"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    // <Container className="d-flex justify-content-center align-items-center min-vh-100">
    //   <Row className="w-100" style={{ maxWidth: '400px' }}>
    //     <Col>
    //       <Card className="shadow">
    //         <Card.Body>
     <AuthLayout>
      <h2 className="text-center mb-3 fw-bold">WELCOME BACK!</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'SIGN IN'}
        </Button>

        <div className="text-center">
          <Link to="/register" className="text-decoration-none">
            Don't have an account? Sign up
          </Link>
        </div>
      </Form>
    </AuthLayout>


    //         {/* </Card.Body>
    //       </Card>
    //     </Col>
    //   </Row>
    // </Container> */}
  );
};

export default Login;