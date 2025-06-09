import React, { useEffect, useState } from 'react';
import { api } from '../config/api';
import { useAuth } from '../Context/AuthContext';
import { Container, Row, Col, Card, Badge, Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import { format } from 'date-fns';

function EnrollmentAnalytics() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('EnrollmentAnalytics rendered with user:', user);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                console.log('Current user context:', user); // Debug log

                if (!user) {
                    console.log('No user found in context');
                    setError('No user found. Please log in again.');
                    setLoading(false);
                    return;
                }

                if (!user.userId) {
                    console.log('No userId found in user object:', user);
                    setError('User ID is missing. Please log in again.');
                    setLoading(false);
                    return;
                }

                if (user.role !== 'Instructor') {
                    console.log('User role is not Instructor:', user.role);
                    setError('Access denied. Only instructors can view analytics.');
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const apiUrl = `/CourseEnrollment/instructor/${user.userId}/analytics`;
                console.log('Making API request to:', apiUrl);

                const response = await api.get(apiUrl);
                console.log('Analytics API response:', response);

                if (!response.data) {
                    console.log('No data in response');
                    throw new Error('No data received from server');
                }

                // Handle both array and object responses
                const analyticsData = Array.isArray(response.data) ? response.data : 
                    response.data.message ? [] : [response.data];
                
                console.log('Processed analytics data:', analyticsData);
                setAnalytics(analyticsData);
                setError(null);
            } catch (err) {
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    stack: err.stack
                });

                let errorMessage = 'Failed to fetch enrollment analytics.';
                if (err.response?.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                } else if (err.response?.status === 403) {
                    errorMessage = 'You do not have permission to view these analytics.';
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        console.log('EnrollmentAnalytics useEffect triggered');
        fetchAnalytics();
    }, [user]);

    console.log('Current component state:', { loading, error, analytics });

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-primary">Loading enrollment analytics...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    {error.includes('log in') && (
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="outline-danger"
                                onClick={() => window.location.href = '/login'}
                            >
                                Log In Again
                            </Button>
                        </div>
                    )}
                </Alert>
            </Container>
        );
    }

    if (!analytics || analytics.length === 0) {
        return (
            <Container className="text-center py-5">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                    alt="No Data"
                    style={{ width: 90, marginBottom: 16, opacity: 0.7 }}
                />
                <p className="text-muted fw-medium fs-5">
                    No enrollment data available. Create courses to see student enrollment analytics.
                </p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <h2 className="text-primary mb-4">Course Enrollment Analytics</h2>
            <Row className="g-4">
                {analytics.map((course) => (
                    <Col key={course.courseId} md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-light border-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="h5 mb-0 text-primary">{course.courseTitle}</h3>
                                    <Badge bg="primary" pill>
                                        {course.totalEnrollments} {course.totalEnrollments === 1 ? 'Student' : 'Students'}
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-4">
                                    <h6 className="text-muted mb-3">Recent Enrollments</h6>
                                    {course.recentEnrollments && course.recentEnrollments.length > 0 ? (
                                        <ListGroup variant="flush">
                                            {course.recentEnrollments.map((enrollment, index) => (
                                                <ListGroup.Item 
                                                    key={`${enrollment.studentId}-${index}`}
                                                    className="px-0 py-2 border-0 border-bottom"
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="text-truncate">
                                                            <span className="fw-medium">{enrollment.studentName}</span>
                                                        </div>
                                                        <small className="text-muted ms-2">
                                                            {format(new Date(enrollment.enrollmentDate), 'MMM d, yyyy')}
                                                        </small>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p className="text-muted mb-0">No recent enrollments</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h6 className="text-muted mb-3">Enrollment Statistics</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">Total Students:</span>
                                            <span className="fw-medium">{course.totalEnrollments || 0}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">Latest Enrollment:</span>
                                            <span className="fw-medium">
                                                {course.recentEnrollments && course.recentEnrollments[0] 
                                                    ? format(new Date(course.recentEnrollments[0].enrollmentDate), 'MMM d, yyyy')
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default EnrollmentAnalytics; 