import React, { useEffect, useState, useCallback } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Button, Modal, Spinner, Badge, Alert } from 'react-bootstrap';
import { BiX } from 'react-icons/bi';

const DEBOUNCE_DELAY = 300; // 300ms delay for debouncing

function StudentProgressTracker() {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced fetch function
  const debouncedFetch = useCallback((func) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, DEBOUNCE_DELAY);
    };
  }, []);

  const fetchAssessmentHistory = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      // Fetch all results
      const resultsRes = await api.get('/Result');
      // Filter results for current user
      const userResults = resultsRes.data.filter(result => result.userId === user.userId);
      
      // Fetch all assessments to get assessment titles
      const assessmentsRes = await api.get('/Assessment');
      
      // Fetch all courses
      const coursesRes = await api.get('/Course');
      setCourses(coursesRes.data);
      
      // Map results to include assessment titles and calculate percentages
      const history = userResults.map(result => {
        const assessment = assessmentsRes.data.find(a => a.assessmentId === result.assessmentId);
        const maxScore = assessment ? JSON.parse(assessment.questions).length : 0;
        const percentage = Math.round((result.score / maxScore) * 100);
        const course = coursesRes.data.find(c => c.courseId === assessment?.courseId);
        
        return {
          attemptId: result.resultId,
          assessmentId: result.assessmentId,
          assessmentTitle: assessment?.title || 'Unknown Assessment',
          courseTitle: course?.title || 'Unknown Course',
          score: result.score,
          maxScore: maxScore,
          percentage: percentage,
          attemptDate: result.attemptDate
        };
      });
      
      setAssessmentHistory(history);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
      toast.error("Failed to fetch assessment history");
      setAssessmentHistory([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [user.userId]);

  // Initial fetch
  useEffect(() => {
    fetchAssessmentHistory(true);
  }, [fetchAssessmentHistory]);

  // Set up polling with debouncing
  useEffect(() => {
    const debouncedFetchHistory = debouncedFetch(() => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        fetchAssessmentHistory(false);
      }
    });

    const pollInterval = setInterval(debouncedFetchHistory, 5000);
    return () => clearInterval(pollInterval);
  }, [debouncedFetch, fetchAssessmentHistory, isRefreshing]);

  // Listen for custom event when assessment is completed
  useEffect(() => {
    const handleAssessmentComplete = () => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        fetchAssessmentHistory(false);
      }
    };

    window.addEventListener('assessmentCompleted', handleAssessmentComplete);
    return () => window.removeEventListener('assessmentCompleted', handleAssessmentComplete);
  }, [fetchAssessmentHistory, isRefreshing]);

  if (loading) {
    return (
      <Container className="text-center py-5 min-vh-100">
        <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
        <p className="mt-3 text-primary">Loading assessment history...</p>
      </Container>
    );
  }

  if (assessmentHistory.length === 0) {
    return (
      <Container className="text-center py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Data"
          style={{ width: 90, marginBottom: 16, opacity: 0.7 }}
        />
        <p className="text-muted fw-medium fs-5">
          No assessment attempts yet. Complete assessments to track your progress.
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {assessmentHistory.map((assessment) => (
          <Col key={assessment.attemptId} md={6} lg={4}>
            <Card className="h-100 border-0">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <Card.Title as="h5" className="text-primary mb-0 me-2">{assessment.assessmentTitle}</Card.Title>
                <Badge bg="primary" className="px-2 py-1">
                  {assessment.percentage}%
                </Badge>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Badge bg="info" className="mb-2 align-self-start">
                  {assessment.courseTitle}
                </Badge>
                <small className="text-muted mb-3">
                  Attempt Date: {new Date(assessment.attemptDate).toLocaleDateString('en-GB')}
                </small>
                <Button
                  variant="danger"
                  onClick={() => setSelectedAssessment(assessment)}
                  className="mt-auto w-100"
                  style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        show={!!selectedAssessment}
        onHide={() => setSelectedAssessment(null)}
        centered
        size="md"
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="text-primary">{selectedAssessment?.assessmentTitle} - Details</Modal.Title>
          <Button
            variant="link"
            className="text-muted p-0 ms-auto"
            onClick={() => setSelectedAssessment(null)}
          >
            <BiX size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedAssessment && (
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="bg-primary text-white rounded-circle d-flex flex-column align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                <div className="fs-3 fw-bold">{selectedAssessment.percentage}%</div>
                <small>Score</small>
              </div>
              <div className="row w-100">
                <div className="col text-end">
                  <div className="text-muted small">Marks Obtained</div>
                  <div className="fw-bold">{selectedAssessment.score}/{selectedAssessment.maxScore}</div>
                </div>
                <div className="col text-start">
                  <div className="text-muted small">Attempt Date</div>
                  <div className="fw-bold">{new Date(selectedAssessment.attemptDate).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default StudentProgressTracker; 
