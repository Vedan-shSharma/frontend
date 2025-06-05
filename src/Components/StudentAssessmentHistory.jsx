import React, { useEffect, useState } from "react";
import { api } from '../config/api';
import { useAuth } from "../Context/AuthContext";
import { Container, Spinner, Alert, Table, Card } from 'react-bootstrap';

<<<<<<< HEAD
=======
const API_URL = "https://edusyncvirendrabackend-g2gyedfxasagg2dt.centralindia-01.azurewebsites.net/api";

>>>>>>> 90fcf49e65abd094749387b70921189a722f8d82
function StudentAssessmentHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentHistory();
  }, []);

  const fetchAssessmentHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Assessment/history/${user.userId}`);
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5 min-vh-100">
        <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
        <p className="mt-3 text-primary">Loading assessment history...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="text-primary mb-4">Assessment History</h2>
      {history.length === 0 ? (
        <Alert variant="info" className="text-center py-4 shadow-sm">
          No assessment attempts yet.
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th>Assessment Title</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Attempt Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((attempt) => (
                    <tr key={attempt.attemptId}>
                      <td>{attempt.assessmentTitle}</td>
                      <td>{attempt.score}/{attempt.maxScore}</td>
                      <td>{attempt.percentage}%</td>
                      <td>
                        {new Date(attempt.attemptDate).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default StudentAssessmentHistory; 
