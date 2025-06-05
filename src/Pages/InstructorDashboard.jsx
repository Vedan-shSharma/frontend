import React, { useState, useEffect } from "react";
import LogoutButton from "../Components/LogoutButton";
import InstructorCourseList from "../Components/InstructorCourseList";
import InstructorAssessmentList from "../Components/InstructorAssessmentList";
import { useAuth } from "../Context/AuthContext";
import { api } from '../config/api';
import InstructorAnalytics from "../Components/InstructorAnalytics";
import LoadingSpinner from "../Components/LoadingSpinner";
import Notification from "../Components/Notification";
import FileUpload from "../Components/FileUpload";
import { Container, Row, Col, Button, Collapse, Card, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import { BiBook, BiListUl, BiBarChart, BiUpload, BiUserCircle, BiChevronDown } from 'react-icons/bi';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const instructorName = user?.name || "Instructor";
  const instructorRole = user?.role || "Instructor";
  const [courses, setCourses] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Course');
      const filtered = response.data.filter(
        (course) => course.instructorId === user?.userId
      );
      
      // Check for new courses
      if (courses.length > 0 && filtered.length > courses.length) {
        const newCourse = filtered.find(course => !courses.some(c => c.courseId === course.courseId));
        if (newCourse) {
          showNotification(`New course "${newCourse.title}" has been added!`);
        }
      }
      
      setCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Log specific error details
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleCoursesUpdate = (updatedCourses) => {
    // Check if there's a new course
    if (updatedCourses.length > courses.length) {
      const newCourse = updatedCourses.find(course => !courses.some(c => c.courseId === course.courseId));
      if (newCourse) {
        showNotification(`New course "${newCourse.title}" has been added!`);
      }
    }
    setCourses(updatedCourses);
  };

  const handleNewAssessment = (assessment) => {
    showNotification(`New assessment "${assessment.title}" has been added!`);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSectionToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleFileUploadSuccess = (fileUrl) => {
    showNotification(`File uploaded successfully! URL: ${fileUrl}`);
  };

  return (
    <div className="bg-light min-vh-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header Bar */}
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" className="text-primary fw-bold">Instructor Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="flex-grow-1"></div> {/* Spacer */}
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                    {getInitials(instructorName)}
                  </div>
                  <span className="d-none d-lg-inline me-1 text-dark">{instructorName}</span>
                  <BiChevronDown className="text-muted"/>
                </div>
              }
              id="avatar-dropdown"
              align="end"
            >
               <NavDropdown.ItemText>
                <div className="fw-bold">{instructorName}</div>
                <div className="text-muted small">{instructorRole}</div>
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              <NavDropdown.Item as="div">
                 <LogoutButton variant="link" className="text-danger w-100 text-start">Logout</LogoutButton>
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Dashboard Content */}
      <Container className="py-4">
        <h2 className="text-primary mb-4">Welcome, {instructorName}!</h2>
        <p className="text-muted mb-4">Empower your students. Manage your courses and assessments.</p>

        {/* Courses Section */}
        <Card className="mb-3 border-0 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center cursor-pointer" onClick={() => handleSectionToggle('courses')}>
             <span className="d-flex align-items-center gap-2 text-primary fw-bold">
                <BiBook size={20}/>
                Your Courses
             </span>
             <BiChevronDown className={`text-muted ${openSection === 'courses' ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease' }}/>
          </Card.Header>
          <Collapse in={openSection === 'courses'}>
            <Card.Body>
              {loading ? (
                 <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
                  <p className="mt-2 text-primary">Loading courses...</p>
                 </div>
              ) : (
                <InstructorCourseList onCoursesUpdate={handleCoursesUpdate} />
              )}
            </Card.Body>
          </Collapse>
        </Card>

        {/* Assessment Manager Section */}
        <Card className="mb-3 border-0 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center cursor-pointer" onClick={() => handleSectionToggle('assessments')}>
             <span className="d-flex align-items-center gap-2 text-primary fw-bold">
                <BiListUl size={20}/>
                Assessment Manager
             </span>
             <BiChevronDown className={`text-muted ${openSection === 'assessments' ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease' }}/>
          </Card.Header>
          <Collapse in={openSection === 'assessments'}>
            <Card.Body>
              {loading ? (
                 <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
                  <p className="mt-2 text-primary">Loading assessments...</p>
                 </div>
              ) : (
                <InstructorAssessmentList courses={courses} showAssessments={openSection === 'assessments'} onNewAssessment={handleNewAssessment} />
              )}
            </Card.Body>
          </Collapse>
        </Card>

        {/* Analytics Section */}
        <Card className="mb-3 border-0 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center cursor-pointer" onClick={() => handleSectionToggle('analytics')}>
             <span className="d-flex align-items-center gap-2 text-primary fw-bold">
                <BiBarChart size={20}/>
                Student Performance Analytics
             </span>
             <BiChevronDown className={`text-muted ${openSection === 'analytics' ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease' }}/>
          </Card.Header>
          <Collapse in={openSection === 'analytics'}>
            <Card.Body>
              {loading ? (
                 <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" style={{ color: '#1a73e8' }} />
                  <p className="mt-2 text-primary">Loading analytics...</p>
                 </div>
              ) : (
                <InstructorAnalytics />
              )}
            </Card.Body>
          </Collapse>
        </Card>

         {/* File Upload Section */}
        <Card className="mb-3 border-0 shadow-sm">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center cursor-pointer" onClick={() => handleSectionToggle('files')}>
             <span className="d-flex align-items-center gap-2 text-primary fw-bold">
                <BiUpload size={20}/>
                File Upload
             </span>
             <BiChevronDown className={`text-muted ${openSection === 'files' ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease' }}/>
          </Card.Header>
          <Collapse in={openSection === 'files'}>
            <Card.Body>
               <FileUpload onUploadSuccess={handleFileUploadSuccess}/>
            </Card.Body>
          </Collapse>
        </Card>

      </Container>
    </div>
  );
};

export default InstructorDashboard;