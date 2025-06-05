import React, { useState, useEffect } from "react";
import { api } from '../config/api';
import Notification from "./Notification";
import { Modal, Form, Button, Container, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { BiArrowBack, BiUpload, BiTrash, BiFile } from 'react-icons/bi';

function CourseForm({ course, onClose, instructorId }) {
  const [title, setTitle] = useState(course ? course.title : "");
  const [description, setDescription] = useState(course ? course.description : "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [materials, setMaterials] = useState(course?.materials || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!instructorId) {
      setNotification({ 
        message: "Instructor ID is missing. Please log in again.", 
        type: "error" 
      });
      setLoading(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      instructorId: instructorId
    };

    try {
      if (course) {
        // For update
        const response = await api.put(`/Course/${course.courseId}`, payload);
        setNotification({ 
          message: "Course updated successfully!", 
          type: "success" 
        });
        
        // If there's a new file selected, upload it as course material
        if (selectedFile) {
          await uploadMaterial(course.courseId, selectedFile);
        }
        
        setTimeout(() => onClose(true), 1000);
      } else {
        // For create
        const response = await api.post('/Course', payload);
        const newCourseId = response.data.courseId;
        
        // If there's a file selected, upload it as course material
        if (selectedFile) {
          await uploadMaterial(newCourseId, selectedFile);
        }
        
        setNotification({ 
          message: "Course created successfully!", 
          type: "success" 
        });
        setTimeout(() => onClose(true), 1000);
      }
    } catch (error) {
      console.error("Error saving course:", error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setNotification({ message: "Error saving course", type: "error" });
      } else {
        setNotification({ 
          message: error.response?.data?.message || "Error saving course", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadMaterial = async (courseId, file, description = "") => {
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await api.post(`/CourseMaterial/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMaterials(prev => [...prev, response.data]);
      setSelectedFile(null);
      return response.data;
    } catch (error) {
      console.error('Error uploading material:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
      setNotification({ message: `Error uploading material: ${errorMessage}`, type: "error" });
      throw error;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                          'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
                          'video/mp4', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setNotification({ 
          message: "Invalid file type. Allowed types: PDF, DOCX, PPTX, MP4, JPG, PNG", 
          type: "error" 
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await api.delete(`/CourseMaterial/${materialId}`);
      setMaterials(prev => prev.filter(m => m.materialId !== materialId));
      setNotification({ message: "Material deleted successfully", type: "success" });
    } catch (error) {
      console.error("Error deleting material:", error);
      setNotification({ 
        message: error.response?.data?.message || "Error deleting material", 
        type: "error" 
      });
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      case 'mp4': return '🎥';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <Modal show={true} onHide={handleClose} centered backdrop="static" size="lg">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Modal.Header className="border-0 pb-0">
        <Button
          variant="link"
          className="text-muted p-0 me-3"
          onClick={handleClose}
        >
          <BiArrowBack size={24} />
        </Button>
        <Modal.Title className="text-primary">
          {course ? "Edit Course" : "Add New Course"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              isInvalid={!!errors.Title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.Title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          {/* Course Materials Section */}
          <Form.Group className="mb-3">
            <Form.Label>Course Materials</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx,.mp4,.jpg,.jpeg,.png"
              disabled={uploadingFile}
            />
            <Form.Text className="text-muted">
              Supported formats: PDF, DOCX, PPTX, MP4, JPG, PNG
            </Form.Text>
          </Form.Group>

          {/* Materials List */}
          {materials.length > 0 && (
            <div className="mb-3">
              <h6 className="mb-2">Uploaded Materials</h6>
              <ListGroup>
                {materials.map((material) => (
                  <ListGroup.Item key={material.materialId} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <span className="me-2">{getFileIcon(material.fileType)}</span>
                      <div>
                        <div className="fw-medium">{material.fileName}</div>
                        {material.description && (
                          <small className="text-muted">{material.description}</small>
                        )}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary p-0"
                      >
                        <BiFile size={20} />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleDeleteMaterial(material.materialId)}
                        className="text-danger p-0"
                      >
                        <BiTrash size={20} />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="light" onClick={handleClose} className="px-4">
              Cancel
            </Button>
            <Button 
              variant="danger"
              type="submit"
              disabled={loading || uploadingFile}
              className="px-4"
            >
              {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    minWidth: "320px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "-0.5rem",
    marginBottom: "0.5rem",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  },
  saveBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#f1f5f9",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
  },
};

export default CourseForm;
