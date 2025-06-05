import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Services/authServices";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { BiArrowBack, BiShow, BiHide } from "react-icons/bi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Add effect to automatically dismiss notification
  useEffect(() => {
    let timer;
    if (notification.show) {
      timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification.show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      login(data); // save to context + localStorage
      setNotification({
        show: true,
        message: "Login successful! Redirecting...",
        type: "success"
      });
      setTimeout(() => {
        if (data.role === "Student") navigate("/student");
        else if (data.role === "Instructor") navigate("/instructor");
      }, 1000);
    } catch (err) {
      setNotification({
        show: true,
        message: "Invalid email or password. Please try again.",
        type: "danger"
      });
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          {notification.show && (
            <Alert 
              variant={notification.type} 
              className="position-fixed top-0 start-50 translate-middle-x mt-3"
              style={{ zIndex: 1000 }}
              onClose={() => setNotification(prev => ({ ...prev, show: false }))}
              dismissible
            >
              {notification.message}
            </Alert>
          )}

          <Card className="border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="text-primary fw-bold">Welcome Back</h2>
                <p className="text-muted">Please sign in to continue</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control-lg pe-5"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y text-decoration-none p-0 me-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="danger" 
                    size="lg"
                    className="fw-semibold"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    Sign In
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="mb-2">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Register here
                    </Link>
                  </p>
                  <p className="mb-0">
                    <Link to="/forgot-password" className="text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button
              variant="outline-primary"
              className="d-inline-flex align-items-center gap-2"
              onClick={() => navigate('/')}
            >
              <BiArrowBack />
              Back to Homepage
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;