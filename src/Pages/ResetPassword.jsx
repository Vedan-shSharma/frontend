import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../Services/authServices";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { BiArrowBack, BiShow, BiHide, BiLockAlt } from "react-icons/bi";

function ResetPassword() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", variant: "" });
    
    if (password !== confirm) {
      setMessage({ 
        text: "Passwords do not match.", 
        variant: "danger" 
      });
      return;
    }

    try {
      await resetPassword(email, token, password);
      setMessage({ 
        text: "Password reset successful! Redirecting to login...", 
        variant: "success" 
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({ 
        text: "Reset failed. The link may be invalid or expired.", 
        variant: "danger" 
      });
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="text-primary mb-3">
                  <BiLockAlt size={48} />
                </div>
                <h2 className="text-primary fw-bold">Reset Password</h2>
                <p className="text-muted">
                  Enter your new password below
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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

                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
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

                {message.text && (
                  <Alert variant={message.variant} className="text-center mb-4">
                    {message.text}
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="danger" 
                    size="lg"
                    className="fw-semibold"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button
              variant="outline-primary"
              className="d-inline-flex align-items-center gap-2"
              onClick={() => navigate('/login')}
            >
              <BiArrowBack />
              Back to Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;