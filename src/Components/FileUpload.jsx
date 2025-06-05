import React, { useState } from 'react';
import { api } from '../config/api';
import { toast } from 'react-toastify';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { BiUpload, BiCopy, BiFile } from 'react-icons/bi';

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
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
            setUploadedUrl(uploadedUrl);
            toast.success('File uploaded successfully!');
            onUploadSuccess(uploadedUrl);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
            toast.error(`Error uploading file: ${errorMessage}`);
        } finally {
            setUploading(false);
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
            <Card className="border-0">
                <Card.Body className="p-4">
                    <div className="text-center border border-2 border-dashed rounded-3 p-4 mb-4">
                        <Form.Group controlId="fileInput" className="mb-3">
                            <Form.Label className="d-flex flex-column align-items-center gap-2 mb-0">
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
                            <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                                <BiFile />
                                <small>{selectedFile.name}</small>
                            </div>
                        )}

                        <Button
                            variant="danger"
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="mt-3 px-4"
                            style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>

                    {uploadedUrl && (
                        <Card className="bg-light border-0">
                            <Card.Body>
                                <Card.Title as="h6" className="text-muted mb-3">
                                    Uploaded File URL:
                                </Card.Title>
                                <InputGroup className="mb-2">
                                    <Form.Control
                                        type="text"
                                        value={uploadedUrl}
                                        readOnly
                                        className="bg-white"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => copyToClipboard(uploadedUrl)}
                                    >
                                        <BiCopy className="me-1" />
                                        Copy
                                    </Button>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Click the copy button to copy this URL for use in your course
                                </Form.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FileUpload; 
