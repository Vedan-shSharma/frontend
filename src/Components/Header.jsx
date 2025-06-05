import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BiUser, BiLogOut, BiBook, BiBarChartAlt2 } from 'react-icons/bi';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      fixed="top" 
      className="border-bottom"
      style={{ height: 'var(--header-height)' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <BiBook className="me-2" />
          EduSync
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                {user.role === 'Student' && (
                  <Nav.Link as={Link} to="/student">
                    <BiBarChartAlt2 className="me-1" />
                    Dashboard
                  </Nav.Link>
                )}
                {user.role === 'Instructor' && (
                  <Nav.Link as={Link} to="/instructor">
                    <BiBarChartAlt2 className="me-1" />
                    Dashboard
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>

          {user && (
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    <BiUser className="me-1" />
                    {user.name || user.email}
                  </span>
                } 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to={user.role === 'Student' ? '/student' : '/instructor'}>
                  <BiBarChartAlt2 className="me-2" />
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <BiLogOut className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 