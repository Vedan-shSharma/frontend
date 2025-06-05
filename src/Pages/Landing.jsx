import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Landing() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-white text-center py-5" style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}>
      <Container>
        <Card className="bg-white bg-opacity-10 border-0 shadow-lg" style={{ backdropFilter: 'blur(10px)' }}>
          <Card.Body className="p-4 p-md-5">
            <h1 className="display-4 fw-bold mb-3 text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>Welcome to EduSync!</h1>
            <p className="lead mb-4 text-white-75">Your platform for seamless learning and teaching.</p>

            {/* Calls to action */}
            <Row className="justify-content-center mt-4 g-3">
              <Col xs="auto">
                <p className="mb-2 text-white-50 fw-medium">New to EduSync?</p>
                <Button as={Link} to="/register" variant="light" size="lg" className="fw-semibold text-primary px-4 py-2">
                  Register
                </Button>
              </Col>
              <Col xs="auto">
                <p className="mb-2 text-white-50 fw-medium">Existing user?</p>
                <Button as={Link} to="/login" variant="outline-light" size="lg" className="fw-semibold px-4 py-2">
                  Login
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Landing;
