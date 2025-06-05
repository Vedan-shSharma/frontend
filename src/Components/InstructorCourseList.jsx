import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import CourseForm from "./CourseForm";
import { useAuth } from "../Context/AuthContext";
import DeleteConfirmation from "./DeleteConfirmation";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Button, Modal, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { BiPlus, BiPencil, BiTrash, BiShow, BiX, BiFile, BiDownload } from 'react-icons/bi';

function InstructorCourseList({ onCoursesUpdate }) {
  const { user } = useAuth();
  const instructorId = user?.userId;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, courseId: null });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Course');
      const filtered = res.data.filter(
        (course) => course.instructorId === user?.userId
      );
      setCourses(filtered);
      if (onCoursesUpdate) {
        onCoursesUpdate(filtered);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user?.userId]);

  const handleDelete = async (id) => {
    setDeleteConfirmation({ isOpen: true, courseId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/Course/${deleteConfirmation.courseId}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setDeleteConfirmation({ isOpen: false, courseId: null });
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditCourse(null);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setEditCourse(null);
    if (refresh) {
      fetchCourses();
      toast.success(editCourse ? "Course updated successfully" : "Course created successfully");
    }
  };

  const handleView = (course) => {
    setViewCourse(course);
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
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
    <Container fluid className="py-4">
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="danger"
          onClick={handleAdd}
          className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
          style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
        >
          <BiPlus />
          Add Course
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-primary">Loading courses...</p>
        </div>
      ) : (
        <Row className="g-4">
          {courses.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center py-4">
                No courses yet. Click <b>+ Add Course</b> to get started!
              </Alert>
            </Col>
          ) : (
            courses.map((course) => (
              <Col key={course.courseId} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h5" className="text-primary mb-2">{course.title}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1 mb-3">
                      {course.description}
                    </Card.Text>
                    <div className="d-flex gap-2 mt-auto">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(course)}
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        <BiShow />
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(course)}
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        <BiPencil />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(course.courseId)}
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                        style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                      >
                        <BiTrash />
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
      {showForm && (
        <CourseForm
          course={editCourse}
          onClose={handleFormClose}
          instructorId={instructorId}
        />
      )}
      <Modal
        show={!!viewCourse}
        onHide={() => setViewCourse(null)}
        size="lg"
        centered
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="text-primary">Course Details</Modal.Title>
          <Button
            variant="link"
            className="text-muted p-0 ms-auto"
            onClick={() => setViewCourse(null)}
          >
            <BiX size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {viewCourse && (
            <Container fluid>
              <Row>
                <Col>
                  <h2 className="text-primary mb-3">{viewCourse.title}</h2>
                  <h3 className="h5 text-secondary mb-2">Description</h3>
                  <p className="text-muted mb-4">{viewCourse.description}</p>

                  {/* Course Materials Section */}
                  {viewCourse.materials && viewCourse.materials.length > 0 ? (
                    <div>
                      <h3 className="h5 text-secondary mb-3">Course Materials</h3>
                      <ListGroup>
                        {viewCourse.materials.map((material) => (
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
                            <Button
                              variant="link"
                              size="sm"
                              href={material.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary d-flex align-items-center gap-1"
                            >
                              <BiDownload />
                              Download
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  ) : (
                    <Alert variant="info">
                      No course materials available yet.
                    </Alert>
                  )}
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, courseId: null })}
        onConfirm={confirmDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </Container>
  );
}

export default InstructorCourseList;
