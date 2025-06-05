import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { Container, Row, Col, Card, Button, Modal, Spinner, Badge, Alert } from 'react-bootstrap';
import { BiX, BiShow } from 'react-icons/bi';

function InstructorAnalytics() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all results
      const resultsRes = await api.get('/Result');
      // Fetch all assessments
      const assessmentsRes = await api.get('/Assessment');
      // Fetch all courses
      const coursesRes = await api.get('/Course');

      // Filter courses to only include those created by the logged-in instructor
      const instructorCourses = coursesRes.data.filter(
        course => course.instructorId === user.userId
      );
      setCourses(instructorCourses);

      // Filter assessments to only include those from the instructor's courses
      const instructorAssessments = assessmentsRes.data.filter(assessment =>
        instructorCourses.some(course => course.courseId === assessment.courseId)
      );
      setAssessments(instructorAssessments);

      // Filter results to only include those from the instructor's assessments
      const instructorResults = resultsRes.data.filter(result =>
        instructorAssessments.some(assessment => assessment.assessmentId === result.assessmentId)
      );
      // Attach user data to results (assuming user data is available in the result object or can be fetched)
      // For now, using dummy user name if not available
      const resultsWithUser = instructorResults.map(result => ({...result, user: { name: 'Student User' }})); // Replace with actual user fetching if needed

      setResults(resultsWithUser);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setResults([]);
      setAssessments([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentStats = (assessmentId) => {
    const assessmentResults = results.filter(r => r.assessmentId === assessmentId);
    if (assessmentResults.length === 0) return null;

    const totalAttempts = assessmentResults.length;
    const totalScore = assessmentResults.reduce((sum, r) => sum + r.score, 0);
    const assessment = assessments.find(a => a.assessmentId === assessmentId);
    const maxScore = assessment?.questions ?
      JSON.parse(assessment.questions).length : 0;
    const avgScore = totalAttempts > 0 ? (totalScore / totalAttempts) : 0;
    const avgPercentage = maxScore > 0 ? Math.round((avgScore / maxScore) * 100) : 0;

    return {
      totalAttempts,
      avgScore: avgScore.toFixed(1),
      maxScore,
      avgPercentage
    };
  };

  if (loading) {
    return (
      <Container className="text-center py-5 min-vh-100">
        <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
        <p className="mt-3 text-primary">Loading analytics...</p>
      </Container>
    );
  }

  if (assessments.length === 0) {
    return (
      <Container className="text-center py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Data"
          style={{ width: 90, marginBottom: 16, opacity: 0.7 }}
        />
        <p className="text-muted fw-medium fs-5">
          No assessment data available yet. Create courses and assessments to see student performance analytics.
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="text-primary mb-4">Student Performance Analytics</h2>

      <Row className="g-4">
        {assessments.map((assessment) => {
          const stats = getAssessmentStats(assessment.assessmentId);
          if (!stats) return null;

          return (
            <Col key={assessment.assessmentId} md={6} lg={4}>
              <Card className="h-100 border-0">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <Card.Title as="h5" className="text-primary mb-0 me-2">{assessment.title}</Card.Title>
                  <Badge bg="primary" className="px-2 py-1">
                    {courses.find(c => c.courseId === assessment.courseId)?.title || 'Unknown Course'}
                  </Badge>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                   <div className="mb-2">
                    <small className="text-muted">Total Attempts:</small>
                    <div className="fw-bold">{stats.totalAttempts}</div>
                   </div>
                   <div className="mb-2">
                    <small className="text-muted">Average Score:</small>
                    <div className="fw-bold">{stats.avgScore}/{stats.maxScore}</div>
                   </div>
                   <div className="mb-3">
                    <small className="text-muted">Average Percentage:</small>
                    <div className="fw-bold text-primary">{stats.avgPercentage}%</div>
                   </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button
                    variant="danger"
                    onClick={() => setSelectedAssessment(assessment)}
                    className="w-100"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedAssessment && (
        <Modal
          show={!!selectedAssessment}
          onHide={() => setSelectedAssessment(null)}
          size="lg"
          centered
        >
          <Modal.Header className="border-0 pb-0">
            <Modal.Title className="text-primary">Detailed Results: {selectedAssessment.title}</Modal.Title>
            <Button
              variant="link"
              className="text-muted p-0 ms-auto"
              onClick={() => setSelectedAssessment(null)}
            >
              <BiX size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Attempt Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .filter(r => r.assessmentId === selectedAssessment.assessmentId)
                    .map((result) => {
                      const assessment = assessments.find(a => a.assessmentId === result.assessmentId);
                      const maxScore = assessment?.questions ? JSON.parse(assessment.questions).length : 0;
                      const percentage = maxScore > 0 ? Math.round((result.score / maxScore) * 100) : 0;

                      return (
                        <tr key={result.resultId}>
                          <td>{result.user?.name || 'Unknown Student'}</td>
                          <td>{result.score}/{maxScore}</td>
                          <td>{percentage}%</td>
                          <td>
                            {new Date(result.attemptDate).toLocaleDateString('en-GB')}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}

export default InstructorAnalytics; 
