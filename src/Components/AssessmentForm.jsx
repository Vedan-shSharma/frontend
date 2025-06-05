import React, { useState, useEffect } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import Notification from "./Notification";
import { Modal, Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { BiArrowBack, BiPlus, BiTrash, BiCheck } from "react-icons/bi";

function AssessmentForm({ assessment, onClose, courses }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(assessment?.title || "");
  const [courseId, setCourseId] = useState(assessment?.courseId || "");
  const [questions, setQuestions] = useState(() => {
    if (assessment?.questions) {
      try {
        return JSON.parse(assessment.questions);
      } catch {
        return [{
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0
        }];
      }
    }
    return [{
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0
    }];
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Set initial course if none selected
  useEffect(() => {
    if (!courseId && courses.length > 0) {
      setCourseId(courses[0].courseId);
    }
  }, [courses]);

  // Add event listener for browser back button
  React.useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      handleClose();
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  const handleQuestionChange = (idx, value) => {
    setQuestions(qs => {
      const copy = [...qs];
      copy[idx].question = value;
      return copy;
    });
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuestions(qs => {
      const copy = [...qs];
      copy[qIdx].options[optIdx] = value;
      return copy;
    });
  };

  const handleCorrectIndexChange = (qIdx, value) => {
    setQuestions(qs => {
      const copy = [...qs];
      copy[qIdx].correctIndex = parseInt(value, 10);
      return copy;
    });
  };

  const addQuestion = (idx) => {
    setQuestions(qs => {
      const copy = [...qs];
      copy.splice(idx + 1, 0, { question: "", options: ["", "", "", ""], correctIndex: 0 });
      return copy;
    });
  };

  const removeQuestion = (idx) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { title, courseId, questions });

    // Validate all required fields
    if (!title.trim()) {
      setNotification({ message: "Assessment title is required.", type: "error" });
      return;
    }

    if (!courseId) {
      setNotification({ message: "Please select a course for this assessment.", type: "error" });
      return;
    }

    if (questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()))) {
      setNotification({ message: "All questions and options must be filled out.", type: "error" });
      return;
    }

    setLoading(true);
    const payload = {
      title: title.trim(),
      courseId: courseId.toString(),
      questions: JSON.stringify(questions),
      maxScore: questions.length
    };
    console.log('Sending payload to API:', payload);

    try {
      if (assessment) {
        const response = await api.put(`/Assessment/${assessment.assessmentId}`, payload);
        console.log('Update Response:', response);
        setNotification({ message: "Assessment updated successfully!", type: "success" });
        setTimeout(() => onClose(true), 1000);
      } else {
        console.log('Making POST request to /Assessment');
        const response = await api.post('/Assessment', payload);
        console.log('Create Response:', response);
        setNotification({ message: "Assessment created successfully!", type: "success" });
        onClose(true);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      if (error.response?.status === 401) {
        setNotification({ message: "Your session has expired. Please log in again.", type: "error" });
        setTimeout(() => onClose(false), 1000);
      } else {
        setNotification({ 
          message: error.response?.data?.message || "Error saving assessment", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      className="assessment-form-modal"
    >
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
          {assessment ? "Edit Assessment" : "Add New Assessment"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                  required
                  isInvalid={!courseId}
                >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>{c.title}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a course
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Assessment Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="questions-container">
            <h4 className="text-primary text-center mb-4">MCQ Questions</h4>
            {questions.map((q, qIdx) => (
              <Card key={qIdx} className="mb-4 border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 text-primary">Question {qIdx + 1}</h5>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeQuestion(qIdx)}
                      disabled={questions.length === 1}
                      className="d-flex align-items-center gap-1"
                    >
                      <BiTrash />
                      Remove
                    </Button>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={`Enter question ${qIdx + 1}`}
                      value={q.question}
                      onChange={e => handleQuestionChange(qIdx, e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="options-container">
                    {q.options.map((opt, optIdx) => (
                      <Form.Group key={optIdx} className="mb-2">
                        <InputGroup>
                          <InputGroup.Text className="bg-light">
                            <Form.Check
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                              className="m-0"
                            />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder={`Enter option ${optIdx + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addQuestion(qIdx)}
                    className="mt-3 d-flex align-items-center gap-1"
                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                  >
                    <BiPlus />
                    Add Question
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center mt-4">
            <Button
              variant="danger"
              type="submit"
              disabled={loading}
              className="px-4 py-2 fw-semibold"
              style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
            >
              {loading ? "Saving..." : assessment ? "Update Assessment" : "Create Assessment"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AssessmentForm;
