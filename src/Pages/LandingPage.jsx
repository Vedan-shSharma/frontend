import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { BiBook, BiBarChartAlt2, BiBrain, BiCheckCircle, BiLineChart, BiBookOpen } from "react-icons/bi";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100" style={{ paddingTop: 'var(--header-height)' }}>
      {/* Hero Section */}
      <section className="py-5 py-md-7 bg-primary text-white text-center rounded-bottom-4" style={{ backgroundColor: '#1a73e8' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <h1 className="display-4 fw-bold mb-3">
                Ready to Start Learning?
              </h1>
              <p className="lead mb-5">
                Join thousands of students and instructors already using EduSync
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button 
                  variant="danger" 
                  size="lg"
                  className="px-4 py-2 fw-semibold"
                  onClick={() => navigate('/register')}
                  style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                >
                  Get Started Now
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  className="px-4 py-2 fw-semibold"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="p-4">
                  <div className="text-primary mb-3">
                    <BiBook size={32} />
                  </div>
                  <Card.Title as="h3" className="h4 mb-3">Smart Assessments</Card.Title>
                  <Card.Text className="text-muted">
                    Take interactive assessments with instant feedback and detailed progress tracking.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="p-4">
                  <div className="text-primary mb-3">
                    <BiBarChartAlt2 size={32} />
                  </div>
                  <Card.Title as="h3" className="h4 mb-3">Course Management</Card.Title>
                  <Card.Text className="text-muted">
                    Access comprehensive course materials, track your progress, and manage your learning journey.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="p-4">
                  <div className="text-primary mb-3">
                    <BiBrain size={32} />
                  </div>
                  <Card.Title as="h3" className="h4 mb-3">Progress Analytics</Card.Title>
                  <Card.Text className="text-muted">
                    Get detailed insights into your performance with comprehensive analytics and progress reports.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5 bg-light text-secondary">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="display-6 fw-bold text-primary mb-3">Why Choose EduSync?</h2>
              <p className="lead text-muted">
                Experience a modern approach to education with our comprehensive learning platform
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <div className="text-center p-4">
                <div className="text-primary mb-3">
                  <BiCheckCircle size={40} />
                </div>
                <h3 className="h5 mb-3 text-secondary">Interactive Learning</h3>
                <p className="text-muted mb-0">
                  Engage with dynamic assessments and real-time feedback to enhance your learning experience.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4">
                <div className="text-primary mb-3">
                  <BiLineChart size={40} />
                </div>
                <h3 className="h5 mb-3 text-secondary">Progress Tracking</h3>
                <p className="text-muted mb-0">
                  Monitor your performance with detailed analytics and personalized progress reports.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4">
                <div className="text-primary mb-3">
                  <BiBookOpen size={40} />
                </div>
                <h3 className="h5 mb-3 text-secondary">Comprehensive Resources</h3>
                <p className="text-muted mb-0">
                  Access a wide range of learning materials and resources all in one place.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-6 fw-bold mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="lead mb-4">
                Join thousands of students and instructors who are already using EduSync
              </p>
              <Button 
                variant="light" 
                size="lg"
                className="px-4 py-2 fw-semibold"
                onClick={() => navigate('/register')}
              >
                Get Started Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage; 