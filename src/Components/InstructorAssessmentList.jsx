import React, { useEffect, useState, useCallback } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import AssessmentForm from "./AssessmentForm";
import AssessmentViewer from "./AssessmentViewer";
import DeleteConfirmation from "./DeleteConfirmation";
import { toast } from "react-toastify";
import { fetchWithCache, invalidateCache } from "../utils/dataFetching";
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal } from "react-bootstrap";
import { BiPlus, BiPencil, BiTrash, BiX, BiShow } from "react-icons/bi";

function InstructorAssessmentList({ courses, showAssessments, onNewAssessment }) {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAssessment, setEditAssessment] = useState(null);
  const [viewAssessment, setViewAssessment] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, assessmentId: null });

  const fetchAssessments = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await fetchWithCache('Assessment', forceRefresh);
      
      // Filter assessments based on course IDs that belong to this instructor
      const courseIds = courses.map(course => course.courseId);
      const filtered = data.filter(assessment => 
        courseIds.includes(assessment.courseId)
      );
      
      // Check for new assessments
      if (assessments.length > 0 && filtered.length > assessments.length) {
        const newAssessment = filtered.find(assessment => 
          !assessments.some(a => a.assessmentId === assessment.assessmentId)
        );
        if (newAssessment && onNewAssessment) {
          onNewAssessment(newAssessment);
        }
      }
      
      setAssessments(filtered);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
      toast.error("Failed to fetch assessments");
    } finally {
      setLoading(false);
    }
  }, [courses, assessments.length, onNewAssessment]);

  useEffect(() => {
    if (showAssessments) {
      fetchAssessments();
    }
  }, [showAssessments, fetchAssessments]);

  const handleDelete = async (id) => {
    setDeleteConfirmation({ isOpen: true, assessmentId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/Assessment/${deleteConfirmation.assessmentId}`);
      invalidateCache('Assessment');
      toast.success("Assessment deleted successfully");
      fetchAssessments(true);
    } catch (error) {
      console.error("Error deleting assessment:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        return;
      }
      toast.error("Failed to delete assessment");
    } finally {
      setDeleteConfirmation({ isOpen: false, assessmentId: null });
    }
  };

  const handleEdit = (assessment) => {
    setEditAssessment(assessment);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditAssessment(null);
    setShowForm(true);
  };

  const handleFormClose = async (refresh = false) => {
    setShowForm(false);
    setEditAssessment(null);
    if (refresh) {
      invalidateCache('Assessment');
      await fetchAssessments(true);
      toast.success(editAssessment ? "Assessment updated successfully" : "Assessment created successfully");
    }
  };

  if (!showAssessments) return null;

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="primary"
            onClick={handleAdd}
            className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
            style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
          >
            <BiPlus />
            Add Assessment
          </Button>
        </div>

        {loading && assessments.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-primary fw-medium">Loading assessments...</p>
          </div>
        ) : (
          <Row className="g-4">
            {assessments.length === 0 ? (
              <Col>
                <Card className="border-0 text-center py-5">
                  <Card.Body>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                      alt="No Assessments"
                      className="mb-4"
                      style={{ width: 90, opacity: 0.7 }}
                    />
                    <p className="text-muted fw-medium mb-0">
                      No assessments found. Click <b>+ Add Assessment</b> to create one!
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              assessments.map((a) => (
                <Col key={a.assessmentId} md={6} lg={4}>
                  <Card className="h-100 border-0">
                    <Card.Header className="bg-white border-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="h5 mb-0 text-primary text-truncate me-2">{a.title}</h4>
                        <Badge bg="primary" className="px-3 py-2">
                          {a.maxScore} pts
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Badge bg="info" className="mb-0">
                        {courses.find((c) => c.courseId === a.courseId)?.title || "Unknown"}
                      </Badge>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setViewAssessment(a)}
                          className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                        >
                          <BiShow />
                          View
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleEdit(a)}
                          className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                        >
                          <BiPencil />
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(a.assessmentId)}
                          className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                        >
                          <BiTrash />
                          Delete
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}

        {showForm && (
          <AssessmentForm
            assessment={editAssessment}
            onClose={handleFormClose}
            courses={courses}
          />
        )}

        <Modal
          show={!!viewAssessment}
          onHide={() => setViewAssessment(null)}
          size="lg"
          centered
        >
          <Modal.Header className="border-0">
            <Modal.Title>Assessment Preview</Modal.Title>
            <Button
              variant="link"
              className="text-muted p-0 ms-auto"
              onClick={() => setViewAssessment(null)}
            >
              <BiX size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            {viewAssessment && (
              <AssessmentViewer questions={viewAssessment.questions} />
            )}
          </Modal.Body>
        </Modal>

        <DeleteConfirmation
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, assessmentId: null })}
          onConfirm={confirmDelete}
          title="Delete Assessment"
          message="Are you sure you want to delete this assessment? This action cannot be undone."
        />
      </Container>
    </Container>
  );
}

export default InstructorAssessmentList;