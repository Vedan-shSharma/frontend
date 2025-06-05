import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { BiUpload, BiFile, BiCopy } from 'react-icons/bi';

<<<<<<< HEAD
=======
const API_URL = "https://edusyncvirendrabackend-g2gyedfxasagg2dt.centralindia-01.azurewebsites.net/api";

>>>>>>> 90fcf49e65abd094749387b70921189a722f8d82
const InstructorDashboard = () => {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        mediaUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
            const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
            toast.error(`Error uploading file: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseData.mediaUrl) {
            toast.error('Please upload course material first!');
            return;
        }

        try {
            const response = await api.post('/courses', courseData);
            toast.success('Course created successfully!');
            navigate('/courses');
        } catch (error) {
            toast.error('Error creating course: ' + (error.response?.data?.message || error.message));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                toast.success('URL copied to clipboard!');
            },
            () => {
                toast.error('Failed to copy URL');
            }
        );
    };

    return (
        <Container className="py-4">
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
                                                variant="danger"
                                                onClick={handleFileUpload}
                                                disabled={!selectedFile || uploading}
                                                className="px-4 py-2 fw-semibold"
                                                style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    'Upload Material'
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

                                <div className="text-center mt-4">
                                    <Button
                                        type="submit"
                                        variant="danger"
                                        disabled={!courseData.mediaUrl}
                                        className="px-4 py-2 fw-semibold"
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
        </Container>
    );
};

export default InstructorDashboard; 
