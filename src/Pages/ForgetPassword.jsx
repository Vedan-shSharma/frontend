import React, { useState } from "react";
import { forgotPassword } from "../Services/authServices";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { BiArrowBack, BiEnvelope } from "react-icons/bi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("If this email exists, a reset link has been sent.");
    setLoading(true);
    try {
      await forgotPassword(email);
    } catch (err) {
      // Optionally handle error, but don't reveal if email exists or not
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-none">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="text-primary mb-3">
                  <BiEnvelope size={48} />
                </div>
                <h2 className="text-primary fw-bold">Forgot Password</h2>
                <p className="text-muted">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="form-control-lg"
                  />
                </Form.Group>

                {message && (
                  <Alert variant="info" className="text-center mb-4">
                    {message}
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="danger" 
                    size="lg"
                    disabled={loading}
                    className="fw-semibold"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button
              variant="primary"
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

export default ForgotPassword;