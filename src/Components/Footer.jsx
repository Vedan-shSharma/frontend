import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light py-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5 className="mb-3">EduSync</h5>
            <p className="text-muted">
              Empowering education through technology. Our platform provides a seamless learning experience for students and instructors alike.
            </p>
            <div className="mt-4">
              <a href="#" className="text-dark me-3">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-dark me-3">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-dark me-3">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-dark">
                <FaGithub size={24} />
              </a>
            </div>
          </Col>
          <Col md={3}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/courses" className="text-muted text-decoration-none">Courses</Link></li>
              <li className="mb-2"><Link to="/assessments" className="text-muted text-decoration-none">Assessments</Link></li>
              <li className="mb-2"><Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="mb-3">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/help" className="text-muted text-decoration-none">Help Center</Link></li>
              <li className="mb-2"><Link to="/documentation" className="text-muted text-decoration-none">Documentation</Link></li>
              <li className="mb-2"><Link to="/api" className="text-muted text-decoration-none">API Reference</Link></li>
              <li className="mb-2"><Link to="/community" className="text-muted text-decoration-none">Community</Link></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col className="text-center text-muted">
            <small>
              © {currentYear} EduSync. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 