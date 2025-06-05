import React, { useState, useEffect } from "react";
import { registerUser } from "../Services/authServices";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { BiArrowBack, BiShow, BiHide } from "react-icons/bi";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "Student" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

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
    
    // Password validation
    if (form.password.length < 8) {
      setNotification({
        show: true,
        message: "Password must be at least 8 characters long",
        type: "danger"
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setNotification({
        show: true,
        message: "Passwords do not match!",
        type: "danger"
      });
      return;
    }

    try {
      // Create the registration data object matching the backend DTO
      const registrationData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };

      await registerUser(registrationData);
      setNotification({
        show: true,
        message: "Registration successful! Redirecting to login...",
        type: "success"
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log('Registration error:', err.response); // For debugging
      
      // Handle the error message from the backend
      if (err.response?.data) {
        setNotification({
          show: true,
          message: err.response.data,
          type: "danger"
        });
      } else if (err.response?.status === 400) {
        setNotification({
          show: true,
          message: "Please fill in all required fields correctly.",
          type: "danger"
        });
      } else if (err.response?.status === 500) {
        setNotification({
          show: true,
          message: "Server error. Please try again later.",
          type: "danger"
        });
      } else {
        setNotification({
          show: true,
          message: "Unable to connect to the server. Please check your internet connection.",
          type: "danger"
        });
      }
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
                <h2 className="text-primary fw-bold">Create Account</h2>
                <p className="text-muted">Join EduSync to start your learning journey</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password (min. 8 characters)"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength="8"
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

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                      minLength="8"
                      className="form-control-lg pe-5"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y text-decoration-none p-0 me-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="form-select-lg"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="danger" 
                    size="lg"
                    className="fw-semibold"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    Create Account
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Login here
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
}

export default Register;
