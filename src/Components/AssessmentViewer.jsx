import React from "react";
import { Container, Card, ListGroup, Badge, Alert } from 'react-bootstrap';

function AssessmentViewer({ questions }) {
  // If questions is a string, parse it
  let parsedQuestions = [];
  try {
    parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
  } catch {
    return <Alert variant="danger">Invalid questions format.</Alert>;
  }

  if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
    return <Alert variant="info">No questions to display.</Alert>;
  }

  return (
    <Container className="py-4">
      <h2 className="text-primary text-center mb-4">Assessment Preview</h2>
      {parsedQuestions.map((q, idx) => (
        <Card key={idx} className="mb-3 border-0 shadow-sm">
          <Card.Body>
            <Card.Title as="h5" className="text-primary d-flex align-items-center">
              <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', fontSize: '1rem' }}>
                Q{idx + 1}
              </span>
              {q.question}
            </Card.Title>
            <ListGroup variant="flush" className="mt-3">
              {q.options.map((opt, optIdx) => (
                <ListGroup.Item
                  key={optIdx}
                  className={
                    `d-flex align-items-center ${q.correctIndex === optIdx ? 'bg-success text-success bg-opacity-10 border-success' : ''}`
                  }
                >
                  <span className={
                    `fw-bold me-3 ${q.correctIndex === optIdx ? 'text-success' : 'text-muted'}`
                    }>
                    {String.fromCharCode(65 + optIdx)}.
                  </span>{" "}
                  {opt}
                  {q.correctIndex === optIdx && (
                    <Badge bg="success" className="ms-auto">Correct</Badge>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default AssessmentViewer;