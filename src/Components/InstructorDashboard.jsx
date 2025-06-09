import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, InputGroup, Spinner, Nav, Alert } from 'react-bootstrap';
import { BiUpload, BiFile, BiCopy } from 'react-icons/bi';
import EnrollmentAnalytics from './EnrollmentAnalytics';

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics');
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        mediaUrl: '',
        instructorId: user?.userId
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Add debug logs
    console.log('InstructorDashboard rendered with:', {
        user,
        activeTab,
        courseData
    });

    useEffect(() => {
        console.log('InstructorDashboard useEffect - checking user:', user);
        if (!user) {
            console.log('No user found, redirecting to login');
            navigate('/login');
            return;
        }

        if (user.role !== 'Instructor') {
            console.log('User is not an instructor, redirecting to home');
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await api.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadedUrl = response.data.fileUrl;
            setCourseData(prev => ({ ...prev, mediaUrl: uploadedUrl }));
            toast.success('File uploaded successfully!');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('URL copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy URL');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseData.mediaUrl) {
            toast.error('Please upload course material first!');
            return;
        }

        if (!user?.userId) {
            toast.error('Please log in again.');
            navigate('/login');
            return;
        }

        const coursePayload = {
            title: courseData.title,
            description: courseData.description,
            instructorId: user.userId
        };

        try {
            const response = await api.post('/Course', coursePayload);
            toast.success('Course created successfully!');
            // Reset form
            setCourseData({
                title: '',
                description: '',
                mediaUrl: '',
                instructorId: user.userId
            });
            // Switch to analytics tab
            setActiveTab('analytics');
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error(error.response?.data?.message || 'Failed to create course');
        }
    };

    const renderContent = () => {
        console.log('Rendering content for tab:', activeTab);
        
        switch (activeTab) {
            case 'analytics':
                console.log('Rendering EnrollmentAnalytics component');
                return <EnrollmentAnalytics />;
            case 'create-course':
                console.log('Rendering create course form');
                return (
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Card className="border-0">
                                <Card.Body className="p-4">
                                    <h2 className="text-primary mb-4">Create New Course</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Course Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={courseData.title}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter course title"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Course Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={courseData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                placeholder="Enter course description"
                                            />
                                        </Form.Group>

                                        <Card className="border-dashed border-primary bg-light mb-4">
                                            <Card.Body>
                                                <Card.Title as="h5" className="text-primary mb-3">Course Material</Card.Title>
                                                <div className="d-flex flex-column align-items-center gap-3">
                                                    <Form.Group controlId="fileInput" className="mb-0">
                                                        <Form.Label className="d-flex flex-column align-items-center gap-2 mb-0 cursor-pointer">
                                                            <BiUpload size={32} className="text-primary" />
                                                            <span className="text-primary fw-medium">Select File</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            className="d-none"
                                                        />
                                                    </Form.Group>

                                                    {selectedFile && (
                                                        <div className="d-flex align-items-center gap-2 text-muted">
                                                            <BiFile />
                                                            <small>{selectedFile.name}</small>
                                                        </div>
                                                    )}

                                                    <Button
                                                        variant="primary"
                                                        onClick={handleFileUpload}
                                                        disabled={!selectedFile || uploading}
                                                        className="w-100"
                                                    >
                                                        {uploading ? (
                                                            <>
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    className="me-2"
                                                                />
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            'Upload File'
                                                        )}
                                                    </Button>
                                                </div>

                                                {courseData.mediaUrl && (
                                                    <div className="mt-4 p-3 bg-white rounded">
                                                        <h6 className="text-muted mb-2">Uploaded Material URL:</h6>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                value={courseData.mediaUrl}
                                                                readOnly
                                                                className="bg-light"
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => copyToClipboard(courseData.mediaUrl)}
                                                            >
                                                                <BiCopy className="me-1" />
                                                                Copy
                                                            </Button>
                                                        </InputGroup>
                                                        <Form.Text className="text-muted">
                                                            Copy this URL to use in your course materials.
                                                        </Form.Text>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>

                                        <div className="d-grid">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                size="lg"
                                                style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                                            >
                                                Create Course
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                );
            default:
                console.log('No matching tab found');
                return null;
        }
    };

    if (!user) {
        return (
            <Container className="text-center py-5">
                <Alert variant="warning">
                    Please log in to access the instructor dashboard.
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <Nav
                variant="tabs"
                activeKey={activeTab}
                onSelect={(k) => {
                    console.log('Tab selected:', k);
                    setActiveTab(k);
                }}
                className="mb-4"
            >
                <Nav.Item>
                    <Nav.Link eventKey="analytics">Student Analytics</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create-course">Create Course</Nav.Link>
                </Nav.Item>
            </Nav>
            {renderContent()}
        </Container>
    );
};

export default InstructorDashboard; 
