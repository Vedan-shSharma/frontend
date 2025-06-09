import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Badge, Alert, Spinner } from "react-bootstrap";
import { BiArrowBack, BiCheckCircle, BiLockAlt } from "react-icons/bi";

function StudentAssessmentList({ onNewAssessment }) {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch enrolled courses first
      const enrolledRes = await api.get(`/CourseEnrollment/student/${user.userId}`);
      setEnrolledCourses(enrolledRes.data);

      // Fetch all assessments
      const assessmentsRes = await api.get('/Assessment');
      
      // Filter assessments to only show those from enrolled courses
      const filteredAssessments = assessmentsRes.data.filter(assessment =>
        enrolledRes.data.some(enrollment => enrollment.courseId === assessment.courseId)
      );
      
      setAssessments(filteredAssessments);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
      }
      setAssessments([]);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttempt = async (assessment) => {
    try {
      // Verify enrollment before allowing attempt
      const isEnrolled = enrolledCourses.some(
        enrollment => enrollment.courseId === assessment.courseId
      );

      if (!isEnrolled) {
        alert("You must be enrolled in this course to attempt the assessment.");
        return;
      }

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
      
      // Set the result with the response data
      setResult({
        score: res.data.score,
        total: res.data.total,
        percentage: res.data.percentage,
        passed: res.data.status === 'Passed'
      });
      
      // Clear answers after successful submission
      setAnswers({});
      
      // Dispatch custom event for assessment completion
      window.dispatchEvent(new CustomEvent('assessmentCompleted', {
        detail: {
          assessmentId: selectedAssessment.assessmentId,
          result: res.data
        }
      }));
      
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
          {enrolledCourses.length === 0 ? (
            <>
              <BiLockAlt size={32} className="text-primary mb-3" />
              <p className="mb-0">Enroll in courses to access their assessments.</p>
            </>
          ) : (
            "No assessments available for your enrolled courses."
          )}
        </Alert>
      ) : (
        <Row className="g-4">
          {assessments.map((assessment) => {
            const isEnrolled = enrolledCourses.some(
              enrollment => enrollment.courseId === assessment.courseId
            );

            return (
            <Col key={assessment.assessmentId} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-primary h5 mb-2">
                      {assessment.title}
                    </Card.Title>
                    <Card.Text className="text-muted mb-3">
                      Course: {assessment.courseTitle}
                    </Card.Text>
                    <Card.Text className="text-muted mb-3 small">
                      Instructor: {assessment.instructorName}
                    </Card.Text>
                    <div className="mt-auto">
                  <Button
                        variant="primary"
                    onClick={() => handleAttempt(assessment)}
                    className="w-100"
                        disabled={!isEnrolled}
                  >
                        {isEnrolled ? (
                          "Start Assessment"
                        ) : (
                          <>
                            <BiLockAlt className="me-2" />
                            Enroll to Access
                          </>
                        )}
                  </Button>
                    </div>
                  </Card.Body>
              </Card>
            </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default StudentAssessmentList; 
