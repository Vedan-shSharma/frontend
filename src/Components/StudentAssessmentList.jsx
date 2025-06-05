import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Badge, Alert, Spinner } from "react-bootstrap";
import { BiArrowBack, BiCheckCircle } from "react-icons/bi";

function StudentAssessmentList({ onNewAssessment }) {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAssessments();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Assessment');
      setAssessments(res.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
      }
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttempt = async (assessment) => {
    try {
      const res = await api.get(`/Assessment/${assessment.assessmentId}`);
      setSelectedAssessment(res.data);
      setAnswers({});
      setResult(null);
    } catch (error) {
      alert("Error loading assessment. Please try again.");
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!selectedAssessment) {
      alert('No assessment selected');
      return;
    }

    try {
      setLoading(true);
      
      // Convert answers object to array of selected answers
      const selectedAnswers = [];
      const questions = JSON.parse(selectedAssessment.questions);
      
      // Ensure we have an answer for each question
      for (let i = 0; i < questions.length; i++) {
        if (answers[i] === undefined) {
          alert(`Please answer question ${i + 1} before submitting.`);
          setLoading(false);
          return;
        }
        selectedAnswers.push(parseInt(answers[i]));
      }

      const payload = {
        assessmentId: selectedAssessment.assessmentId,
        userId: user.userId,
        selectedAnswers: selectedAnswers
      };

      console.log('Submitting assessment with payload:', payload);
      
      // Use the AssessmentController's attempt endpoint
      const res = await api.post('/Assessment/attempt', payload);
      console.log('Assessment submission response:', res.data);
      
      if (!res.data) {
        throw new Error('No response data received');
      }
      
      // Calculate percentage based on the response
      const percentage = Math.round((res.data.score / questions.length) * 100);
      
      setResult({
        ...res.data,
        percentage,
        maxScore: questions.length,
        passed: percentage >= 50
      });
      
      // Clear answers after successful submission
      setAnswers({});
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      let errorMessage = "Error submitting assessment. Please try again.";
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.status === 400) {
          errorMessage = error.response.data?.toString() || "Invalid data provided.";
        } else if (error.response.status === 404) {
          errorMessage = "Assessment not found. Please refresh the page and try again.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-primary">Loading assessments...</p>
      </Container>
    );
  }

  if (selectedAssessment) {
    const questions = JSON.parse(selectedAssessment.questions);
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary mb-0">{selectedAssessment.title}</h2>
          <Button
            variant="outline-primary"
            onClick={() => setSelectedAssessment(null)}
            className="d-flex align-items-center gap-2"
          >
            <BiArrowBack />
            Back to List
          </Button>
        </div>

        {result ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <h3 className="text-primary mb-4">Assessment Result</h3>
              <div className="mb-4">
                <h4 className="display-4 text-primary mb-2">{result.percentage}%</h4>
                <p className="text-muted">Score: {result.score}/{selectedAssessment.maxScore}</p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedAssessment(null);
                  setResult(null);
                }}
                className="px-4"
              >
                Back to Assessments
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div className="assessment-questions">
            {questions.map((question, qIndex) => (
              <Card key={qIndex} className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5 mb-3">
                    <Badge bg="primary" className="me-2">Q{qIndex + 1}</Badge>
                    {question.question}
                  </h3>
                  <ListGroup>
                    {question.options.map((option, oIndex) => (
                      <ListGroup.Item
                        key={oIndex}
                        action
                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        className={`d-flex align-items-center gap-2 ${
                          answers[qIndex] === oIndex ? 'active' : ''
                        }`}
                      >
                        <span className="fw-bold">{String.fromCharCode(65 + oIndex)}.</span>
                        {option}
                        {answers[qIndex] === oIndex && (
                          <BiCheckCircle className="ms-auto text-primary" />
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ))}
            <div className="text-center mt-4">
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={loading || Object.keys(answers).length !== questions.length}
                className="d-flex align-items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <BiCheckCircle size={18} />
                    Submit Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="text-primary mb-4">Available Assessments</h2>
      {assessments.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          No assessments available at the moment.
        </Alert>
      ) : (
        <Row className="g-4">
          {assessments.map((assessment) => (
            <Col key={assessment.assessmentId} md={6} lg={4}>
              <Card className="h-100 border-0">
                <Card.Header className="bg-light">
                  <h3 className="h5 mb-0 text-primary">{assessment.title}</h3>
                </Card.Header>
                <Card.Body>
                  <Badge bg="info" className="mb-3">
                    {courses.find(c => c.courseId === assessment.courseId)?.title || 'Unknown Course'}
                  </Badge>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="border-0 px-0">
                      <small className="text-muted">Instructor:</small>
                      <div>{assessment.instructorName || 'Unknown'}</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 px-0">
                      <small className="text-muted">Total Questions:</small>
                      <div>{JSON.parse(assessment.questions).length}</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 px-0">
                      <small className="text-muted">Maximum Score:</small>
                      <div>{assessment.maxScore}</div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button
                    variant="danger"
                    onClick={() => handleAttempt(assessment)}
                    className="w-100"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    Attempt Assessment
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default StudentAssessmentList; 
