import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { Container, Row, Col, Card, Button, Modal, Spinner, Badge, Alert } from 'react-bootstrap';
import { BiX, BiShow, BiTrendingUp, BiGroup, BiTime } from 'react-icons/bi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function InstructorAnalytics() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    completionRate: 0,
    assessmentsTaken: 0
  });

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
      // Fetch enrollment analytics for the instructor
      const enrollmentsRes = await api.get(`/CourseEnrollment/instructor/${user.userId}/analytics`);

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

      // Calculate overall statistics using enrollment data
      const enrollmentData = enrollmentsRes.data || [];
      const uniqueStudents = new Set(
        enrollmentData.flatMap(course => 
          course.enrolledStudents?.map(student => student.studentId) || []
        )
      ).size;

      const totalPossibleScore = instructorAssessments.reduce((sum, assessment) => {
        try {
          const questions = JSON.parse(assessment.questions || '[]');
          return sum + questions.length;
        } catch (e) {
          console.error('Error parsing questions:', e);
          return sum;
        }
      }, 0);

      const totalActualScore = instructorResults.reduce((sum, result) => 
        sum + (Number.isFinite(result.score) ? result.score : 0), 0);

      const totalActualAttempts = instructorResults.length;

      // Calculate average score only if there are attempts
      const averageScore = totalActualAttempts > 0 
        ? Math.round((totalActualScore / totalActualAttempts) * 100) / 100 
        : 0;

      // Calculate completion rate
      const totalPossibleAttempts = uniqueStudents * instructorAssessments.length;
      const completionRate = totalPossibleAttempts > 0 
        ? Math.round((totalActualAttempts / totalPossibleAttempts) * 100) 
        : 0;

      setOverallStats({
        totalStudents: uniqueStudents || 0,
        averageScore: averageScore || 0,
        completionRate: completionRate || 0,
        assessmentsTaken: totalActualAttempts || 0
      });

      setResults(instructorResults);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      setResults([]);
      setAssessments([]);
      setCourses([]);
      // Set default values for stats on error
      setOverallStats({
        totalStudents: 0,
        averageScore: 0,
        completionRate: 0,
        assessmentsTaken: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentStats = (assessmentId) => {
    const assessmentResults = results.filter(r => r.assessmentId === assessmentId);
    if (assessmentResults.length === 0) return null;

    const totalAttempts = assessmentResults.length;
    const totalScore = assessmentResults.reduce((sum, r) => 
      sum + (Number.isFinite(r.score) ? r.score : 0), 0);
    const assessment = assessments.find(a => a.assessmentId === assessmentId);
    
    let maxScore = 0;
    try {
      maxScore = assessment?.questions ? JSON.parse(assessment.questions).length : 0;
    } catch (e) {
      console.error('Error parsing questions:', e);
    }

    const avgScore = totalAttempts > 0 ? (totalScore / totalAttempts) : 0;
    const avgPercentage = maxScore > 0 ? Math.round((avgScore / maxScore) * 100) : 0;

    return {
      totalAttempts,
      avgScore: avgScore.toFixed(1),
      maxScore,
      avgPercentage
    };
  };

  const getPerformanceChartData = () => {
    const labels = assessments.map(a => a.title || 'Untitled Assessment');
    const data = assessments.map(a => {
      const stats = getAssessmentStats(a.assessmentId);
      return stats ? stats.avgPercentage : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Average Score (%)',
          data,
          backgroundColor: 'rgba(233, 30, 99, 0.5)',
          borderColor: '#e91e63',
          borderWidth: 2,
        },
      ],
    };
  };

  const getCompletionRateData = () => {
    const labels = courses.map(c => c.title || 'Untitled Course');
    const data = courses.map(course => {
      const courseAssessments = assessments.filter(a => a.courseId === course.courseId);
      const totalAttempts = results.filter(r => 
        courseAssessments.some(a => a.assessmentId === r.assessmentId)
      ).length;
      const totalPossible = courseAssessments.length * overallStats.totalStudents;
      return totalPossible > 0 ? Math.round((totalAttempts / totalPossible) * 100) : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Completion Rate (%)',
          data,
          backgroundColor: 'rgba(25, 118, 210, 0.5)',
          borderColor: '#1976d2',
          borderWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
        <p className="mt-3 text-primary">Loading analytics...</p>
      </Container>
    );
  }

  if (assessments.length === 0) {
    return (
      <Container className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
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
      {/* Overall Statistics */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <BiGroup className="text-primary mb-2" size={32} />
              <h6 className="text-muted mb-1">Total Students</h6>
              <h3 className="mb-0">{overallStats.totalStudents}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <BiTrendingUp className="text-primary mb-2" size={32} />
              <h6 className="text-muted mb-1">Average Score</h6>
              <h3 className="mb-0">{overallStats.averageScore}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <BiTime className="text-primary mb-2" size={32} />
              <h6 className="text-muted mb-1">Completion Rate</h6>
              <h3 className="mb-0">{overallStats.completionRate}%</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column align-items-center">
              <BiShow className="text-primary mb-2" size={32} />
              <h6 className="text-muted mb-1">Assessments Taken</h6>
              <h3 className="mb-0">{overallStats.assessmentsTaken}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance Charts */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="text-primary mb-4">Assessment Performance</h5>
              <Bar 
                data={getPerformanceChartData()} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="text-primary mb-4">Course Completion Rates</h5>
              <Line 
                data={getCompletionRateData()} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Individual Assessment Cards */}
      <h5 className="text-primary mb-4">Assessment Details</h5>
      <Row className="g-4">
        {assessments.map((assessment) => {
          const stats = getAssessmentStats(assessment.assessmentId);
          if (!stats) return null;

          return (
            <Col key={assessment.assessmentId} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm">
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

      {/* Detailed Results Modal */}
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
